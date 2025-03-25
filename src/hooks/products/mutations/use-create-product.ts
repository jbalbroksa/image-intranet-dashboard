
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserId } from '@/utils/setupSupabase';

export function useCreateProduct() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
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
}
