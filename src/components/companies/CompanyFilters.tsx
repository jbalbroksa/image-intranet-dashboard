
import { Search, ArrowUpDown, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CompanyFiltersProps {
  searchTerm: string;
  selectedClassification: string | null;
  onSearchChange: (value: string) => void;
  onFilterChange: (classification: string | null) => void;
}

export function CompanyFilters({ 
  searchTerm, 
  selectedClassification, 
  onSearchChange, 
  onFilterChange 
}: CompanyFiltersProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar compañías..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              {selectedClassification || 'Todas las clasificaciones'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onFilterChange(null)}>
              Todas las clasificaciones
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('Preferente')}>
              Preferente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('Estándar')}>
              Estándar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('Básica')}>
              Básica
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
            <DropdownMenuItem>Nombre: A-Z</DropdownMenuItem>
            <DropdownMenuItem>Nombre: Z-A</DropdownMenuItem>
            <DropdownMenuItem>Actualización: Más reciente</DropdownMenuItem>
            <DropdownMenuItem>Actualización: Más antigua</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
