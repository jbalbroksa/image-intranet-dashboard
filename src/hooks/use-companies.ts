
import { useState } from 'react';
import { useCompaniesQuery, getCompanyById } from './companies/use-companies-query';
import { useCreateCompany } from './companies/use-create-company';
import { useUpdateCompany } from './companies/use-update-company';
import { useDeleteCompany } from './companies/use-delete-company';
import { useDeleteSpecification } from './companies/use-delete-specification';

export function useCompanies() {
  const [isLoading, setIsLoading] = useState(false);

  // Queries
  const { 
    data: companies, 
    isLoading: isLoadingCompanies, 
    error: companiesError 
  } = useCompaniesQuery();
  
  // Mutations
  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();
  const deleteCompanyMutation = useDeleteCompany();
  const deleteSpecificationMutation = useDeleteSpecification();

  // Get a company by ID
  const getCompany = async (id: string) => {
    try {
      setIsLoading(true);
      return await getCompanyById(id);
    } finally {
      setIsLoading(false);
    }
  };

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
