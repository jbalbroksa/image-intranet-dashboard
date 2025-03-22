
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory } from '@/types';
import { useToast } from './use-toast';
import { useAuth } from '@/context/AuthContext';

export function useProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Obtener todos los productos
  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      return data as Product[];
    }
  });

  // Obtener un producto por ID
  const getProduct = async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Product;
  };

  // Crear un producto
  const createProductMutation = useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => {
      if (!session?.user?.id) {
        throw new Error('Usuario no autenticado');
      }
      
      const { error } = await supabase
        .from('products')
        .insert({
          ...productData,
          author: session.user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto creado',
        description: 'El producto ha sido creado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al crear producto',
        description: error.message || 'Ocurrió un error al crear el producto',
        variant: 'destructive'
      });
    }
  });

  // Actualizar un producto
  const updateProductMutation = useMutation({
    mutationFn: async (productData: Partial<Product> & { id: string }) => {
      const { id, ...rest } = productData;
      const { error } = await supabase
        .from('products')
        .update({
          ...rest,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast({
        title: 'Producto actualizado',
        description: 'El producto ha sido actualizado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al actualizar producto',
        description: error.message || 'Ocurrió un error al actualizar el producto',
        variant: 'destructive'
      });
    }
  });

  // Eliminar un producto
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al eliminar producto',
        description: error.message || 'Ocurrió un error al eliminar el producto',
        variant: 'destructive'
      });
    }
  });

  // Obtener categorías de productos
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*');
      
      if (error) throw error;
      return data as ProductCategory[];
    }
  });

  // Crear categoría de producto
  const createCategoryMutation = useMutation({
    mutationFn: async (category: Omit<ProductCategory, 'id'>) => {
      const { error } = await supabase
        .from('product_categories')
        .insert(category);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      toast({
        title: 'Categoría creada',
        description: 'La categoría ha sido creada correctamente',
      });
    }
  });

  return {
    products,
    isLoadingProducts,
    productsError,
    getProduct,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    categories,
    isLoadingCategories,
    createCategory: createCategoryMutation.mutate,
    isLoading: isLoadingProducts || isLoading || 
               createProductMutation.isPending || 
               updateProductMutation.isPending || 
               deleteProductMutation.isPending ||
               createCategoryMutation.isPending
  };
}
