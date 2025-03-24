
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserId } from '@/utils/setupSupabase';

// Hook for product mutations
export function useProductMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create a new product category
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: Omit<ProductCategory, "id" | "subcategories">) => {
      console.log('Creating new product category with data:', categoryData);
      
      // Map ProductCategory interface to database fields
      const dbData = {
        name: categoryData.name,
        parent_id: categoryData.parentId,
        description: categoryData.description
      };
      
      console.log('Prepared category data for insertion:', dbData);
      
      // Insert the category
      const { data, error } = await supabase
        .from('product_categories')
        .insert(dbData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product category:', error);
        throw error;
      }
      
      console.log('Product category created successfully:', data);
      
      return data.id;
    },
    onSuccess: () => {
      console.log('Product category creation success callback');
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      toast({
        title: 'Categoría creada',
        description: 'La categoría ha sido creada correctamente',
      });
    },
    onError: (error: any) => {
      console.error('Product category creation error:', error);
      toast({
        title: 'Error al crear categoría',
        description: error.message || 'Ocurrió un error al crear la categoría',
        variant: 'destructive'
      });
    }
  });

  // Create a new product
  const createProductMutation = useMutation({
    mutationFn: async (productData: Omit<Product, "id" | "author" | "createdAt" | "updatedAt">) => {
      console.log('Creating new product with data:', productData);
      
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }
      
      // Map Product interface to database fields
      const dbData = {
        name: productData.name,
        category_id: productData.categoryId,
        subcategory_id: productData.subcategoryId,
        company_id: productData.companyId,
        description: productData.description,
        status: productData.status,
        strengths: productData.strengths,
        weaknesses: productData.weaknesses,
        processes: productData.processes,
        tags: productData.tags,
        author: userId
      };
      
      console.log('Prepared product data for insertion:', dbData);
      
      // Insert the product
      const { data, error } = await supabase
        .from('products')
        .insert(dbData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      
      console.log('Product created successfully:', data);
      
      return data.id;
    },
    onSuccess: () => {
      console.log('Product creation success callback');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto creado',
        description: 'El producto ha sido creado correctamente',
      });
    },
    onError: (error: any) => {
      console.error('Product creation error:', error);
      toast({
        title: 'Error al crear producto',
        description: error.message || 'Ocurrió un error al crear el producto',
        variant: 'destructive'
      });
    }
  });

  // Update a product
  const updateProductMutation = useMutation({
    mutationFn: async (productData: Partial<Product> & { id: string }) => {
      console.log('Updating product with data:', productData);
      
      const { id, ...updateData } = productData;
      
      // Map Product interface to database fields
      const dbData: Record<string, any> = {};
      
      if (updateData.name !== undefined) dbData.name = updateData.name;
      if (updateData.categoryId !== undefined) dbData.category_id = updateData.categoryId;
      if (updateData.subcategoryId !== undefined) dbData.subcategory_id = updateData.subcategoryId;
      if (updateData.companyId !== undefined) dbData.company_id = updateData.companyId;
      if (updateData.description !== undefined) dbData.description = updateData.description;
      if (updateData.status !== undefined) dbData.status = updateData.status;
      if (updateData.strengths !== undefined) dbData.strengths = updateData.strengths;
      if (updateData.weaknesses !== undefined) dbData.weaknesses = updateData.weaknesses;
      if (updateData.processes !== undefined) dbData.processes = updateData.processes;
      if (updateData.tags !== undefined) dbData.tags = updateData.tags;
      
      dbData.updated_at = new Date().toISOString();
      
      console.log('Prepared product data for update:', dbData);
      
      // Update the product
      const { error } = await supabase
        .from('products')
        .update(dbData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      
      console.log('Product updated successfully');
      
      return id;
    },
    onSuccess: (id) => {
      console.log('Product update success callback with ID:', id);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast({
        title: 'Producto actualizado',
        description: 'El producto ha sido actualizado correctamente',
      });
    },
    onError: (error: any) => {
      console.error('Product update error:', error);
      toast({
        title: 'Error al actualizar producto',
        description: error.message || 'Ocurrió un error al actualizar el producto',
        variant: 'destructive'
      });
    }
  });

  // Delete a product
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting product with ID:', id);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      
      console.log('Product deleted successfully');
      return id;
    },
    onSuccess: () => {
      console.log('Product deletion success callback');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado correctamente',
      });
    },
    onError: (error: any) => {
      console.error('Product deletion error:', error);
      toast({
        title: 'Error al eliminar producto',
        description: error.message || 'Ocurrió un error al eliminar el producto',
        variant: 'destructive'
      });
    }
  });

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
