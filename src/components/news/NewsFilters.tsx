
import { useState } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface NewsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCategory: string | null;
  onFilterCategory: (category: string | null) => void;
  filterCompany: string | null;
  onFilterCompany: (company: string | null) => void;
}

export function NewsFilters({
  searchTerm,
  onSearchChange,
  filterCategory,
  onFilterCategory,
  filterCompany,
  onFilterCompany
}: NewsFiltersProps) {
  const { toast } = useToast();
  
  const handleFilterCategory = (category: string | null) => {
    onFilterCategory(category);
    if (category) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando noticias de categoría: ${category}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todas las categorías',
      });
    }
  };

  const handleFilterCompany = (company: string | null) => {
    onFilterCompany(company);
    if (company) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando noticias de compañía: ${company}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todas las compañías',
      });
    }
  };
  
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar noticias..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              {filterCategory || 'Todas las categorías'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFilterCategory(null)}>
              Todas las categorías
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterCategory('General')}>
              General
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterCategory('Productos')}>
              Productos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterCategory('Eventos')}>
              Eventos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              {filterCompany || 'Todas las compañías'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFilterCompany(null)}>
              Todas las compañías
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterCompany('Albroksa Correduría de Seguros')}>
              Albroksa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterCompany('Allianz')}>
              Allianz
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Ordenar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Título: A-Z</DropdownMenuItem>
            <DropdownMenuItem>Título: Z-A</DropdownMenuItem>
            <DropdownMenuItem>Fecha: Más reciente</DropdownMenuItem>
            <DropdownMenuItem>Fecha: Más antigua</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
