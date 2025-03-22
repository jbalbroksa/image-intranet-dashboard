
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

// User types
const USER_TYPES = [
  'Administrador',
  'Responsable de Departamento',
  'Delegación',
  'Empleado SSCC',
  'Colaborador'
];

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: string | null;
  onFilterRole: (role: string | null) => void;
  filterType: string | null;
  onFilterType: (type: string | null) => void;
  filterBranch: string | null;
  onFilterBranch: (branch: string | null) => void;
}

export function UsersFilters({
  searchTerm,
  onSearchChange,
  filterRole,
  onFilterRole,
  filterType,
  onFilterType,
  filterBranch,
  onFilterBranch
}: UsersFiltersProps) {
  const { toast } = useToast();
  
  const handleFilterRole = (role: string | null) => {
    onFilterRole(role);
    if (role) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando usuarios con rol: ${role}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todos los roles',
      });
    }
  };

  const handleFilterType = (type: string | null) => {
    onFilterType(type);
    if (type) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando usuarios de tipo: ${type}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todos los tipos',
      });
    }
  };

  const handleFilterBranch = (branch: string | null) => {
    onFilterBranch(branch);
    if (branch) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando usuarios de sucursal: ${branch}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todas las sucursales',
      });
    }
  };
  
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuarios..."
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
              {filterRole || 'Todos los roles'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFilterRole(null)}>
              Todos los roles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterRole('admin')}>
              Administrador
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterRole('manager')}>
              Manager
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterRole('user')}>
              Usuario
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              {filterType || 'Todos los tipos'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFilterType(null)}>
              Todos los tipos
            </DropdownMenuItem>
            {USER_TYPES.map(type => (
              <DropdownMenuItem 
                key={type} 
                onClick={() => handleFilterType(type)}
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              {filterBranch || 'Todas las sucursales'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFilterBranch(null)}>
              Todas las sucursales
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterBranch('Servicios Centrales')}>
              Servicios Centrales
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
            <DropdownMenuItem>Fecha: Más reciente</DropdownMenuItem>
            <DropdownMenuItem>Fecha: Más antigua</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
