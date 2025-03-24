
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Plus, Package, ArrowUpDown, Filter, 
  Book, ChevronRight, FolderTree, Edit, Trash2, 
  ChevronDown, ChevronUp
} from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/hooks/use-products';
import { useUsers } from '@/hooks/use-users';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductCategory } from '@/types';

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

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('products');
  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [isProductDialogOpen, setProductDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { users } = useUsers();
  
  const { 
    products, 
    categories, 
    flatCategories,
    isLoadingProducts, 
    isLoadingCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProducts();

  // Category form
  const categoryForm = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      parentId: '',
      description: '',
    }
  });

  // Product form
  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      companyId: '',
      description: '',
      strengths: '',
      weaknesses: '',
      processes: '',
      status: 'draft',
      tags: [],
    }
  });

  // Reset category form when opening the dialog
  useEffect(() => {
    if (isCategoryDialogOpen) {
      if (editingCategory) {
        categoryForm.reset({
          name: editingCategory.name,
          parentId: editingCategory.parentId || '',
          description: editingCategory.description || '',
        });
      } else {
        categoryForm.reset({
          name: '',
          parentId: '',
          description: '',
        });
      }
    }
  }, [isCategoryDialogOpen, editingCategory, categoryForm]);

  // Handler for category form submission
  const handleCategorySubmit = (values: z.infer<typeof categorySchema>) => {
    console.log('Submitting category:', values);
    
    if (editingCategory) {
      updateCategory({
        id: editingCategory.id,
        ...values
      });
    } else {
      createCategory(values);
    }
    
    setCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  // Handler for product form submission
  const handleProductSubmit = (values: z.infer<typeof productSchema>) => {
    console.log('Submitting product:', values);
    
    createProduct(values);
    setProductDialogOpen(false);
  };

  // Toggle expanded state of category
  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle filter changes
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

  // Handle edit category
  const handleEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  // Handle delete category
  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
  };

  // Render a single category and its subcategories recursively
  const renderCategory = (category: ProductCategory, depth = 0) => {
    const isExpanded = expandedCategories[category.id] || false;
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    
    return (
      <div key={category.id} className="mb-1">
        <div 
          className={`
            flex items-center justify-between p-2 rounded-md
            ${depth === 0 ? 'bg-muted/50' : 'bg-background'}
            ${depth > 0 ? 'ml-' + (depth * 4) : ''}
            hover:bg-muted/70 transition-colors
          `}
        >
          <div className="flex items-center gap-2">
            {hasSubcategories ? (
              <button
                onClick={() => toggleCategoryExpanded(category.id)}
                className="p-1 rounded hover:bg-muted"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <span className="font-medium text-sm">
              {category.name}
              {hasSubcategories && (
                <Badge variant="outline" className="ml-2">
                  {category.subcategories?.length}
                </Badge>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleEditCategory(category)}
            >
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDeleteCategory(category.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        
        {hasSubcategories && isExpanded && (
          <div className="mt-1">
            {category.subcategories?.map(subcategory => 
              renderCategory(subcategory, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Find author name by ID
  const findAuthorName = (authorId: string) => {
    const author = users?.find(u => u.id === authorId);
    return author?.name || 'Usuario desconocido';
  };

  // Filter products based on search and category filter
  const filteredProducts = products?.filter(product => {
    // Check search term
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check category filter
    const matchesCategory = !filterCategory || 
      product.categoryId === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Base de Conocimientos</h1>
          <p className="text-muted-foreground">Explora y gestiona los productos disponibles</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button onClick={() => setProductDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
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
                {filterCategory ? 'Filtro aplicado' : 'Filtrar por categoría'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilter(null)}>
                Todas las Categorías
              </DropdownMenuItem>
              {flatCategories?.map(category => (
                <DropdownMenuItem 
                  key={category.id} 
                  onClick={() => handleFilter(category.id)}
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-0">
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Skeleton className="h-4 w-1/3" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredProducts?.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No hay productos</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No se encontraron productos. Intenta cambiar los filtros o crear un nuevo producto.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setProductDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts?.map(product => (
                <Card key={product.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      <div className="flex items-center gap-2">
                        <Badge variant={product.status === 'published' ? 'outline' : 'secondary'}>
                          {product.status === 'published' ? 'Publicado' : 'Borrador'}
                        </Badge>
                        <span>{product.name}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      {flatCategories?.find(c => c.id === product.categoryId)?.name && (
                        <Badge variant="secondary">
                          {flatCategories?.find(c => c.id === product.categoryId)?.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product.description 
                        ? product.description.length > 100 
                          ? product.description.substring(0, 100) + '...' 
                          : product.description
                        : '-'}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={users?.find(u => u.id === product.author)?.avatar} />
                        <AvatarFallback>
                          {findAuthorName(product.author).substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {findAuthorName(product.author)}
                      </span>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/products/${product.id}`}>
                        Ver <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <div className="flex items-center justify-center p-8 h-full bg-muted/30 border border-dashed rounded-lg">
                <Button onClick={() => setProductDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Producto
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Gestión de Categorías</h3>
            <Button onClick={() => {
              setEditingCategory(null);
              setCategoryDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Categoría
            </Button>
          </div>
          
          {isLoadingCategories ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : categories?.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <FolderTree className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No hay categorías</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No se han creado categorías aún. Crea la primera categoría para organizar tus productos.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Categoría
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-muted/30">
                {categories?.map(category => renderCategory(category))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Modifica los datos de la categoría existente' 
                : 'Crea una nueva categoría para organizar tus productos'
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleCategorySubmit)} className="space-y-4">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la categoría" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría Padre (opcional)</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="">Ninguna (categoría raíz)</option>
                        {flatCategories?.filter(cat => 
                          !editingCategory || cat.id !== editingCategory.id
                        ).map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Selecciona una categoría padre para crear una jerarquía
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe esta categoría" 
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCategoryDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Actualizar' : 'Crear Categoría'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
            <DialogDescription>
              Crea un nuevo producto con todos los detalles necesarios
            </DialogDescription>
          </DialogHeader>
          
          <Form {...productForm}>
            <form onSubmit={productForm.handleSubmit(handleProductSubmit)} className="space-y-4">
              <FormField
                control={productForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={productForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        >
                          <option value="">Selecciona una categoría</option>
                          {flatCategories?.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={productForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        >
                          <option value="draft">Borrador</option>
                          <option value="published">Publicado</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={productForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descripción general del producto" 
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Proporciona una descripción general del producto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={productForm.control}
                name="strengths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fortalezas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Principales fortalezas del producto" 
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={productForm.control}
                name="weaknesses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Debilidades</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Principales debilidades o limitaciones" 
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={productForm.control}
                name="processes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Procesos</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Procesos relacionados con el producto" 
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setProductDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Crear Producto
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
