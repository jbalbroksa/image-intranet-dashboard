
import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ProductFiltersProps {
  productCategories?: ProductCategory[];
  selectedCategory: string | null;
  selectedStatus: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onStatusChange: (status: string | null) => void;
}

export function ProductFilters({
  productCategories,
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange
}: ProductFiltersProps) {
  const { toast } = useToast();

  const handleCategoryFilter = (categoryId: string | null) => {
    onCategoryChange(categoryId);
    toast({
      title: categoryId ? 'Filtro aplicado' : 'Filtro eliminado',
      description: categoryId 
        ? `Mostrando productos de la categoría seleccionada` 
        : 'Mostrando todos los productos',
    });
  };

  const handleStatusFilter = (status: string | null) => {
    onStatusChange(status);
    toast({
      title: status ? 'Filtro aplicado' : 'Filtro eliminado',
      description: status 
        ? `Mostrando productos con estado: ${status}` 
        : 'Mostrando todos los productos',
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            {selectedCategory ? 'Categoría seleccionada' : 'Todas las categorías'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleCategoryFilter(null)}>
            Todas las categorías
          </DropdownMenuItem>
          {productCategories?.map(category => (
            <DropdownMenuItem 
              key={category.id} 
              onClick={() => handleCategoryFilter(category.id)}
            >
              {category.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            {selectedStatus ? (selectedStatus === 'draft' ? 'Borrador' : 'Publicado') : 'Todos los estados'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
            Todos los estados
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusFilter('draft')}>
            Borrador
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusFilter('published')}>
            Publicado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
