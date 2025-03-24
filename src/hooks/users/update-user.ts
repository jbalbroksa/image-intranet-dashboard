
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { isValidUUID, mapUserToDbUser } from '@/utils/user-utils';

/**
 * Hook to update an existing user
 * @returns Mutation function and related state
 */
export function useUpdateUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Partial<User> & { id: string }) => {
      try {
        const { id, ...rest } = userData;
        
        // Validate UUID
        if (!isValidUUID(id)) {
          throw new Error('ID de usuario inválido');
        }
        
        // Map User interface to database fields
        const dbData = mapUserToDbUser(rest);
        
        console.log("Updating user in database:", { id, dbData });
        
        const { error, data } = await supabase
          .from('users')
          .update(dbData)
          .eq('id', id)
          .select();
        
        if (error) {
          console.error("Error updating user:", error);
          throw error;
        }
        
        console.log("User updated successfully:", data);
        return id;
      } catch (error) {
        console.error("Error in updateUserMutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Usuario actualizado',
        description: 'El usuario ha sido actualizado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al actualizar usuario',
        description: error.message || 'Ocurrió un error al actualizar el usuario',
        variant: 'destructive'
      });
    }
  });
}
