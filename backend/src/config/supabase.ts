import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '.';
import { Database } from '../types/database.types';

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false
  },
  global: {
    headers: {
      'X-Client-Info': 'levelin-backend'
    }
  }
});

export default supabase;