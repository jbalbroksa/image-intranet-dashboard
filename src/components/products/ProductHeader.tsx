
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Product } from '@/types';

interface ProductHeaderProps {
  product: Product;
  companyName: string;
  categoryName: string;
  subcategoryName: string | null;
}

export function ProductHeader({ product, companyName, categoryName, subcategoryName }: ProductHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-md">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{product.name}</h1>
            <Badge variant={product.status === 'published' ? 'default' : 'outline'}>
              {product.status === 'published' ? 'Publicado' : 'Borrador'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{categoryName}</Badge>
            {subcategoryName && (
              <Badge variant="outline">{subcategoryName}</Badge>
            )}
            <Badge variant="outline">{companyName}</Badge>
          </div>
        </div>
      </div>
    </>
  );
}
