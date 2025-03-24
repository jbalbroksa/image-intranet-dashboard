
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { mapUserToDbUser } from '@/utils/user-utils';

/**
 * Hook to create a new user
 * @returns Mutation function and related state
 */
export function useCreateUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
      try {
        console.log("Creating user with data:", {
          ...userData,
          password: "***" // Log without showing actual password
        });
        
        // First create the user in auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              role: userData.role,
              type: userData.type
            }
          }
        });
        
        if (authError) {
          console.error("Auth error:", authError);
          throw authError;
        }
        
        if (!authData.user?.id) {
          console.error("No user ID returned from auth");
          throw new Error('No se pudo crear el usuario en el sistema de autenticación');
        }

        console.log("User created in auth with ID:", authData.user.id);

        // Map User interface to database fields
        const dbData = {
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          type: userData.type,
          branch_id: userData.branchId,
          position: userData.position,
          extension: userData.extension,
          social_contact: userData.socialContact,
          avatar: userData.avatar
        };
        
        console.log("Creating user in database with data:", dbData);
        
        // Then create the profile in the users table
        const { error: dbError, data: dbData2 } = await supabase
          .from('users')
          .insert(dbData)
          .select();
        
        if (dbError) {
          console.error("Database error:", dbError);
          // Try to delete the auth user if database insert fails
          try {
            await supabase.auth.admin.deleteUser(authData.user.id);
          } catch (deleteError) {
            console.error("Could not delete auth user after failed insert:", deleteError);
          }
          throw dbError;
        }
        
        console.log("User created successfully. Database response:", dbData2);
        return authData.user.id;
      } catch (error) {
        console.error("Error in createUserMutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado correctamente',
      });
    },
    onError: (error: any) => {
      console.error("Error handler in createUserMutation:", error);
      let errorMessage = 'Ocurrió un error al crear el usuario';
      
      // Check for specific error messages
      if (error.message?.includes('rate limit')) {
        errorMessage = 'Por motivos de seguridad, debes esperar unos segundos antes de intentar crear otro usuario';
      } else if (error.message?.includes('already exists')) {
        errorMessage = 'Ya existe un usuario con este correo electrónico';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error al crear usuario',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  });
}
