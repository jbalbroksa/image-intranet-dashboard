
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// UUID validation helper function
const isValidUUID = (id: string): boolean => {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Delete a specification hook
export function useDeleteSpecification() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (specId: string) => {
      // Validate UUID format
      if (!isValidUUID(specId)) {
        console.error('Invalid specification ID format:', specId);
        throw new Error('Invalid specification ID format');
      }
      
      console.log('Deleting specification with ID:', specId);
      
      const { error } = await supabase
        .from('company_specifications')
        .delete()
        .eq('id', specId);
      
      if (error) {
        console.error('Error deleting company specification:', error);
        throw error;
      }
      
      console.log('Company specification deleted successfully');
      return specId;
    },
    onSuccess: () => {
      console.log('Specification deletion success callback');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Especificación eliminada',
        description: 'La especificación ha sido eliminada correctamente',
      });
    },
    onError: (error: any) => {
      console.error('Specification deletion error:', error);
      toast({
        title: 'Error al eliminar especificación',
        description: error.message || 'Ocurrió un error al eliminar la especificación',
        variant: 'destructive'
      });
    }
  });
}
