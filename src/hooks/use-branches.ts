
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Branch } from '@/types';
import { useToast } from './use-toast';

export function useBranches() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Get all branches
  const { data: branches, isLoading: isLoadingBranches, error: branchesError } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*');
      
      if (error) throw error;
      
      // Map database fields to Branch interface
      return data.map(branch => ({
        id: branch.id,
        name: branch.name,
        address: branch.address,
        postalCode: branch.postal_code,
        city: branch.city,
        province: branch.province,
        contactPerson: branch.contact_person,
        email: branch.email,
        phone: branch.phone || null,
        website: branch.website || null,
        createdAt: branch.created_at
      })) as Branch[];
    }
  });

  // Get a branch by ID
  const getBranch = async (id: string) => {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Map database fields to Branch interface
    return {
      id: data.id,
      name: data.name,
      address: data.address,
      postalCode: data.postal_code,
      city: data.city,
      province: data.province,
      contactPerson: data.contact_person,
      email: data.email,
      phone: data.phone || null,
      website: data.website || null,
      createdAt: data.created_at
    } as Branch;
  };

  // Create a branch
  const createBranchMutation = useMutation({
    mutationFn: async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
      // Map Branch interface to database fields
      const dbData = {
        name: branchData.name,
        address: branchData.address,
        postal_code: branchData.postalCode,
        city: branchData.city,
        province: branchData.province,
        contact_person: branchData.contactPerson,
        email: branchData.email,
        phone: branchData.phone,
        website: branchData.website
      };
      
      const { error } = await supabase
        .from('branches')
        .insert(dbData);
      
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

  // Update a branch
  const updateBranchMutation = useMutation({
    mutationFn: async (branchData: Partial<Branch> & { id: string }) => {
      const { id, ...rest } = branchData;
      
      // Map Branch interface to database fields
      const dbData: Record<string, any> = {};
      
      if (rest.name) dbData.name = rest.name;
      if (rest.address) dbData.address = rest.address;
      if (rest.postalCode) dbData.postal_code = rest.postalCode;
      if (rest.city) dbData.city = rest.city;
      if (rest.province) dbData.province = rest.province;
      if (rest.contactPerson) dbData.contact_person = rest.contactPerson;
      if (rest.email) dbData.email = rest.email;
      if (rest.phone !== undefined) dbData.phone = rest.phone;
      if (rest.website !== undefined) dbData.website = rest.website;
      
      const { error } = await supabase
        .from('branches')
        .update(dbData)
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

  // Delete a branch
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
