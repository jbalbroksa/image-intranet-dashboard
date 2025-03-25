
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company, CompanySpecification } from '@/types';

// UUID validation helper function
const isValidUUID = (id: string): boolean => {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Get all companies
export function useCompaniesQuery() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('Fetching all companies');
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }
      
      console.log('Companies fetched:', data);
      
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
}

// Get a company by ID with its specifications
export async function getCompanyById(id: string) {
  // Validate UUID format
  if (!isValidUUID(id)) {
    console.error('Invalid company ID format:', id);
    throw new Error('Invalid company ID format');
  }

  console.log('Fetching company with ID:', id);
  
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
  
  console.log('Company data fetched:', data);
  
  // Get specifications
  const { data: specs, error: specsError } = await supabase
    .from('company_specifications')
    .select('*')
    .eq('company_id', id);
  
  if (specsError) {
    console.error('Error fetching company specifications:', specsError);
    throw specsError;
  }
  
  console.log('Company specifications fetched:', specs);
  
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
}
