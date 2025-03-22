
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useToast } from './use-toast';

export function useUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

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
      // First create the user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });
      
      if (authError) throw authError;
      
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
      
      // Then create the profile in the users table
      const { error } = await supabase
        .from('users')
        .insert(dbData);
      
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

  // Update a user
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User> & { id: string }) => {
      const { id, ...rest } = userData;
      
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
      
      const { error } = await supabase
        .from('users')
        .update(dbData)
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

  // Delete a user
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      // First delete the user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      
      if (authError) throw authError;
      
      // Then delete the profile from the users table
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
