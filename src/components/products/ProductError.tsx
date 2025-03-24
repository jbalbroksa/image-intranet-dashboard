
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProductErrorProps {
  id?: string;
}

export function ProductError({ id }: ProductErrorProps) {
  return (
    <div className="py-12 text-center">
      <h3 className="text-lg font-medium mb-2">Producto no encontrado</h3>
      <p className="text-muted-foreground mb-4">No se pudo encontrar el producto{id ? ` con ID: ${id}` : ''}</p>
      <Button asChild>
        <Link to="/products">Volver a Productos</Link>
      </Button>
    </div>
  );
}
