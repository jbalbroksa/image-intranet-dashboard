
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Product, ProductCategory } from '@/types';

interface ProductHeaderProps {
  onCreateCategory?: () => void;
  product?: Product;
  companyName?: string;
  categoryName?: string;
  subcategoryName?: string | null;
}

export function ProductHeader({ 
  onCreateCategory, 
  product, 
  companyName, 
  categoryName, 
  subcategoryName 
}: ProductHeaderProps) {
  // If we're in product details view
  if (product) {
    return (
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">{product.name}</h1>
        <div className="flex flex-wrap gap-2 text-muted-foreground">
          {companyName && <span>Compañía: {companyName}</span>}
          {categoryName && <span>• Categoría: {categoryName}</span>}
          {subcategoryName && <span>• Subcategoría: {subcategoryName}</span>}
        </div>
      </div>
    );
  }

  // If we're in the products list view
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
        {onCreateCategory && (
          <Button variant="outline" onClick={onCreateCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Categoría
          </Button>
        )}
      </div>
    </div>
  );
}
