
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company, CompanySpecification } from '@/types';
import { useToast } from '@/hooks/use-toast';

// UUID validation helper function
const isValidUUID = (id: string): boolean => {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Define a type for new specifications (without ID)
export type NewSpecification = Omit<CompanySpecification, 'id'>;

// Update a company hook
export function useUpdateCompany() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyData: Partial<Company> & { 
      id: string, 
      specifications?: (CompanySpecification | NewSpecification)[] 
    }) => {
      const { id, specifications, ...companyInfo } = companyData;
      
      // Validate UUID format
      if (!isValidUUID(id)) {
        console.error('Invalid company ID format:', id);
        throw new Error('Invalid company ID format');
      }
      
      console.log('Updating company with ID:', id, 'and data:', companyInfo);
      
      // Map Company interface to database fields
      const dbData: Record<string, any> = {};
      
      if (companyInfo.name) dbData.name = companyInfo.name;
      if (companyInfo.logo !== undefined) dbData.logo = companyInfo.logo;
      if (companyInfo.website !== undefined) dbData.website = companyInfo.website;
      if (companyInfo.agentAccessUrl !== undefined) dbData.agent_access_url = companyInfo.agentAccessUrl;
      if (companyInfo.contactEmail !== undefined) dbData.contact_email = companyInfo.contactEmail;
      if (companyInfo.classification !== undefined) dbData.classification = companyInfo.classification;
      
      dbData.last_updated = new Date().toISOString();
      
      console.log('Prepared company data for update:', dbData);
      
      // Update the company information
      if (Object.keys(dbData).length > 0) {
        const { error } = await supabase
          .from('companies')
          .update(dbData)
          .eq('id', id);
        
        if (error) {
          console.error('Error updating company:', error);
          throw error;
        }
        
        console.log('Company updated successfully');
      }
      
      // If there are specifications, handle them
      if (specifications && specifications.length > 0) {
        console.log('Processing company specifications:', specifications);
        
        // Identify which have id (update) and which don't (insert)
        const toUpdate = specifications.filter(spec => 'id' in spec && spec.id) as CompanySpecification[];
        const toInsert = specifications.filter(spec => !('id' in spec) || !spec.id) as NewSpecification[];
        
        // Insert new specifications
        if (toInsert.length > 0) {
          console.log('Inserting new specifications:', toInsert);
          
          const specsToInsert = toInsert.map(spec => ({
            category: spec.category,
            content: spec.content,
            company_id: id
          }));
          
          const { error: insertError } = await supabase
            .from('company_specifications')
            .insert(specsToInsert);
          
          if (insertError) {
            console.error('Error inserting company specifications:', insertError);
            throw insertError;
          }
          
          console.log('New company specifications inserted successfully');
        }
        
        // Update existing specifications
        for (const spec of toUpdate) {
          const { id: specId, ...specData } = spec;
          
          console.log('Updating specification with ID:', specId);
          
          const dbSpecData = {
            category: specData.category,
            content: specData.content,
            company_id: id
          };
          
          const { error: updateError } = await supabase
            .from('company_specifications')
            .update(dbSpecData)
            .eq('id', specId);
          
          if (updateError) {
            console.error('Error updating company specification:', updateError);
            throw updateError;
          }
          
          console.log('Company specification updated successfully');
        }
      }
      
      return id;
    },
    onSuccess: (id) => {
      console.log('Company update success callback with ID:', id);
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', id] });
      toast({
        title: 'Compañía actualizada',
        description: 'La compañía ha sido actualizada correctamente',
      });
    },
    onError: (error: any) => {
      console.error('Company update error:', error);
      toast({
        title: 'Error al actualizar compañía',
        description: error.message || 'Ocurrió un error al actualizar la compañía',
        variant: 'destructive'
      });
    }
  });
}
