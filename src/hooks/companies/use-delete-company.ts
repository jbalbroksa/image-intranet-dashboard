
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// UUID validation helper function
const isValidUUID = (id: string): boolean => {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Delete a company hook
export function useDeleteCompany() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Validate UUID format
      if (!isValidUUID(id)) {
        console.error('Invalid company ID format:', id);
        throw new Error('Invalid company ID format');
      }
      
      console.log('Deleting company with ID:', id);
      
      // Specifications will be deleted in cascade thanks to ON DELETE CASCADE constraint
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting company:', error);
        throw error;
      }
      
      console.log('Company deleted successfully');
      return id;
    },
    onSuccess: () => {
      console.log('Company deletion success callback');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Compañía eliminada',
        description: 'La compañía ha sido eliminada correctamente',
      });
    },
    onError: (error: any) => {
      console.error('Company deletion error:', error);
      toast({
        title: 'Error al eliminar compañía',
        description: error.message || 'Ocurrió un error al eliminar la compañía',
        variant: 'destructive'
      });
    }
  });
}
