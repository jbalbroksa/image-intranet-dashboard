
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory } from '@/types';

// Get all products
export function useProductsQuery() {
  return useQuery({
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
        strengths: product.strengths,
        weaknesses: product.weaknesses,
        processes: product.processes,
        tags: product.tags,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        author: product.author
      })) as Product[];
    }
  });
}

// Get all product categories
export function useProductCategoriesQuery() {
  return useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      console.log('Fetching all product categories');
      const { data, error } = await supabase
        .from('product_categories')
        .select('*');
      
      if (error) {
        console.error('Error fetching product categories:', error);
        throw error;
      }
      
      console.log('Product categories fetched:', data);
      
      // Process categories to build a hierarchy
      const categories = data.map(category => ({
        id: category.id,
        name: category.name,
        parentId: category.parent_id,
        description: category.description,
        subcategories: []
      })) as ProductCategory[];
      
      // Build category hierarchy
      const categoryMap = new Map<string, ProductCategory>();
      categories.forEach(category => categoryMap.set(category.id, { ...category }));
      
      const rootCategories: ProductCategory[] = [];
      
      categoryMap.forEach(category => {
        if (category.parentId) {
          const parent = categoryMap.get(category.parentId);
          if (parent) {
            if (!parent.subcategories) parent.subcategories = [];
            parent.subcategories.push(category);
          } else {
            rootCategories.push(category);
          }
        } else {
          rootCategories.push(category);
        }
      });
      
      return categories;
    }
  });
}

// Get a product by ID
export async function getProductById(id: string) {
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
  
  console.log('Product data fetched:', data);
  
  // Map database fields to Product interface
  return {
    id: data.id,
    name: data.name,
    categoryId: data.category_id,
    subcategoryId: data.subcategory_id,
    companyId: data.company_id,
    description: data.description,
    status: data.status,
    strengths: data.strengths,
    weaknesses: data.weaknesses,
    processes: data.processes,
    tags: data.tags,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    author: data.author
  } as Product;
}
