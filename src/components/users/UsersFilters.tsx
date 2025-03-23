
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Branch } from '@/types';

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: string | null;
  onFilterRole: (value: string | null) => void;
  filterType: string | null;
  onFilterType: (value: string | null) => void;
  filterBranch: string | null;
  onFilterBranch: (value: string | null) => void;
  roles?: string[];
  types?: string[];
  branches?: Branch[];
}

export function UsersFilters({ 
  searchTerm, 
  onSearchChange, 
  filterRole, 
  onFilterRole, 
  filterType, 
  onFilterType, 
  filterBranch, 
  onFilterBranch,
  roles = [],
  types = [],
  branches = []
}: UsersFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div className="w-full md:w-1/2">
          <Label htmlFor="role">Filtrar por rol</Label>
          <Select
            value={filterRole || "all"}
            onValueChange={(value) => onFilterRole(value === "all" ? null : value)}
          >
            <SelectTrigger id="role" className="mt-1">
              <SelectValue placeholder="Todos los roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role}>
                  {role === 'admin' ? 'Administrador' : 
                   role === 'manager' ? 'Manager' : 
                   role === 'delegate' ? 'Delegado' : 
                   role === 'employee' ? 'Empleado' : 
                   role === 'collaborator' ? 'Colaborador' : role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Label htmlFor="type">Filtrar por tipo</Label>
          <Select
            value={filterType || "all"}
            onValueChange={(value) => onFilterType(value === "all" ? null : value)}
          >
            <SelectTrigger id="type" className="mt-1">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2">
          <Label htmlFor="branch">Filtrar por sucursal</Label>
          <Select
            value={filterBranch || "all"}
            onValueChange={(value) => onFilterBranch(value === "all" ? null : value)}
          >
            <SelectTrigger id="branch" className="mt-1">
              <SelectValue placeholder="Todas las sucursales" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las sucursales</SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
