import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import privy from './privy';

// Load environment variables
dotenv.config();

// Environment variables
const NODE_ENV = process.env.NODE_ENV as string;
const PORT = process.env.PORT as string;
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET as string;
const PRIVY_APP_ID = process.env.PRIVY_APP_ID as string;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET as string;

if (!NODE_ENV || !PORT || !SUPABASE_URL || !SUPABASE_KEY || !SUPABASE_JWT_SECRET || !PRIVY_APP_ID || !PRIVY_APP_SECRET ) {
  console.error('Missing environment variables');
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

export {
  NODE_ENV,
  PORT,
  SUPABASE_URL,
  SUPABASE_KEY,
  SUPABASE_JWT_SECRET,
  PRIVY_APP_ID,
  PRIVY_APP_SECRET,
  supabase,
  privy
};
