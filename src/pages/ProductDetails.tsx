
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductAuthor } from '@/components/products/ProductAuthor';
import { ProductTabs } from '@/components/products/ProductTabs';

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
      <ProductHeader 
        product={product} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      
      <ProductAuthor 
        author={product.author} 
        createdAt={product.createdAt} 
        updatedAt={product.updatedAt} 
      />

      <ProductTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        description={product.description} 
        onEdit={handleEdit} 
      />
    </div>
  );
}
