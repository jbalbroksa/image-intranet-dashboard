
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

  // UUID validation helper function
  const isValidUUID = (id: string): boolean => {
    if (!id) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Get all products
  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching all products');
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched:', data);
      
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
        strengths: product.strengths,
        weaknesses: product.weaknesses,
        processes: product.processes,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        author: product.author
      })) as Product[];
    }
  });

  // Get a product by ID
  const getProduct = async (id: string) => {
    // Validate UUID format before querying
    if (!isValidUUID(id)) {
      console.error('Invalid product ID format:', id);
      throw new Error('Invalid product ID format');
    }

    console.log('Fetching product with ID:', id);
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
    
    console.log('Product fetched:', data);
    
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
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      processes: data.processes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      author: data.author
    } as Product;
  };

  // Create a product
  const createProductMutation = useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => {
      if (!user?.id) {
        console.error('Cannot create product: User not authenticated');
        throw new Error('Usuario no autenticado');
      }
      
      console.log('Creating new product with data:', productData);
      
      // Map Product interface to database fields
      const dbData = {
        name: productData.name,
        category_id: productData.categoryId,
        subcategory_id: productData.subcategoryId,
        company_id: productData.companyId,
        description: productData.description,
        status: productData.status,
        tags: productData.tags,
        strengths: productData.strengths,
        weaknesses: productData.weaknesses,
        processes: productData.processes,
        author: user.id
      };
      
      console.log('Prepared product data for insertion:', dbData);
      
      const { error, data } = await supabase
        .from('products')
        .insert(dbData)
        .select();
      
      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      
      console.log('Product created successfully:', data);
      return data[0];
    },
    onSuccess: (data) => {
      console.log('Product creation success callback with data:', data);
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
      const { id, ...rest } = productData;
      
      // Validate UUID format
      if (!isValidUUID(id)) {
        console.error('Invalid product ID format:', id);
        throw new Error('Invalid product ID format');
      }
      
      console.log('Updating product with ID:', id, 'and data:', rest);
      
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
      if (rest.strengths !== undefined) dbData.strengths = rest.strengths;
      if (rest.weaknesses !== undefined) dbData.weaknesses = rest.weaknesses;
      if (rest.processes !== undefined) dbData.processes = rest.processes;
      
      console.log('Prepared product data for update:', dbData);
      
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
      // Validate UUID format
      if (!isValidUUID(id)) {
        console.error('Invalid product ID format:', id);
        throw new Error('Invalid product ID format');
      }

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

  // Get product categories with hierarchical structure
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      console.log('Fetching product categories');
      const { data, error } = await supabase
        .from('product_categories')
        .select('*');
      
      if (error) {
        console.error('Error fetching product categories:', error);
        throw error;
      }
      
      console.log('Product categories fetched:', data);
      
      // Transform flat list to hierarchical structure
      const categoriesMap = new Map<string, ProductCategory>();
      
      // First pass: Create all category objects
      data.forEach(category => {
        categoriesMap.set(category.id, {
          id: category.id,
          name: category.name,
          parentId: category.parent_id,
          description: category.description,
          subcategories: []
        });
      });
      
      // Second pass: Build the hierarchy
      const rootCategories: ProductCategory[] = [];
      categoriesMap.forEach(category => {
        if (category.parentId) {
          const parent = categoriesMap.get(category.parentId);
          if (parent && parent.subcategories) {
            parent.subcategories.push(category);
          }
        } else {
          rootCategories.push(category);
        }
      });
      
      return rootCategories;
    }
  });

  // Create a product category
  const createCategoryMutation = useMutation({
    mutationFn: async (category: Omit<ProductCategory, 'id' | 'subcategories'>) => {
      console.log('Creating new product category with data:', category);
      
      // Map ProductCategory interface to database fields
      const dbData = {
        name: category.name,
        parent_id: category.parentId,
        description: category.description
      };
      
      console.log('Prepared category data for insertion:', dbData);
      
      const { error, data } = await supabase
        .from('product_categories')
        .insert(dbData)
        .select();
      
      if (error) {
        console.error('Error creating product category:', error);
        throw error;
      }
      
      console.log('Product category created successfully:', data);
      return data[0];
    },
    onSuccess: () => {
      console.log('Category creation success callback');
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      toast({
        title: 'Categoría creada',
        description: 'La categoría ha sido creada correctamente',
      });
    },
    onError: (error: any) => {
      console.error('Category creation error:', error);
      toast({
        title: 'Error al crear categoría',
        description: error.message || 'Ocurrió un error al crear la categoría',
        variant: 'destructive'
      });
    }
  });

  // Update a product category
  const updateCategoryMutation = useMutation({
    mutationFn: async (categoryData: Partial<ProductCategory> & { id: string }) => {
      const { id, subcategories, ...rest } = categoryData;
      
      // Validate UUID format
      if (!isValidUUID(id)) {
        console.error('Invalid category ID format:', id);
        throw new Error('Invalid category ID format');
      }
      
      console.log('Updating category with ID:', id, 'and data:', rest);
      
      // Map Category interface to database fields
      const dbData: Record<string, any> = {};
      
      if (rest.name) dbData.name = rest.name;
      if (rest.parentId !== undefined) dbData.parent_id = rest.parentId;
      if (rest.description !== undefined) dbData.description = rest.description;
      
      console.log('Prepared category data for update:', dbData);
      
      const { error } = await supabase
        .from('product_categories')
        .update(dbData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }
      
      console.log('Category updated successfully');
      return id;
    },
    onSuccess: () => {
      console.log('Category update success callback');
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      toast({
        title: 'Categoría actualizada',
        description: 'La categoría ha sido actualizada correctamente',
      });
    },
    onError: (error: any) => {
      console.error('Category update error:', error);
      toast({
        title: 'Error al actualizar categoría',
        description: error.message || 'Ocurrió un error al actualizar la categoría',
        variant: 'destructive'
      });
    }
  });

  // Delete a product category
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      // Validate UUID format
      if (!isValidUUID(id)) {
        console.error('Invalid category ID format:', id);
        throw new Error('Invalid category ID format');
      }

      console.log('Deleting category with ID:', id);
      
      // First check if this category has subcategories
      const { data: subcategories, error: subcategoriesError } = await supabase
        .from('product_categories')
        .select('id')
        .eq('parent_id', id);
        
      if (subcategoriesError) {
        console.error('Error checking subcategories:', subcategoriesError);
        throw subcategoriesError;
      }
      
      if (subcategories && subcategories.length > 0) {
        throw new Error('No se puede eliminar una categoría que tiene subcategorías');
      }
      
      // Then check if there are products using this category
      const { data: productsWithCategory, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', id);
        
      if (productsError) {
        console.error('Error checking products with category:', productsError);
        throw productsError;
      }
      
      if (productsWithCategory && productsWithCategory.length > 0) {
        throw new Error('No se puede eliminar una categoría que está siendo utilizada por productos');
      }
      
      // Finally delete the category
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
      
      console.log('Category deleted successfully');
      return id;
    },
    onSuccess: () => {
      console.log('Category deletion success callback');
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      toast({
        title: 'Categoría eliminada',
        description: 'La categoría ha sido eliminada correctamente',
      });
    },
    onError: (error: any) => {
      console.error('Category deletion error:', error);
      toast({
        title: 'Error al eliminar categoría',
        description: error.message || 'Ocurrió un error al eliminar la categoría',
        variant: 'destructive'
      });
    }
  });

  // Get all categories as a flat list (for dropdowns, etc.)
  const getFlatCategoriesList = () => {
    if (!categories) return [];
    
    const flatList: ProductCategory[] = [];
    
    const flatten = (category: ProductCategory, depth = 0) => {
      const indentedName = `${'  '.repeat(depth)}${category.name}`;
      flatList.push({
        ...category,
        name: indentedName
      });
      
      if (category.subcategories) {
        category.subcategories.forEach(subcat => flatten(subcat, depth + 1));
      }
    };
    
    categories.forEach(category => flatten(category));
    return flatList;
  };

  return {
    products,
    isLoadingProducts,
    productsError,
    getProduct,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    categories,
    flatCategories: getFlatCategoriesList(),
    isLoadingCategories,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isLoading: isLoadingProducts || isLoading || 
               createProductMutation.isPending || 
               updateProductMutation.isPending || 
               deleteProductMutation.isPending ||
               createCategoryMutation.isPending ||
               updateCategoryMutation.isPending ||
               deleteCategoryMutation.isPending
  };
}
