
import { useState } from 'react';
import { z } from "zod";
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductEmptyState } from '@/components/products/ProductEmptyState';
import { ProductList } from '@/components/products/ProductList';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/use-products';
import { ProductCategory, Product } from '@/types';

// Form schema for category
const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  parentId: z.string().optional(),
  description: z.string().optional(),
});

// Form schema for product
const productSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  categoryId: z.string().min(1, 'La categoría es obligatoria'),
  subcategoryId: z.string().optional(),
  companyId: z.string().min(1, 'La compañía es obligatoria'),
  description: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  processes: z.string().optional(),
  status: z.enum(['draft', 'published']),
  tags: z.array(z.string()).optional(),
});

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    products, 
    productCategories,
    isLoadingProducts,
    createCategory,
    createProduct
  } = useProducts();

  // Handle search and filtering
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    const matchesStatus = selectedStatus ? product.status === selectedStatus : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    toast({
      title: categoryId ? 'Filtro aplicado' : 'Filtro eliminado',
      description: categoryId 
        ? `Mostrando productos de la categoría seleccionada` 
        : 'Mostrando todos los productos',
    });
  };

  const handleStatusFilter = (status: string | null) => {
    setSelectedStatus(status);
    toast({
      title: status ? 'Filtro aplicado' : 'Filtro eliminado',
      description: status 
        ? `Mostrando productos con estado: ${status}` 
        : 'Mostrando todos los productos',
    });
  };

  // Mock function for creating a new category (you should implement the actual function)
  const handleCreateCategory = () => {
    const categoryData: Omit<ProductCategory, "id" | "subcategories"> = {
      name: "Nueva categoría",
      description: "Descripción de la categoría",
    };
    createCategory(categoryData);
  };

  // Mock function for creating a new product (you should implement the actual function)
  const handleCreateProduct = () => {
    const productData: Omit<Product, "id" | "author" | "createdAt" | "updatedAt"> = {
      name: "Nuevo producto",
      categoryId: productCategories?.[0]?.id || "",
      companyId: "",
      description: "Descripción del producto",
      status: "draft",
    };
    createProduct(productData);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Productos</h1>
          <p className="text-muted-foreground">Gestión de productos y categorías</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button asChild>
            <Link to="/products/create">
              <Plus className="mr-2 h-4 w-4" />
              Crear Producto
            </Link>
          </Button>
          <Button variant="outline" onClick={handleCreateCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Categoría
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

      {isLoadingProducts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="h-[200px]">
              <CardHeader className="animate-pulse bg-gray-200 h-10 rounded mb-2" />
              <CardContent className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-4 rounded w-2/3" />
                <div className="animate-pulse bg-gray-200 h-4 rounded w-1/2" />
                <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} />
      ) : (
        <ProductEmptyState searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default Products;
