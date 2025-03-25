
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ProductCategory } from '@/types';

interface ProductHeaderProps {
  onCreateCategory: () => void;
}

export function ProductHeader({ onCreateCategory }: ProductHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Productos</h1>
        <p className="text-muted-foreground">Gestión de productos y categorías</p>
      </div>
      <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
        <Button asChild>
          <Link to="/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Crear Producto
          </Link>
        </Button>
        <Button variant="outline" onClick={onCreateCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Categoría
        </Button>
      </div>
    </div>
  );
}
