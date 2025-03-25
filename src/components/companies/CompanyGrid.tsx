
import { Company } from '@/types';
import { CompanyCard } from './CompanyCard';
import { CompanyEmptyState } from './CompanyEmptyState';

interface CompanyGridProps {
  companies: Company[];
  searchTerm?: string;
  selectedClassification?: string | null;
}

export function CompanyGrid({ companies, searchTerm, selectedClassification }: CompanyGridProps) {
  if (companies.length === 0) {
    return <CompanyEmptyState searchTerm={searchTerm} selectedClassification={selectedClassification} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {companies.map(company => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
