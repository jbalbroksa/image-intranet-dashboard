
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
  const [authorData, setAuthorData] = useState<any>(null);
  const { updateProduct, deleteProduct } = useProducts();
  
  // Get product by ID
  const { data: product, isLoading: isLoadingProduct, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Map database fields to Product interface
      return {
        id: data.id,
        name: data.name,
        categoryId: data.category_id,
        subcategoryId: data.subcategory_id,
        companyId: data.company_id,
        description: data.description,
        status: data.status,
        tags: data.tags as string[] | undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        author: data.author
      };
    },
    enabled: !!id
  });
  
  // When we have the product, load the author data
  useEffect(() => {
    if (product) {
      // Load author data
      const fetchAuthor = async () => {
        const { data: authorData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', product.author)
          .single();
        
        if (!error && authorData) {
          setAuthorData(authorData);
        }
        
        setIsLoading(false);
      };
      
      fetchAuthor();
    }
  }, [product]);
  
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
    
    // Redirect to the products page
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

  // Get the category name from the categoryId for the ProductHeader
  const productHeaderData = {
    id: product.id,
    name: product.name,
    category: product.categoryId, // This should be the category name, but we're using the ID for now
    subcategory: product.subcategoryId, // This should be the subcategory name, but we're using the ID for now
    status: product.status
  };

  return (
    <div className="animate-fade-in">
      <ProductHeader 
        product={productHeaderData} 
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
