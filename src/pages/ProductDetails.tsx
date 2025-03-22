
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductAuthor } from '@/components/products/ProductAuthor';
import { ProductTabs } from '@/components/products/ProductTabs';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import { Product, User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductEmptyState } from '@/components/products/ProductEmptyState';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [authorData, setAuthorData] = useState<User | null>(null);
  const { updateProduct, deleteProduct } = useProducts();
  
  // Obtener producto por ID
  const { data, isLoading: isLoadingProduct, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id
  });
  
  // Cuando tengamos el producto, cargar los datos del autor
  useEffect(() => {
    if (data) {
      setProduct(data);
      
      // Cargar datos del autor
      const fetchAuthor = async () => {
        const { data: authorData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.author)
          .single();
        
        if (!error && authorData) {
          setAuthorData(authorData as User);
        }
        
        setIsLoading(false);
      };
      
      fetchAuthor();
    }
  }, [data]);
  
  const handleEdit = () => {
    toast({
      title: "Modo edición",
      description: "Ahora puedes editar la información del producto"
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
    
    // Redirigir a la página de productos
    navigate('/products');
  };

  if (error) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium mb-2">Error al cargar el producto</h3>
        <p className="text-muted-foreground mb-4">{error.message || 'No se pudo encontrar el producto'}</p>
        <Button asChild>
          <Link to="/products">Volver a Productos</Link>
        </Button>
      </div>
    );
  }

  if (isLoadingProduct || isLoading) {
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

  return (
    <div className="animate-fade-in">
      <ProductHeader 
        product={product} 
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

      {product.description ? (
        <ProductTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          description={product.description} 
          onEdit={handleEdit} 
        />
      ) : (
        <ProductEmptyState 
          title="No hay descripción" 
          description="Este producto aún no cuenta con una descripción. Puedes añadir una descripción para proporcionar más información."
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
