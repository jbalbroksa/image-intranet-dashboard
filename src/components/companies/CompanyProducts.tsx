
import { ListTodo, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CompanyProducts() {
  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      <ListTodo className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
      <h3 className="text-lg font-medium mb-2">Productos de la compañía</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-4">
        Aquí podrás ver y gestionar los productos relacionados con esta compañía.
      </p>
      <div className="flex justify-center gap-3">
        <Button asChild>
          <Link to="/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Añadir Producto
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/products">Ver Productos</Link>
        </Button>
      </div>
    </div>
  );
}
