
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Branch } from '@/types';
import { useToast } from './use-toast';

export function useBranches() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Obtener todas las sucursales
  const { data: branches, isLoading: isLoadingBranches, error: branchesError } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*');
      
      if (error) throw error;
      return data as Branch[];
    }
  });

  // Obtener una sucursal por ID
  const getBranch = async (id: string) => {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Branch;
  };

  // Crear una sucursal
  const createBranchMutation = useMutation({
    mutationFn: async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
      const { error } = await supabase
        .from('branches')
        .insert(branchData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast({
        title: 'Sucursal creada',
        description: 'La sucursal ha sido creada correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al crear sucursal',
        description: error.message || 'Ocurrió un error al crear la sucursal',
        variant: 'destructive'
      });
    }
  });

  // Actualizar una sucursal
  const updateBranchMutation = useMutation({
    mutationFn: async (branchData: Partial<Branch> & { id: string }) => {
      const { id, ...rest } = branchData;
      const { error } = await supabase
        .from('branches')
        .update(rest)
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branch', id] });
      toast({
        title: 'Sucursal actualizada',
        description: 'La sucursal ha sido actualizada correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al actualizar sucursal',
        description: error.message || 'Ocurrió un error al actualizar la sucursal',
        variant: 'destructive'
      });
    }
  });

  // Eliminar una sucursal
  const deleteBranchMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast({
        title: 'Sucursal eliminada',
        description: 'La sucursal ha sido eliminada correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al eliminar sucursal',
        description: error.message || 'Ocurrió un error al eliminar la sucursal',
        variant: 'destructive'
      });
    }
  });

  return {
    branches,
    isLoadingBranches,
    branchesError,
    getBranch,
    createBranch: createBranchMutation.mutate,
    updateBranch: updateBranchMutation.mutate,
    deleteBranch: deleteBranchMutation.mutate,
    isLoading: isLoadingBranches || isLoading || 
               createBranchMutation.isPending || 
               updateBranchMutation.isPending || 
               deleteBranchMutation.isPending
  };
}
