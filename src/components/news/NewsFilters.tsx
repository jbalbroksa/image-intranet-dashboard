
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCategory: string | null;
  onFilterCategory: (value: string | null) => void;
  filterCompany: string | null;
  onFilterCompany: (value: string | null) => void;
  categories?: string[];
  companies?: { id: string, name: string }[];
}

export function NewsFilters({ 
  searchTerm, 
  onSearchChange, 
  filterCategory, 
  onFilterCategory, 
  filterCompany, 
  onFilterCompany,
  categories = [],
  companies = []
}: NewsFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            placeholder="Buscar noticia..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <Label htmlFor="category">Filtrar por categoría</Label>
          <Select
            value={filterCategory || ""}
            onValueChange={(value) => onFilterCategory(value || null)}
          >
            <SelectTrigger id="category" className="mt-1">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las categorías</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/3">
          <Label htmlFor="company">Filtrar por compañía</Label>
          <Select
            value={filterCompany || ""}
            onValueChange={(value) => onFilterCompany(value || null)}
          >
            <SelectTrigger id="company" className="mt-1">
              <SelectValue placeholder="Todas las compañías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las compañías</SelectItem>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
