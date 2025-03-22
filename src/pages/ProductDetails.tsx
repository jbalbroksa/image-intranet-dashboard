
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, Pencil, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// Mock product for the product details
const MOCK_PRODUCT = {
  id: 'prod-2',
  name: 'Producto 2',
  category: 'Seguros para empresas',
  subcategory: 'Responsabilidad Civil',
  status: 'published',
  description: '',
  createdAt: '2023-03-20',
  updatedAt: '2023-03-20',
  author: {
    name: 'José',
    avatar: '/lovable-uploads/6d6736eb-dda1-4754-b5ef-0c42c4078fab.png'
  }
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('description');
  
  // In a real app, fetch product by ID from API
  const product = MOCK_PRODUCT;
  
  const handleEdit = () => {
    toast({
      title: "Modo edición",
      description: "Ahora puedes editar la información del producto"
    });
  };

  const handleDelete = () => {
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado correctamente",
      variant: "destructive"
    });
  };

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

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/products">Productos</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{product.name}</h1>
              <Badge variant={product.status === 'published' ? 'default' : 'outline'}>
                {product.status === 'published' ? 'Publicado' : 'Borrador'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{product.category}</Badge>
              {product.subcategory && (
                <Badge variant="outline">{product.subcategory}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
          <Button variant="outline" asChild>
            <Link to="/products">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Avatar className="h-8 w-8">
          <AvatarImage src={product.author.avatar} />
          <AvatarFallback>{product.author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">{product.author.name}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>Publicado: {new Date(product.createdAt).toLocaleDateString()}</span>
            {product.updatedAt !== product.createdAt && (
              <>
                <span>•</span>
                <span>Actualizado: {new Date(product.updatedAt).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="description">Descripción</TabsTrigger>
          <TabsTrigger value="processes">Procesos</TabsTrigger>
          <TabsTrigger value="weaknesses">Debilidades</TabsTrigger>
          <TabsTrigger value="comments">Observaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-6">
          {product.description ? (
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed rounded-lg">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-medium mb-2">No hay descripción</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Aún no se ha añadido una descripción para este producto.
              </p>
              <Button onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Añadir Descripción
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="processes" className="space-y-6">
          <div className="py-12 text-center border border-dashed rounded-lg">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium mb-2">No hay procesos definidos</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Aún no se han documentado los procesos para este producto.
            </p>
            <Button onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Documentar Procesos
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="weaknesses" className="space-y-6">
          <div className="py-12 text-center border border-dashed rounded-lg">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium mb-2">No hay debilidades identificadas</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Aún no se han identificado debilidades para este producto.
            </p>
            <Button onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Identificar Debilidades
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <div className="py-12 text-center border border-dashed rounded-lg">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium mb-2">No hay observaciones</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Aún no se han añadido observaciones para este producto.
            </p>
            <Button onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Añadir Observaciones
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
