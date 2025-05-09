-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE challenge_status AS ENUM (
  'created',
  'accepted',
  'submitted',
  'reviewing',
  'completed',
  'finalized',
  'failed'
);

CREATE TYPE transaction_type AS ENUM (
  'stake',
  'reward',
  'penalty',
  'initial'
);

CREATE TYPE notification_type AS ENUM (
  'challenge_created',
  'challenge_accepted',
  'submission_uploaded',
  'review_received',
  'challenge_completed',
  'challenge_finalized',
  'token_received',
  'domain_joined'
);

CREATE TYPE reference_type AS ENUM (
  'challenge',
  'review',
  'submission',
  'domain'
);

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  privy_id TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT UNIQUE,
  date_of_birth TIMESTAMP,
  ethereum_wallet TEXT,
  solana_wallet TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  authority UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  token_balance BIGINT DEFAULT 0 NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, domain_id)
);

CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  challenger_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  token_fee BIGINT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status challenge_status DEFAULT 'created' NOT NULL,
  is_finalized BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS challenges_domain_id_idx ON challenges(domain_id);
CREATE INDEX IF NOT EXISTS challenges_creator_id_idx ON challenges(creator_id);
CREATE INDEX IF NOT EXISTS challenges_challenger_id_idx ON challenges(challenger_id);
CREATE INDEX IF NOT EXISTS challenges_status_idx ON challenges(status);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  submission_url TEXT NOT NULL,
  description TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS submissions_challenge_id_idx ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS submissions_user_id_idx ON submissions(user_id);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  passed BOOLEAN NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS reviews_challenge_id_idx ON reviews(challenge_id);
CREATE INDEX IF NOT EXISTS reviews_reviewer_id_idx ON reviews(reviewer_id);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  amount BIGINT NOT NULL,
  type transaction_type NOT NULL,
  reference_id UUID,
  reference_type reference_type,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_domain_id_idx ON transactions(domain_id);
CREATE INDEX IF NOT EXISTS transactions_type_idx ON transactions(type);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  content TEXT NOT NULL,
  reference_id UUID,
  reference_type reference_type,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_domains
BEFORE UPDATE ON domains
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_user_domains
BEFORE UPDATE ON user_domains
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_challenges
BEFORE UPDATE ON challenges
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_submissions
BEFORE UPDATE ON submissions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_reviews
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
