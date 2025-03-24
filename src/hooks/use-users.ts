
import { useState } from 'react';
import { useFetchUsers } from './users/fetch-users';
import { useCreateUser } from './users/create-user';
import { useUpdateUser } from './users/update-user';
import { useDeleteUser } from './users/delete-user';

/**
 * Main hook for user management operations
 * @returns Combined user operations
 */
export function useUsers() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Get all users
  const { 
    data: users, 
    isLoading: isLoadingUsers, 
    error: usersError 
  } = useFetchUsers();

  // Create a user
  const createUserMutation = useCreateUser();

  // Update a user
  const updateUserMutation = useUpdateUser();

  // Delete a user
  const deleteUserMutation = useDeleteUser();

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
