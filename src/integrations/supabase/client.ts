// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://phoalosrgrlsiomaqgrx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBob2Fsb3NyZ3Jsc2lvbWFxZ3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzUwOTIsImV4cCI6MjA1ODI1MTA5Mn0.Qs5PJxgnFW2Nub4VK7A3X0dTUHtYlrKW3B5L669tqTk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);