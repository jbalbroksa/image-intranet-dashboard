
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ProductSearch({ searchTerm, onSearchChange }: ProductSearchProps) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar productos..."
        className="pl-8 w-full"
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
      />
    </div>
  );
}
