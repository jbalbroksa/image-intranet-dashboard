
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CompanyHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Compañías</h1>
        <p className="text-muted-foreground">Gestión de las compañías aseguradoras</p>
      </div>
      <div className="mt-4 md:mt-0">
        <Button asChild>
          <Link to="/companies/create">
            <Plus className="mr-2 h-4 w-4" />
            Crear Compañía
          </Link>
        </Button>
      </div>
    </div>
  );
}
