-- Add difficulty column to targets table if it doesn't exist
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'targets') THEN
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'targets'::regclass AND attname = 'difficulty') THEN
      ALTER TABLE "targets" ADD COLUMN "difficulty" TEXT NOT NULL DEFAULT 'beginner';
    END IF;
  END IF;
END $$; 