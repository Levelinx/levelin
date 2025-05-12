-- First add 'open' value to the challenge_status enum
ALTER TYPE challenge_status ADD VALUE IF NOT EXISTS 'open';

-- Create a separate transaction for using the new enum value
DO $$ 
BEGIN
  -- We don't reference the new enum value in this transaction
  -- Just check if the column exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'targets') THEN
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'targets'::regclass AND attname = 'status') THEN
      ALTER TABLE "targets" ADD COLUMN "status" TEXT DEFAULT 'created';
      -- Later convert to enum without default
      ALTER TABLE "targets" ALTER COLUMN "status" TYPE challenge_status USING status::challenge_status;
    END IF;
  END IF;
END $$;

-- Third transaction to set defaults safely
DO $$
BEGIN
  -- Now we can set the default
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'targets') THEN
    ALTER TABLE "targets" ALTER COLUMN "status" SET DEFAULT 'created';
  END IF;
END $$;
