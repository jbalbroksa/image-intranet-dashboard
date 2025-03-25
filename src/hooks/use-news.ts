
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { News } from '@/types';
import { useToast } from './use-toast';
import { useAuth } from '@/context/AuthContext';

export function useNews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get all news
  const { data: news, isLoading: isLoadingNews, error: newsError } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*, profiles:author(name, avatar)')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      // Map database fields to News interface
      return data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        excerpt: item.excerpt,
        featured: item.featured || false,
        coverImage: item.cover_image,
        category: item.category,
        companyId: item.company_id,
        tags: item.tags as string[] | undefined,
        author: item.profiles || item.author,
        publishedAt: item.published_at
      })) as News[];
    }
  });

  // Get a news item by ID
  const getNews = async (id: string) => {
    const { data, error } = await supabase
      .from('news')
      .select('*, profiles:author(name, avatar)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Map database fields to News interface
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      featured: data.featured || false,
      coverImage: data.cover_image,
      category: data.category,
      companyId: data.company_id,
      tags: data.tags as string[] | undefined,
      author: data.profiles || data.author,
      publishedAt: data.published_at
    } as News;
  };

  // Create a news item
  const createNewsMutation = useMutation({
    mutationFn: async (newsData: Omit<News, 'id' | 'publishedAt' | 'author'>) => {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }
      
      // Map News interface to database fields
      const dbData = {
        title: newsData.title,
        content: newsData.content,
        excerpt: newsData.excerpt,
        featured: newsData.featured,
        cover_image: newsData.coverImage,
        category: newsData.category,
        company_id: newsData.companyId,
        tags: newsData.tags,
        author: user.id
      };
      
      const { error } = await supabase
        .from('news')
        .insert(dbData);
      
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

  // Update a news item
  const updateNewsMutation = useMutation({
    mutationFn: async (newsData: Partial<News> & { id: string }) => {
      const { id, ...rest } = newsData;
      
      // Map News interface to database fields
      const dbData: Record<string, any> = {};
      
      if (rest.title) dbData.title = rest.title;
      if (rest.content) dbData.content = rest.content;
      if (rest.excerpt !== undefined) dbData.excerpt = rest.excerpt;
      if (rest.featured !== undefined) dbData.featured = rest.featured;
      if (rest.coverImage !== undefined) dbData.cover_image = rest.coverImage;
      if (rest.category) dbData.category = rest.category;
      if (rest.companyId !== undefined) dbData.company_id = rest.companyId;
      if (rest.tags !== undefined) dbData.tags = rest.tags;
      
      const { error } = await supabase
        .from('news')
        .update(dbData)
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

  // Delete a news item
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
