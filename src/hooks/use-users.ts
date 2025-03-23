
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useToast } from './use-toast';

export function useUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // UUID validation helper function
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Get all users
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      // Map database fields to User interface
      return data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: user.type,
        avatar: user.avatar,
        branchId: user.branch_id,
        position: user.position,
        extension: user.extension,
        socialContact: user.social_contact,
        createdAt: user.created_at
      })) as User[];
    }
  });

  // Create a user
  const createUserMutation = useMutation({
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

  // Update a user
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User> & { id: string }) => {
      try {
        const { id, ...rest } = userData;
        
        // Validate UUID
        if (!isValidUUID(id)) {
          throw new Error('ID de usuario inválido');
        }
        
        // Map User interface to database fields
        const dbData: Record<string, any> = {};
        
        if (rest.name) dbData.name = rest.name;
        if (rest.email) dbData.email = rest.email;
        if (rest.role) dbData.role = rest.role;
        if (rest.type) dbData.type = rest.type;
        if (rest.avatar !== undefined) dbData.avatar = rest.avatar;
        if (rest.branchId !== undefined) dbData.branch_id = rest.branchId;
        if (rest.position !== undefined) dbData.position = rest.position;
        if (rest.extension !== undefined) dbData.extension = rest.extension;
        if (rest.socialContact !== undefined) dbData.social_contact = rest.socialContact;
        
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

  // Delete a user
  const deleteUserMutation = useMutation({
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

  return {
    users,
    isLoadingUsers,
    usersError,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isLoading: isLoadingUsers || isLoading || 
               createUserMutation.isPending || 
               updateUserMutation.isPending || 
               deleteUserMutation.isPending
  };
}
