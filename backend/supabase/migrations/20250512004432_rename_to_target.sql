-- Check for challenges table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'challenges') THEN
    -- Rename tables if they exist
    ALTER TABLE "challenges" RENAME TO "targets";
  END IF;
END $$;

-- Check for challenge_submissions table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'challenge_submissions') THEN
    ALTER TABLE "challenge_submissions" RENAME TO "target_submissions";
    -- Only rename column if table was renamed
    ALTER TABLE "target_submissions" RENAME COLUMN "challenge_id" TO "target_id";
  END IF;
END $$;

-- Check for challenge_reviews table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'challenge_reviews') THEN
    ALTER TABLE "challenge_reviews" RENAME TO "target_reviews";
    -- Only rename constraint if it exists
    IF EXISTS (SELECT FROM pg_constraint WHERE conname = 'challenge_reviews_submission_id_fkey') THEN
      ALTER TABLE "target_reviews" RENAME CONSTRAINT "challenge_reviews_submission_id_fkey" 
        TO "target_reviews_submission_id_fkey";
    END IF;
  END IF;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS "targets" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "domain_id" UUID REFERENCES "domains"("id"),
  "difficulty" TEXT NOT NULL,
  "creator_id" UUID REFERENCES "users"("id"),
  "status" TEXT NOT NULL DEFAULT 'open',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "media_urls" TEXT[] DEFAULT '{}'::TEXT[],
  "proof_requirements" TEXT,
  "deadline" TIMESTAMP WITH TIME ZONE,
  "token_amount" NUMERIC NOT NULL DEFAULT 0
);

-- Create submission status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status_enum') THEN
    CREATE TYPE "submission_status_enum" AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

-- Create submissions table
CREATE TABLE IF NOT EXISTS "target_submissions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "target_id" UUID REFERENCES "targets"("id") ON DELETE CASCADE,
  "user_id" UUID REFERENCES "users"("id"),
  "description" TEXT,
  "proof_url" TEXT,
  "media_urls" TEXT[] DEFAULT '{}'::TEXT[],
  "notes" TEXT,
  "status" submission_status_enum DEFAULT 'pending',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create review status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status_enum') THEN
    CREATE TYPE "review_status_enum" AS ENUM ('approved', 'rejected');
  END IF;
END $$;

-- Create reviews table
CREATE TABLE IF NOT EXISTS "target_reviews" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "submission_id" UUID REFERENCES "target_submissions"("id") ON DELETE CASCADE,
  "reviewer_id" UUID REFERENCES "users"("id"),
  "feedback" TEXT,
  "status" review_status_enum,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add columns to targets if they don't exist
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'targets') THEN
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'targets'::regclass AND attname = 'media_urls') THEN
      ALTER TABLE "targets" ADD COLUMN "media_urls" TEXT[] DEFAULT '{}'::TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'targets'::regclass AND attname = 'proof_requirements') THEN
      ALTER TABLE "targets" ADD COLUMN "proof_requirements" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'targets'::regclass AND attname = 'deadline') THEN
      ALTER TABLE "targets" ADD COLUMN "deadline" TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'targets'::regclass AND attname = 'token_amount') THEN
      ALTER TABLE "targets" ADD COLUMN "token_amount" NUMERIC NOT NULL DEFAULT 0;
    END IF;
  END IF;
END $$;

-- Update target_submissions table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'target_submissions') THEN
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'target_submissions'::regclass AND attname = 'description') THEN
      ALTER TABLE "target_submissions" ADD COLUMN "description" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'target_submissions'::regclass AND attname = 'media_urls') THEN
      ALTER TABLE "target_submissions" ADD COLUMN "media_urls" TEXT[] DEFAULT '{}'::TEXT[];
    END IF;
    
    IF EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'target_submissions'::regclass AND attname = 'submission_url') THEN
      ALTER TABLE "target_submissions" RENAME COLUMN "submission_url" TO "proof_url";
    END IF;
  END IF;
END $$;

-- Update target_reviews table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'target_reviews') THEN
    IF EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'target_reviews'::regclass AND attname = 'rating') THEN
      ALTER TABLE "target_reviews" DROP COLUMN IF EXISTS "rating";
    END IF;
  END IF;
END $$;
