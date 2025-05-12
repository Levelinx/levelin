import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '.';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
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