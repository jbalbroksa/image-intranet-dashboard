
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isValidUUID } from '@/utils/user-utils';

/**
 * Hook to delete a user
 * @returns Mutation function and related state
 */
export function useDeleteUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        // Validate UUID
        if (!isValidUUID(id)) {
          throw new Error('ID de usuario inválido');
        }
        
        console.log("Deleting user with ID:", id);
        
        // First delete the user from users table
        const { error: dbError } = await supabase
          .from('users')
          .delete()
          .eq('id', id);
        
        if (dbError) {
          console.error("Error deleting user from database:", dbError);
          throw dbError;
        }
        
        // Then try to delete from auth
        try {
          const { error: authError } = await supabase.auth.admin.deleteUser(id);
          
          if (authError) {
            console.error("Error deleting auth user:", authError);
            // Don't throw if this fails - the user record is already deleted from the users table
          }
        } catch (authError) {
          console.error("Exception when deleting auth user:", authError);
          // Don't throw if this fails - the user record is already deleted from the users table
        }
        
        console.log("User deleted successfully");
        return id;
      } catch (error) {
        console.error("Error in deleteUserMutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido eliminado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al eliminar usuario',
        description: error.message || 'Ocurrió un error al eliminar el usuario',
        variant: 'destructive'
      });
    }
  });
}
