
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useUpdateProduct() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
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
}
