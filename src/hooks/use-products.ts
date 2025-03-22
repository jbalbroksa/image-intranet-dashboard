
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory } from '@/types';
import { useToast } from './use-toast';
import { useAuth } from '@/context/AuthContext';

export function useProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get all products
  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      
      // Map database fields to Product interface
      return data.map(product => ({
        id: product.id,
        name: product.name,
        categoryId: product.category_id,
        subcategoryId: product.subcategory_id,
        companyId: product.company_id,
        description: product.description,
        status: product.status,
        tags: product.tags as string[] | undefined,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        author: product.author
      })) as Product[];
    }
  });

  // Get a product by ID
  const getProduct = async (id: string) => {
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
    } as Product;
  };

  // Create a product
  const createProductMutation = useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => {
      if (!user?.id) {
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
        tags: productData.tags,
        author: user.id
      };
      
      const { error } = await supabase
        .from('products')
        .insert(dbData);
      
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

  // Update a product
  const updateProductMutation = useMutation({
    mutationFn: async (productData: Partial<Product> & { id: string }) => {
      const { id, ...rest } = productData;
      
      // Map Product interface to database fields
      const dbData: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      
      if (rest.name) dbData.name = rest.name;
      if (rest.categoryId) dbData.category_id = rest.categoryId;
      if (rest.subcategoryId !== undefined) dbData.subcategory_id = rest.subcategoryId;
      if (rest.companyId) dbData.company_id = rest.companyId;
      if (rest.description !== undefined) dbData.description = rest.description;
      if (rest.status) dbData.status = rest.status;
      if (rest.tags !== undefined) dbData.tags = rest.tags;
      
      const { error } = await supabase
        .from('products')
        .update(dbData)
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

  // Delete a product
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

  // Get product categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*');
      
      if (error) throw error;
      
      // Map database fields to ProductCategory interface
      return data.map(category => ({
        id: category.id,
        name: category.name,
        parentId: category.parent_id
      })) as ProductCategory[];
    }
  });

  // Create a product category
  const createCategoryMutation = useMutation({
    mutationFn: async (category: Omit<ProductCategory, 'id'>) => {
      // Map ProductCategory interface to database fields
      const dbData = {
        name: category.name,
        parent_id: category.parentId
      };
      
      const { error } = await supabase
        .from('product_categories')
        .insert(dbData);
      
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
