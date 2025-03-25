
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useCreateCategory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
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
}
