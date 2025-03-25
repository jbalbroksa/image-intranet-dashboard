
import { useState, useEffect } from 'react';
import { useCompanies } from '@/hooks/use-companies';
import { CompanyHeader } from '@/components/companies/CompanyHeader';
import { CompanyFilters } from '@/components/companies/CompanyFilters';
import { CompanyGrid } from '@/components/companies/CompanyGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/types';

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const { companies, isLoadingCompanies } = useCompanies();
  const { toast } = useToast();

  useEffect(() => {
    if (companies) {
      const filtered = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClassification = selectedClassification ? company.classification === selectedClassification : true;
        return matchesSearch && matchesClassification;
      });
      setFilteredCompanies(filtered);
    }
  }, [companies, searchTerm, selectedClassification]);

  const handleFilter = (classification: string | null) => {
    setSelectedClassification(classification);
    if (classification) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando compañías con clasificación: ${classification}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todas las compañías',
      });
    }
  };

  if (isLoadingCompanies) {
    return (
      <div className="animate-fade-in">
        <CompanyHeader />
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-10 w-72" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <CompanyHeader />
      
      <CompanyFilters
        searchTerm={searchTerm}
        selectedClassification={selectedClassification}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilter}
      />

      <CompanyGrid 
        companies={filteredCompanies} 
        searchTerm={searchTerm}
        selectedClassification={selectedClassification}
      />
    </div>
  );
}
