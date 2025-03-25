
import { ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProductSorter() {
  return (
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
  );
}
