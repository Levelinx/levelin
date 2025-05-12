export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id'>>;
      };
      targets: {
        Row: Target;
        Insert: Omit<Target, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Target, 'id'>>;
      };
      target_submissions: {
        Row: TargetSubmission;
        Insert: Omit<TargetSubmission, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TargetSubmission, 'id'>>;
      };
      target_reviews: {
        Row: TargetReview;
        Insert: Omit<TargetReview, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TargetReview, 'id'>>;
      };
      domains: {
        Row: Domain;
        Insert: Omit<Domain, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Domain, 'id'>>;
      };
    };
  };
}

export interface User {
  id: string;
  privy_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  solana_wallet?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export interface Target {
  id: string;
  title: string;
  description: string;
  domain_id: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  creator_id: string;
  status: 'open' | 'closed' | 'completed';
  created_at: string;
  updated_at: string;
  media_urls?: string[];
  proof_requirements?: string;
  deadline?: string;
  token_amount: number;
}

export interface TargetSubmission {
  id: string;
  target_id: string;
  user_id: string;
  description: string;
  proof_url: string;
  media_urls?: string[];
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface TargetReview {
  id: string;
  submission_id: string;
  reviewer_id: string;
  feedback: string;
  status: 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
} 