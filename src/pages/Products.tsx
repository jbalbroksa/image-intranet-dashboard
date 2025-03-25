
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/products/use-products';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductToolbar } from '@/components/products/ProductToolbar';
import { ProductList } from '@/components/products/ProductList';
import { ProductEmptyState } from '@/components/products/ProductEmptyState';
import { ProductLoadingSkeleton } from '@/components/products/ProductLoadingSkeleton';
import { Product, ProductCategory } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductForm } from '@/components/products/ProductForm';
import { CategoryForm } from '@/components/products/CategoryForm';

function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  
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

  const handleCreateCategory = () => {
    setIsCreateCategoryOpen(true);
  };

  const handleCreateProduct = () => {
    setIsCreateProductOpen(true);
  };

  const handleProductFormSuccess = () => {
    setIsCreateProductOpen(false);
  };

  const handleCategoryFormSuccess = () => {
    setIsCreateCategoryOpen(false);
  };

  // Custom EmptyState for Products page
  const ProductsEmptyState = () => (
    <ProductEmptyState
      title="No hay productos"
      description={searchTerm 
        ? `No se encontraron productos que coincidan con "${searchTerm}". Intenta con otro término o crea un nuevo producto.`
        : "Aún no has creado ningún producto. Empieza creando tu primer producto."}
      onEdit={handleCreateProduct}
    />
  );

  return (
    <div className="animate-fade-in">
      <ProductHeader onCreateCategory={handleCreateCategory} />
      
      <ProductToolbar
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        productCategories={productCategories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setSelectedStatus}
      />

      {isLoadingProducts ? (
        <ProductLoadingSkeleton />
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <ProductList 
          products={filteredProducts} 
          isLoading={isLoadingProducts} 
          onAddProduct={handleCreateProduct} 
        />
      ) : (
        <ProductsEmptyState />
      )}

      {/* Create Product Dialog */}
      <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Crear Producto</DialogTitle>
            <DialogDescription>
              Completa el formulario para crear un nuevo producto.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSuccess={handleProductFormSuccess}
            onCancel={() => setIsCreateProductOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Categoría</DialogTitle>
            <DialogDescription>
              Ingresa la información de la nueva categoría.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            onSuccess={handleCategoryFormSuccess}
            onCancel={() => setIsCreateCategoryOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Products;
