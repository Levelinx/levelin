use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("Ewxy19J2YDAQQv74hkHbz9MiVSzb9xvuK1drHxitrJos");

#[program]
pub mod contract {
    use super::*;
    use instructions::initialize;
    use instructions::user;
    use instructions::domain;
    use instructions::challenge;

    // Initialize the program with the program authority
    pub fn initialize(ctx: Context<initialize::Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }

    // Register a new user
    pub fn register_user(
        ctx: Context<user::RegisterUser>,
        name: String,
        dob: String,
        email: String,
        domains: Vec<String>,
    ) -> Result<()> {
        user::register_user(ctx, name, dob, email, domains)
    }

    // Update user metadata
    pub fn update_user_metadata(
        ctx: Context<user::UpdateUserMetadata>,
        name: Option<String>,
        dob: Option<String>,
        email: Option<String>,
    ) -> Result<()> {
        user::update_user_metadata(ctx, name, dob, email)
    }

    // Create a new domain
    pub fn create_domain(
        ctx: Context<domain::CreateDomain>,
        domain_name: String,
        domain_description: String,
    ) -> Result<()> {
        domain::create_domain(ctx, domain_name, domain_description)
    }

    // Add domain to user
    pub fn add_domain_to_user(
        ctx: Context<domain::AddDomainToUser>,
        domain_name: String,
    ) -> Result<()> {
        domain::add_domain_to_user(ctx, domain_name)
    }

    // Create a challenge
    pub fn create_challenge(
        ctx: Context<challenge::CreateChallenge>,
        domain_name: String,
        description: String,
        fee: u64,
        deadline: i64,
    ) -> Result<()> {
        challenge::create_challenge(ctx, domain_name, description, fee, deadline)
    }

    // Take a challenge
    pub fn take_challenge(
        ctx: Context<challenge::TakeChallenge>,
        challenge_id: Pubkey,
    ) -> Result<()> {
        challenge::take_challenge(ctx, challenge_id)
    }

    // Submit challenge proof
    pub fn submit_challenge_proof(
        ctx: Context<challenge::SubmitChallengeProof>,
        challenge_id: Pubkey,
        proof_url: String,
    ) -> Result<()> {
        challenge::submit_challenge_proof(ctx, challenge_id, proof_url)
    }

    // Review challenge
    pub fn review_challenge(
        ctx: Context<challenge::ReviewChallenge>,
        challenge_id: Pubkey,
        completed: bool,
        review_notes: String,
    ) -> Result<()> {
        challenge::review_challenge(ctx, challenge_id, completed, review_notes)
    }

    // Finalize challenge
    pub fn finalize_challenge(
        ctx: Context<challenge::FinalizeChallenge>,
        challenge_id: Pubkey,
    ) -> Result<()> {
        challenge::finalize_challenge(ctx, challenge_id)
    }
}

// Empty struct to implement Initialize trait
#[derive(Accounts)]
pub struct Initialize {}
