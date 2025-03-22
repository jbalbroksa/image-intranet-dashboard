
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useToast } from './use-toast';

export function useUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Obtener todos los usuarios
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      return data as User[];
    }
  });

  // Crear un usuario
  const createUserMutation = useMutation({
    mutationFn: async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
      // Primero creamos el usuario en auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });
      
      if (authError) throw authError;
      
      // Luego creamos el perfil en la tabla users
      const { error } = await supabase
        .from('users')
        .insert({
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
        });
      
      if (error) throw error;
      
      return authData.user.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al crear usuario',
        description: error.message || 'Ocurrió un error al crear el usuario',
        variant: 'destructive'
      });
    }
  });

  // Actualizar un usuario
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User> & { id: string }) => {
      const { id, ...rest } = userData;
      const { error } = await supabase
        .from('users')
        .update(rest)
        .eq('id', id);
      
      if (error) throw error;
      return id;
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

  // Eliminar un usuario
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      // Primero eliminamos el usuario de auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      
      if (authError) throw authError;
      
      // Luego eliminamos el perfil de la tabla users
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
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
    isLoading: isLoadingUsers || isLoading || createUserMutation.isPending || updateUserMutation.isPending || deleteUserMutation.isPending
  };
}
