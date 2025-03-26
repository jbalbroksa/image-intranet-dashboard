
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CompanyNotFoundProps {
  id?: string;
}

export function CompanyNotFound({ id }: CompanyNotFoundProps) {
  return (
    <div className="py-12 text-center">
      <h3 className="text-lg font-medium mb-2">Compañía no encontrada</h3>
      <p className="text-muted-foreground mb-4">No se pudo encontrar la compañía{id ? ` con ID: ${id}` : ''}</p>
      <Button asChild>
        <Link to="/companies">Volver a Compañías</Link>
      </Button>
    </div>
  );
}
