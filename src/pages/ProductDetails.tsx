
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductAuthor } from '@/components/products/ProductAuthor';
import { ProductTabs } from '@/components/products/ProductTabs';
import { ProductEmptyState } from '@/components/products/ProductEmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import { useUsers } from '@/hooks/use-users';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authorData, setAuthorData] = useState<any>(null);
  const { users } = useUsers();
  const { 
    getProduct, 
    updateProduct, 
    deleteProduct, 
    flatCategories,
    isLoadingCategories
  } = useProducts();
  
  // Get product by ID
  const { data: product, isLoading: isLoadingProduct, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      return await getProduct(id);
    },
    enabled: !!id
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

  // Initialize form with product data when it becomes available
  useEffect(() => {
    if (product) {
      productForm.reset({
        name: product.name,
        categoryId: product.categoryId,
        subcategoryId: product.subcategoryId,
        companyId: product.companyId,
        description: product.description || '',
        strengths: product.strengths || '',
        weaknesses: product.weaknesses || '',
        processes: product.processes || '',
        status: product.status,
        tags: product.tags || [],
      });
      
      // Find author data
      const author = users?.find(u => u.id === product.author);
      if (author) {
        setAuthorData({
          name: author.name,
          avatar: author.avatar
        });
      }
      
      setIsLoading(false);
    }
  }, [product, users, productForm]);
  
  const handleEdit = () => {
    setIsEditMode(true);
    toast({
      title: "Modo edición",
      description: "Ahora puedes editar la información del producto"
    });
  };

  const handleSave = (values: z.infer<typeof productSchema>) => {
    if (!id) return;
    
    updateProduct({
      id,
      ...values
    });
    
    setIsEditMode(false);
    
    toast({
      title: "Cambios guardados",
      description: "Los cambios han sido guardados correctamente"
    });
  };

  const handleCancel = () => {
    // Reset form to product data
    if (product) {
      productForm.reset({
        name: product.name,
        categoryId: product.categoryId,
        subcategoryId: product.subcategoryId,
        companyId: product.companyId,
        description: product.description || '',
        strengths: product.strengths || '',
        weaknesses: product.weaknesses || '',
        processes: product.processes || '',
        status: product.status,
        tags: product.tags || [],
      });
    }
    
    setIsEditMode(false);
    
    toast({
      title: "Edición cancelada",
      description: "Los cambios han sido descartados"
    });
  };

  const handleDelete = () => {
    if (!id) return;
    
    deleteProduct(id);
    
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado correctamente",
      variant: "destructive"
    });
    
    // Redirect to the products page
    navigate('/products');
  };

  if (error) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium mb-2">Error al cargar el producto</h3>
        <p className="text-muted-foreground mb-4">{(error as Error).message || 'No se pudo encontrar el producto'}</p>
        <Button asChild>
          <Link to="/products">Volver a Productos</Link>
        </Button>
      </div>
    );
  }

  if (isLoadingProduct || isLoading || isLoadingCategories) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Skeleton className="h-16 w-full mb-4" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium mb-2">Producto no encontrado</h3>
        <p className="text-muted-foreground mb-4">No se pudo encontrar el producto con ID: {id}</p>
        <Button asChild>
          <Link to="/products">Volver a Productos</Link>
        </Button>
      </div>
    );
  }

  // Get category name for display
  const categoryName = flatCategories?.find(c => c.id === product.categoryId)?.name || 'Categoría Desconocida';

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Productos
          </Link>
        </Button>
      </div>
      
      {isEditMode ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Editar Producto</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={productForm.handleSubmit(handleSave)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </div>
          </div>
          
          <Form {...productForm}>
            <form onSubmit={productForm.handleSubmit(handleSave)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compañía</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start mb-4">
                  <TabsTrigger value="description">Descripción</TabsTrigger>
                  <TabsTrigger value="strengths">Fortalezas</TabsTrigger>
                  <TabsTrigger value="weaknesses">Debilidades</TabsTrigger>
                  <TabsTrigger value="processes">Procesos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description">
                  <FormField
                    control={productForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción General</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descripción general del producto" 
                            className="resize-none min-h-[250px]"
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
                </TabsContent>
                
                <TabsContent value="strengths">
                  <FormField
                    control={productForm.control}
                    name="strengths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fortalezas</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Principales fortalezas del producto" 
                            className="resize-none min-h-[250px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detalla las principales fortalezas y ventajas del producto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="weaknesses">
                  <FormField
                    control={productForm.control}
                    name="weaknesses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Debilidades</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Principales debilidades o limitaciones" 
                            className="resize-none min-h-[250px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detalla las principales limitaciones o debilidades del producto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="processes">
                  <FormField
                    control={productForm.control}
                    name="processes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Procesos</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Procesos relacionados con el producto" 
                            className="resize-none min-h-[250px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detalla los procesos relacionados con este producto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>
      ) : (
        <>
          <ProductHeader 
            product={{
              id: product.id,
              name: product.name,
              category: categoryName,
              status: product.status
            }} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
          
          <ProductAuthor 
            author={authorData ? {
              name: authorData.name,
              avatar: authorData.avatar
            } : undefined} 
            createdAt={product.createdAt} 
            updatedAt={product.updatedAt} 
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="strengths">Fortalezas</TabsTrigger>
              <TabsTrigger value="weaknesses">Debilidades</TabsTrigger>
              <TabsTrigger value="processes">Procesos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description">
              {product.description ? (
                <div className="prose max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              ) : (
                <ProductEmptyState 
                  title="No hay descripción" 
                  description="Este producto aún no cuenta con una descripción. Puedes añadir una descripción para proporcionar más información."
                  onEdit={handleEdit}
                />
              )}
            </TabsContent>
            
            <TabsContent value="strengths">
              {product.strengths ? (
                <div className="prose max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: product.strengths }} />
                </div>
              ) : (
                <ProductEmptyState 
                  title="No hay fortalezas" 
                  description="Este producto aún no tiene detalladas sus fortalezas. Añade las principales ventajas y puntos fuertes."
                  onEdit={handleEdit}
                />
              )}
            </TabsContent>
            
            <TabsContent value="weaknesses">
              {product.weaknesses ? (
                <div className="prose max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: product.weaknesses }} />
                </div>
              ) : (
                <ProductEmptyState 
                  title="No hay debilidades" 
                  description="Este producto aún no tiene detalladas sus debilidades. Añade las principales limitaciones o aspectos mejorables."
                  onEdit={handleEdit}
                />
              )}
            </TabsContent>
            
            <TabsContent value="processes">
              {product.processes ? (
                <div className="prose max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: product.processes }} />
                </div>
              ) : (
                <ProductEmptyState 
                  title="No hay procesos" 
                  description="Este producto aún no tiene detallados sus procesos. Añade información sobre los procesos relacionados."
                  onEdit={handleEdit}
                />
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
