
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Package, ArrowUpDown, Filter, Book, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// Mock products for the catalog
const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Seguros para empresas', count: 1 },
  { id: 'cat-2', name: 'Seguros Agrarios', count: 1 },
  { id: 'cat-3', name: 'Seguros Personales', count: 1 },
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFilter = (category: string | null) => {
    setFilterCategory(category);
    if (category) {
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando productos de categoría: ${category}`,
      });
    } else {
      toast({
        title: 'Filtro eliminado',
        description: 'Mostrando todos los productos',
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Base de Conocimientos</h1>
          <p className="text-muted-foreground">Explora y gestiona los productos disponibles</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/products/create">
              <Plus className="mr-2 h-4 w-4" />
              Crear Producto
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {filterCategory || 'Todas las Categorías'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilter(null)}>
                Todas las Categorías
              </DropdownMenuItem>
              {MOCK_CATEGORIES.map(category => (
                <DropdownMenuItem 
                  key={category.id} 
                  onClick={() => handleFilter(category.name)}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
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

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Publicado</Badge>
                    <span>Producto 2</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Badge variant="secondary">Seguros para empresas</Badge>
                  <Badge variant="outline">Responsabilidad Civil</Badge>
                </div>
                <p className="text-sm text-muted-foreground">-</p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>JG</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{user?.name}</span>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/products/2">
                    Ver <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="flex items-center justify-center p-8 h-full bg-muted/30 border border-dashed rounded-lg">
              <Button asChild>
                <Link to="/products/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Producto
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_CATEGORIES.map(category => (
              <Card key={category.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-20 w-full mb-4">
                    <Book className="h-12 w-12 text-primary/50" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.count} producto</p>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/products/categories/${category.id}`}>
                        Expandir
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
