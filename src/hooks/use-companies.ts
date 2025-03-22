
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company, CompanySpecification } from '@/types';
import { useToast } from './use-toast';

export function useCompanies() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Obtener todas las compañías
  const { data: companies, isLoading: isLoadingCompanies, error: companiesError } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) throw error;
      return data as Company[];
    }
  });

  // Obtener una compañía por ID
  const getCompany = async (id: string) => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Obtener especificaciones
    const { data: specs, error: specsError } = await supabase
      .from('company_specifications')
      .select('*')
      .eq('company_id', id);
    
    if (specsError) throw specsError;
    
    return {
      ...data,
      specifications: specs
    } as Company;
  };

  // Crear una compañía
  const createCompanyMutation = useMutation({
    mutationFn: async (companyData: Omit<Company, 'id' | 'createdAt' | 'lastUpdated' | 'specifications'> & { specifications?: Omit<CompanySpecification, 'id' | 'companyId'>[] }) => {
      const { specifications, ...companyInfo } = companyData;
      
      // Insertar la compañía
      const { data, error } = await supabase
        .from('companies')
        .insert(companyInfo)
        .select()
        .single();
      
      if (error) throw error;
      
      // Si hay especificaciones, insertarlas
      if (specifications && specifications.length > 0) {
        const specsWithCompanyId = specifications.map(spec => ({
          ...spec,
          company_id: data.id
        }));
        
        const { error: specsError } = await supabase
          .from('company_specifications')
          .insert(specsWithCompanyId);
        
        if (specsError) throw specsError;
      }
      
      return data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Compañía creada',
        description: 'La compañía ha sido creada correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al crear compañía',
        description: error.message || 'Ocurrió un error al crear la compañía',
        variant: 'destructive'
      });
    }
  });

  // Actualizar una compañía
  const updateCompanyMutation = useMutation({
    mutationFn: async (companyData: Partial<Company> & { id: string, specifications?: (CompanySpecification | Omit<CompanySpecification, 'id' | 'companyId'>)[] }) => {
      const { id, specifications, ...companyInfo } = companyData;
      
      // Actualizar la información de la compañía
      if (Object.keys(companyInfo).length > 0) {
        const { error } = await supabase
          .from('companies')
          .update({
            ...companyInfo,
            last_updated: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) throw error;
      }
      
      // Si hay especificaciones, manejarlas
      if (specifications && specifications.length > 0) {
        // Identificar cuáles tienen id (actualizar) y cuáles no (insertar)
        const toUpdate = specifications.filter(spec => 'id' in spec && spec.id);
        const toInsert = specifications.filter(spec => !('id' in spec) || !spec.id).map(spec => ({
          ...spec,
          company_id: id
        }));
        
        // Insertar nuevas especificaciones
        if (toInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('company_specifications')
            .insert(toInsert);
          
          if (insertError) throw insertError;
        }
        
        // Actualizar especificaciones existentes
        for (const spec of toUpdate) {
          const { id: specId, ...specData } = spec as CompanySpecification;
          const { error: updateError } = await supabase
            .from('company_specifications')
            .update(specData)
            .eq('id', specId);
          
          if (updateError) throw updateError;
        }
      }
      
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', id] });
      toast({
        title: 'Compañía actualizada',
        description: 'La compañía ha sido actualizada correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al actualizar compañía',
        description: error.message || 'Ocurrió un error al actualizar la compañía',
        variant: 'destructive'
      });
    }
  });

  // Eliminar una compañía
  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      // Las especificaciones se eliminarán en cascada gracias a la restricción ON DELETE CASCADE
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Compañía eliminada',
        description: 'La compañía ha sido eliminada correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al eliminar compañía',
        description: error.message || 'Ocurrió un error al eliminar la compañía',
        variant: 'destructive'
      });
    }
  });

  // Eliminar una especificación
  const deleteSpecificationMutation = useMutation({
    mutationFn: async (specId: string) => {
      const { error } = await supabase
        .from('company_specifications')
        .delete()
        .eq('id', specId);
      
      if (error) throw error;
      return specId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Especificación eliminada',
        description: 'La especificación ha sido eliminada correctamente',
      });
    }
  });

  return {
    companies,
    isLoadingCompanies,
    companiesError,
    getCompany,
    createCompany: createCompanyMutation.mutate,
    updateCompany: updateCompanyMutation.mutate,
    deleteCompany: deleteCompanyMutation.mutate,
    deleteSpecification: deleteSpecificationMutation.mutate,
    isLoading: isLoadingCompanies || isLoading || 
               createCompanyMutation.isPending || 
               updateCompanyMutation.isPending || 
               deleteCompanyMutation.isPending ||
               deleteSpecificationMutation.isPending
  };
}
