
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { News } from '@/types';
import { useToast } from './use-toast';
import { useAuth } from '@/context/AuthContext';

export function useNews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Obtener todas las noticias
  const { data: news, isLoading: isLoadingNews, error: newsError } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as News[];
    }
  });

  // Obtener una noticia por ID
  const getNews = async (id: string) => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as News;
  };

  // Crear una noticia
  const createNewsMutation = useMutation({
    mutationFn: async (newsData: Omit<News, 'id' | 'publishedAt' | 'author'>) => {
      if (!session?.user?.id) {
        throw new Error('Usuario no autenticado');
      }
      
      const { error } = await supabase
        .from('news')
        .insert({
          ...newsData,
          author: session.user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast({
        title: 'Noticia creada',
        description: 'La noticia ha sido creada correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al crear noticia',
        description: error.message || 'Ocurrió un error al crear la noticia',
        variant: 'destructive'
      });
    }
  });

  // Actualizar una noticia
  const updateNewsMutation = useMutation({
    mutationFn: async (newsData: Partial<News> & { id: string }) => {
      const { id, ...rest } = newsData;
      const { error } = await supabase
        .from('news')
        .update(rest)
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news', id] });
      toast({
        title: 'Noticia actualizada',
        description: 'La noticia ha sido actualizada correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al actualizar noticia',
        description: error.message || 'Ocurrió un error al actualizar la noticia',
        variant: 'destructive'
      });
    }
  });

  // Eliminar una noticia
  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast({
        title: 'Noticia eliminada',
        description: 'La noticia ha sido eliminada correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al eliminar noticia',
        description: error.message || 'Ocurrió un error al eliminar la noticia',
        variant: 'destructive'
      });
    }
  });

  return {
    news,
    isLoadingNews,
    newsError,
    getNews,
    createNews: createNewsMutation.mutate,
    updateNews: updateNewsMutation.mutate,
    deleteNews: deleteNewsMutation.mutate,
    isLoading: isLoadingNews || isLoading || 
               createNewsMutation.isPending || 
               updateNewsMutation.isPending || 
               deleteNewsMutation.isPending
  };
}
