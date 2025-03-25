
import { useState } from 'react';
import { useProducts } from '@/hooks/products/use-products';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductToolbar } from '@/components/products/ProductToolbar';
import { ProductList } from '@/components/products/ProductList';
import { ProductEmptyState } from '@/components/products/ProductEmptyState';
import { ProductLoadingSkeleton } from '@/components/products/ProductLoadingSkeleton';
import { Product, ProductCategory } from '@/types';

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
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
    const categoryData: Omit<ProductCategory, "id" | "subcategories"> = {
      name: "Nueva categoría",
      description: "Descripción de la categoría",
    };
    createCategory(categoryData);
  };

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

  const handleAddProduct = () => {
    // Navigate to create product page or open dialog
    console.log('Add product clicked');
  };

  // Custom EmptyState for Products page
  const ProductsEmptyState = () => (
    <ProductEmptyState
      title="No hay productos"
      description={searchTerm 
        ? `No se encontraron productos que coincidan con "${searchTerm}". Intenta con otro término o crea un nuevo producto.`
        : "Aún no has creado ningún producto. Empieza creando tu primer producto."}
      onEdit={handleAddProduct}
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
          onAddProduct={handleAddProduct} 
        />
      ) : (
        <ProductsEmptyState />
      )}
    </div>
  );
}

export default Products;
