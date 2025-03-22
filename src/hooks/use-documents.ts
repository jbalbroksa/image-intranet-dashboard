
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types';
import { useToast } from './use-toast';
import { useAuth } from '@/context/AuthContext';

export function useDocuments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get all documents
  const { data: documents, isLoading: isLoadingDocuments, error: documentsError } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      
      // Map database fields to Document interface
      return data.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        categoryId: doc.category_id,
        companyId: doc.company_id,
        productCategoryId: doc.product_category_id,
        productSubcategoryId: doc.product_subcategory_id,
        productId: doc.product_id,
        tags: doc.tags as string[] | undefined,
        fileUrl: doc.file_url,
        fileType: doc.file_type,
        fileSize: doc.file_size,
        uploadedBy: doc.uploaded_by,
        uploadedAt: doc.uploaded_at
      })) as Document[];
    }
  });

  // Upload a file to the storage bucket
  const uploadFile = async (file: File, path: string = '') => {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
    
    if (error) throw error;
    
    // Get public URL of the file
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

  // Create a document (includes uploading the file)
  const createDocumentMutation = useMutation({
    mutationFn: async (documentData: Omit<Document, 'id' | 'uploadedAt' | 'uploadedBy' | 'fileUrl' | 'fileType' | 'fileSize'> & { file: File }) => {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }
      
      const { file, ...rest } = documentData;
      
      // Upload the file
      const fileData = await uploadFile(file);
      
      // Map Document interface to database fields
      const dbData = {
        title: rest.title,
        description: rest.description,
        category_id: rest.categoryId,
        company_id: rest.companyId,
        product_category_id: rest.productCategoryId,
        product_subcategory_id: rest.productSubcategoryId,
        product_id: rest.productId,
        tags: rest.tags,
        file_url: fileData.fileUrl,
        file_type: fileData.fileType,
        file_size: fileData.fileSize,
        uploaded_by: user.id
      };
      
      // Create the document
      const { error } = await supabase
        .from('documents')
        .insert(dbData);
      
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

  // Delete a document
  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      // First get the file URL to delete it from storage
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('file_url')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Extract the file name from the public URL
      const fileUrl = data.file_url;
      const filePath = fileUrl.split('/').pop();
      
      // Delete the file
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);
      
      if (storageError) throw storageError;
      
      // Delete the document record
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
