
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types';
import { useToast } from './use-toast';
import { useAuth } from '@/context/AuthContext';

export function useDocuments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Obtener todos los documentos
  const { data: documents, isLoading: isLoadingDocuments, error: documentsError } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data as Document[];
    }
  });

  // Subir un archivo al bucket de almacenamiento
  const uploadFile = async (file: File, path: string = '') => {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
    
    if (error) throw error;
    
    // Obtener URL pública del archivo
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    return {
      fileName,
      filePath,
      fileUrl: urlData.publicUrl,
      fileType: file.type,
      fileSize: file.size
    };
  };

  // Crear un documento (incluye subir el archivo)
  const createDocumentMutation = useMutation({
    mutationFn: async (documentData: Omit<Document, 'id' | 'uploadedAt' | 'uploadedBy' | 'fileUrl' | 'fileType' | 'fileSize'> & { file: File }) => {
      if (!session?.user?.id) {
        throw new Error('Usuario no autenticado');
      }
      
      const { file, ...rest } = documentData;
      
      // Subir el archivo
      const fileData = await uploadFile(file);
      
      // Crear el documento
      const { error } = await supabase
        .from('documents')
        .insert({
          ...rest,
          file_url: fileData.fileUrl,
          file_type: fileData.fileType,
          file_size: fileData.fileSize,
          uploaded_by: session.user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: 'Documento subido',
        description: 'El documento ha sido subido correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al subir documento',
        description: error.message || 'Ocurrió un error al subir el documento',
        variant: 'destructive'
      });
    }
  });

  // Eliminar un documento
  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      // Primero obtenemos la URL del archivo para eliminarlo del storage
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('file_url')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Extraer el nombre del archivo de la URL pública
      const fileUrl = data.file_url;
      const filePath = fileUrl.split('/').pop();
      
      // Eliminar el archivo
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);
      
      if (storageError) throw storageError;
      
      // Eliminar el registro del documento
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: 'Documento eliminado',
        description: 'El documento ha sido eliminado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al eliminar documento',
        description: error.message || 'Ocurrió un error al eliminar el documento',
        variant: 'destructive'
      });
    }
  });

  return {
    documents,
    isLoadingDocuments,
    documentsError,
    uploadFile,
    createDocument: createDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
    isLoading: isLoadingDocuments || isLoading || 
               createDocumentMutation.isPending || 
               deleteDocumentMutation.isPending
  };
}
