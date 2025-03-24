
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronRight, Package, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  authors?: Record<string, { name: string; avatar?: string }>;
  categories?: Record<string, string>;
  onAddProduct: () => void;
}

export function ProductList({ 
  products, 
  isLoading, 
  authors = {}, 
  categories = {},
  onAddProduct 
}: ProductListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Skeleton className="h-4 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No hay productos</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No se encontraron productos. Intenta cambiar los filtros o crear un nuevo producto.
        </p>
        <Button 
          className="mt-4" 
          onClick={onAddProduct}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map(product => (
        <Card key={product.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              <div className="flex items-center gap-2">
                <Badge variant={product.status === 'published' ? 'outline' : 'secondary'}>
                  {product.status === 'published' ? 'Publicado' : 'Borrador'}
                </Badge>
                <span>{product.name}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              {categories[product.categoryId] && (
                <Badge variant="secondary">
                  {categories[product.categoryId]}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {product.description 
                ? product.description.length > 100 
                  ? product.description.substring(0, 100) + '...' 
                  : product.description
                : '-'}
            </p>
          </CardContent>
          <CardFooter className="border-t pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={authors[product.author]?.avatar} />
                <AvatarFallback>
                  {authors[product.author]?.name.substring(0, 2).toUpperCase() || 'UN'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {authors[product.author]?.name || 'Usuario desconocido'}
              </span>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to={`/products/${product.id}`}>
                Ver <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      <div className="flex items-center justify-center p-8 h-full bg-muted/30 border border-dashed rounded-lg">
        <Button onClick={onAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Producto
        </Button>
      </div>
    </div>
  );
}
