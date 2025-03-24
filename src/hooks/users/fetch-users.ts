
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
