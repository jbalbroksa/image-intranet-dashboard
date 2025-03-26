
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function CompanyDocuments() {
  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
      <h3 className="text-lg font-medium mb-2">Gestión de documentos</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-4">
        Aquí podrás ver y gestionar todos los documentos relacionados con esta compañía.
      </p>
      <div className="flex justify-center gap-3">
        <Button asChild>
          <Link to="/documents/upload">
            <Plus className="mr-2 h-4 w-4" />
            Subir Documento
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/documents">Ver Repositorio</Link>
        </Button>
      </div>
    </div>
  );
}
