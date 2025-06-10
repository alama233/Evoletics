import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ncrxhrpqhkvkswyqkwvs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcnhocnBxaGt2a3N3eXFrd3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTQyMTIsImV4cCI6MjA1NDM3MDIxMn0.cj-gHRnqxVNVkVrnmAuPVuvqy-fdee_5qze8ar7Zym0';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
); 