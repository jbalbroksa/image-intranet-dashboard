
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company, CompanySpecification } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Create a company hook
export function useCreateCompany() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      companyData: Omit<Company, 'id' | 'createdAt' | 'lastUpdated' | 'specifications'> & { 
        specifications?: Omit<CompanySpecification, 'id' | 'companyId'>[] 
      },
      onSuccess?: () => void
    ) => {
      console.log('Creating new company with data:', companyData);
      
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
      
      console.log('Prepared company data for insertion:', dbData);
      
      // Insert the company
      const { data, error } = await supabase
        .from('companies')
        .insert(dbData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating company:', error);
        throw error;
      }
      
      console.log('Company created successfully:', data);
      
      // If there are specifications, insert them
      if (specifications && specifications.length > 0) {
        console.log('Inserting company specifications:', specifications);
        
        const specsWithCompanyId = specifications.map(spec => ({
          category: spec.category,
          content: spec.content,
          company_id: data.id
        }));
        
        const { error: specsError } = await supabase
          .from('company_specifications')
          .insert(specsWithCompanyId);
        
        if (specsError) {
          console.error('Error creating company specifications:', specsError);
          throw specsError;
        }
        
        console.log('Company specifications created successfully');
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      return data.id;
    },
    onSuccess: () => {
      console.log('Company creation success callback');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Compañía creada',
        description: 'La compañía ha sido creada correctamente',
      });
    },
    onError: (error: any) => {
      console.error('Company creation error:', error);
      toast({
        title: 'Error al crear compañía',
        description: error.message || 'Ocurrió un error al crear la compañía',
        variant: 'destructive'
      });
    }
  });
}
