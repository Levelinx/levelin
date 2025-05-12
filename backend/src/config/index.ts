import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment variables
const NODE_ENV = process.env.NODE_ENV as string;
const PORT = process.env.PORT as string;
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET as string;
const PRIVY_APP_ID = process.env.PRIVY_APP_ID as string;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET as string;

if (!NODE_ENV || !PORT || !SUPABASE_URL || !SUPABASE_KEY || !SUPABASE_JWT_SECRET || !PRIVY_APP_ID || !PRIVY_APP_SECRET ) {
  console.error('Missing environment variables');
}

import privy from './privy';
import supabase from './supabase';

export {
  NODE_ENV,
  PORT,
  SUPABASE_URL,
  SUPABASE_KEY,
  SUPABASE_JWT_SECRET,
  PRIVY_APP_ID,
  PRIVY_APP_SECRET,
  privy,
  supabase
};
