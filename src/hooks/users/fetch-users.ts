
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { mapDbUserToUser } from '@/utils/user-utils';

/**
 * Hook to fetch all users
 * @returns Query result with users data
 */
export function useFetchUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      // Map database fields to User interface
      return data.map(mapDbUserToUser) as User[];
    }
  });
}

/**
 * Hook to fetch a single user by ID
 * @param id User ID
 * @returns Query result with user data
 */
export function useFetchUserById(id?: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) throw new Error('User ID is required');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Map database fields to User interface
      return mapDbUserToUser(data) as User;
    },
    enabled: !!id
  });
}
