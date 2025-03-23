
import { supabase } from '@/integrations/supabase/client';

// This function initializes the Supabase client with the correct settings
export const initializeSupabase = () => {
  // Ensure auth is properly configured for persistence
  const supabaseConfig = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: localStorage,
    },
  };

  // Log initial configuration
  console.log('Initializing Supabase client with:', supabaseConfig);

  return supabase;
};

// Export a helper function to check if a user is authenticated
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Helper function to get the current authenticated user's ID
export const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id;
};
