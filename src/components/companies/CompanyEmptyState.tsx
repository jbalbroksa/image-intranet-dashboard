
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyEmptyStateProps {
  searchTerm?: string;
  selectedClassification?: string | null;
}

export function CompanyEmptyState({ searchTerm, selectedClassification }: CompanyEmptyStateProps) {
  return (
    <div className="col-span-full py-12 text-center border border-dashed rounded-lg">
      <Building2 className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
      <h3 className="font-medium mb-1">No se encontraron compañías</h3>
      <p className="text-sm text-muted-foreground mb-3">
        {searchTerm || selectedClassification
          ? 'No hay resultados para tu búsqueda. Intenta con otros términos o filtros.'
          : 'Añade una compañía para empezar.'}
      </p>
      <Button asChild size="sm">
        <Link to="/companies/create">Añadir Compañía</Link>
      </Button>
    </div>
  );
}
