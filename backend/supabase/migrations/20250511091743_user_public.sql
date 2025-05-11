-- Add public column to users table
ALTER TABLE users ADD COLUMN is_public BOOLEAN DEFAULT true NOT NULL;
