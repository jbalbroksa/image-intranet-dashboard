
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/products/use-products';
import { useCompanies } from '@/hooks/use-companies';
import { ProductTabs } from '@/components/products/ProductTabs';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductAuthor } from '@/components/products/ProductAuthor';
import { ProductBreadcrumb } from '@/components/products/ProductBreadcrumb';
import { ProductActions } from '@/components/products/ProductActions';
import { ProductLoading } from '@/components/products/ProductLoading';
import { ProductError } from '@/components/products/ProductError';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { 
    getProduct,
    productCategories,
    updateProduct,
    deleteProduct
  } = useProducts();
  
  const { companies } = useCompanies();
  
  const { 
    data: product, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      return await getProduct(id);
    },
    enabled: !!id
  });
  
  const handleDelete = () => {
    if (!id) return;
    
    deleteProduct(id);
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado correctamente"
    });
    navigate('/products');
  };
  
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    toast({
      title: "Cambios guardados",
      description: "La información del producto ha sido actualizada"
    });
  };

  if (isLoading) {
    return <ProductLoading />;
  }

  if (error || !product) {
    return <ProductError id={id} />;
  }

  const companyName = companies?.find(c => c.id === product.companyId)?.name || 'Compañía no encontrada';
  
  const categoryName = productCategories?.find(c => c.id === product.categoryId)?.name || 'Categoría no encontrada';
  
  const subcategoryName = product.subcategoryId 
    ? productCategories?.find(c => c.id === product.subcategoryId)?.name 
    : null;

  return (
    <div className="animate-fade-in">
      <ProductBreadcrumb productName={product.name} />

      <ProductHeader 
        product={product}
        companyName={companyName}
        categoryName={categoryName}
        subcategoryName={subcategoryName}
      />

      <ProductActions 
        product={product}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        onEditSuccess={handleEditSuccess}
        onDelete={handleDelete}
      />

      <ProductTabs product={product} />

      <div className="mt-8">
        <ProductAuthor authorId={product.author} />
      </div>
    </div>
  );
}
