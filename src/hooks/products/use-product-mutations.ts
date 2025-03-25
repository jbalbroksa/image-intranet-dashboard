
import { useCreateCategory } from './mutations/use-create-category';
import { useCreateProduct } from './mutations/use-create-product';
import { useUpdateProduct } from './mutations/use-update-product';
import { useDeleteProduct } from './mutations/use-delete-product';

// Hook for product mutations
export function useProductMutations() {
  const createCategoryMutation = useCreateCategory();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  return {
    createCategory: createCategoryMutation.mutate,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isCreatingCategory: createCategoryMutation.isPending,
    isCreatingProduct: createProductMutation.isPending,
    isUpdatingProduct: updateProductMutation.isPending, 
    isDeletingProduct: deleteProductMutation.isPending
  };
}
