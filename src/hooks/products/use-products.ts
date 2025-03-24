
import { useState } from 'react';
import { useProductsQuery, useProductCategoriesQuery, getProductById } from './use-product-queries';
import { useProductMutations } from './use-product-mutations';

// Main hook that combines all product-related functionality
export function useProducts() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Queries
  const { 
    data: products, 
    isLoading: isLoadingProducts, 
    error: productsError 
  } = useProductsQuery();
  
  const { 
    data: productCategories, 
    isLoading: isLoadingCategories, 
    error: categoriesError 
  } = useProductCategoriesQuery();
  
  // Mutations
  const { 
    createCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreatingCategory,
    isCreatingProduct,
    isUpdatingProduct,
    isDeletingProduct
  } = useProductMutations();
  
  // Get a product by ID
  const getProduct = async (id: string) => {
    try {
      setIsLoading(true);
      return await getProductById(id);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Data
    products,
    productCategories,
    
    // Loading states
    isLoadingProducts,
    isLoadingCategories,
    productsError,
    categoriesError,
    
    // Mutations
    createCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Utilities
    getProduct,
    
    // Combined loading state
    isLoading: isLoadingProducts || 
               isLoadingCategories || 
               isLoading || 
               isCreatingCategory || 
               isCreatingProduct || 
               isUpdatingProduct || 
               isDeletingProduct
  };
}
