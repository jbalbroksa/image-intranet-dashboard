
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company, CompanySpecification } from '@/types';
import { useToast } from './use-toast';

export function useCompanies() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Get all companies
  const { data: companies, isLoading: isLoadingCompanies, error: companiesError } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) throw error;
      
      // Map database fields to Company interface
      return data.map(company => ({
        id: company.id,
        name: company.name,
        logo: company.logo,
        website: company.website,
        agentAccessUrl: company.agent_access_url,
        contactEmail: company.contact_email,
        classification: company.classification,
        createdAt: company.created_at,
        lastUpdated: company.last_updated,
        specifications: [] // We'll fetch specifications separately
      })) as Company[];
    }
  });

  // Get a company by ID with its specifications
  const getCompany = async (id: string) => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Get specifications
    const { data: specs, error: specsError } = await supabase
      .from('company_specifications')
      .select('*')
      .eq('company_id', id);
    
    if (specsError) throw specsError;
    
    // Map specifications
    const mappedSpecs = specs.map(spec => ({
      id: spec.id,
      category: spec.category,
      content: spec.content,
      companyId: spec.company_id
    })) as CompanySpecification[];
    
    // Map database fields to Company interface
    return {
      id: data.id,
      name: data.name,
      logo: data.logo,
      website: data.website,
      agentAccessUrl: data.agent_access_url,
      contactEmail: data.contact_email,
      classification: data.classification,
      createdAt: data.created_at,
      lastUpdated: data.last_updated,
      specifications: mappedSpecs
    } as Company;
  };

  // Create a company
  const createCompanyMutation = useMutation({
    mutationFn: async (companyData: Omit<Company, 'id' | 'createdAt' | 'lastUpdated' | 'specifications'> & { specifications?: Omit<CompanySpecification, 'id' | 'companyId'>[] }) => {
      const { specifications, ...companyInfo } = companyData;
      
      // Map Company interface to database fields
      const dbData = {
        name: companyInfo.name,
        logo: companyInfo.logo,
        website: companyInfo.website,
        agent_access_url: companyInfo.agentAccessUrl,
        contact_email: companyInfo.contactEmail,
        classification: companyInfo.classification
      };
      
      // Insert the company
      const { data, error } = await supabase
        .from('companies')
        .insert(dbData)
        .select()
        .single();
      
      if (error) throw error;
      
      // If there are specifications, insert them
      if (specifications && specifications.length > 0) {
        const specsWithCompanyId = specifications.map(spec => ({
          category: spec.category,
          content: spec.content,
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

  // Update a company
  const updateCompanyMutation = useMutation({
    mutationFn: async (companyData: Partial<Company> & { id: string, specifications?: (CompanySpecification | Omit<CompanySpecification, 'id' | 'companyId'>)[] }) => {
      const { id, specifications, ...companyInfo } = companyData;
      
      // Map Company interface to database fields
      const dbData: Record<string, any> = {};
      
      if (companyInfo.name) dbData.name = companyInfo.name;
      if (companyInfo.logo !== undefined) dbData.logo = companyInfo.logo;
      if (companyInfo.website !== undefined) dbData.website = companyInfo.website;
      if (companyInfo.agentAccessUrl !== undefined) dbData.agent_access_url = companyInfo.agentAccessUrl;
      if (companyInfo.contactEmail !== undefined) dbData.contact_email = companyInfo.contactEmail;
      if (companyInfo.classification !== undefined) dbData.classification = companyInfo.classification;
      
      dbData.last_updated = new Date().toISOString();
      
      // Update the company information
      if (Object.keys(dbData).length > 0) {
        const { error } = await supabase
          .from('companies')
          .update(dbData)
          .eq('id', id);
        
        if (error) throw error;
      }
      
      // If there are specifications, handle them
      if (specifications && specifications.length > 0) {
        // Identify which have id (update) and which don't (insert)
        const toUpdate = specifications.filter(spec => 'id' in spec && spec.id);
        const toInsert = specifications.filter(spec => !('id' in spec) || !spec.id);
        
        // Insert new specifications
        if (toInsert.length > 0) {
          const specsToInsert = toInsert.map(spec => ({
            category: spec.category,
            content: spec.content,
            company_id: id
          }));
          
          const { error: insertError } = await supabase
            .from('company_specifications')
            .insert(specsToInsert);
          
          if (insertError) throw insertError;
        }
        
        // Update existing specifications
        for (const spec of toUpdate) {
          const { id: specId, ...specData } = spec as CompanySpecification;
          
          const dbSpecData = {
            category: specData.category,
            content: specData.content,
            company_id: id
          };
          
          const { error: updateError } = await supabase
            .from('company_specifications')
            .update(dbSpecData)
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

  // Delete a company
  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      // Specifications will be deleted in cascade thanks to ON DELETE CASCADE constraint
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

  // Delete a specification
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
