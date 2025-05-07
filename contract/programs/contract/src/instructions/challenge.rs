use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;
use crate::errors::WorkProofError;
use crate::states::program_authority::ProgramAuthority;
use crate::instructions::user::User;
use crate::instructions::domain::Domain;

#[account]
pub struct Challenge {
    pub creator: Pubkey,
    pub domain: String,
    pub description: String,
    pub fee: u64,
    pub deadline: i64,
    pub is_completed: bool,
    pub is_finalized: bool,
    pub proof_url: Option<String>,
    pub reviews: Vec<Review>,
    pub challenger: Option<Pubkey>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Review {
    pub reviewer: Pubkey,
    pub completed: bool,
    pub review_notes: String,
}

#[derive(Accounts)]
#[instruction(domain_name: String, description: String, fee: u64, deadline: i64)]
pub struct CreateChallenge<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        seeds = [b"user", authority.key().as_ref()],
        bump,
        constraint = user.authority == authority.key(),
        constraint = user.domains.contains(&domain_name)
    )]
    pub user: Account<'info, User>,
    
    #[account(
        seeds = [b"domain", domain_name.as_bytes()],
        bump
    )]
    pub domain: Account<'info, Domain>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + domain_name.len() + 4 + description.len() + 8 + 8 + 1 + 1 + 
            (1 + 4 + 200) + 4 + 10 * (32 + 1 + 4 + 200) + 1 + (1 + 32) + 1, // Allow for 10 reviews max
        seeds = [b"challenge", authority.key().as_ref(), domain_name.as_bytes(), &system_program.key().to_bytes()[..8]],
        bump
    )]
    pub challenge: Account<'info, Challenge>,
    
    pub system_program: Program<'info, System>,
    
    #[account(constraint = Clock::get()?.unix_timestamp < deadline)]
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct TakeChallenge<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        seeds = [b"user", authority.key().as_ref()],
        bump,
        constraint = user.authority == authority.key(),
        constraint = user.domains.contains(&challenge.domain)
    )]
    pub user: Account<'info, User>,
    
    #[account(
        mut,
        constraint = !challenge.is_finalized,
        constraint = challenge.challenger.is_none(),
        constraint = Clock::get()?.unix_timestamp < challenge.deadline @ WorkProofError::ChallengeDeadlinePassed
    )]
    pub challenge: Account<'info, Challenge>,
    
    #[account(
        seeds = [b"domain", challenge.domain.as_bytes()],
        bump
    )]
    pub domain: Account<'info, Domain>,
    
    #[account(
        mut,
        constraint = user_token_account.mint == domain.token_mint,
        constraint = user_token_account.owner == authority.key(),
        constraint = user_token_account.amount >= challenge.fee @ WorkProofError::NotEnoughTokens
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = escrow_token_account.mint == domain.token_mint,
        constraint = escrow_token_account.owner == program_authority.key()
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        seeds = [b"program-authority"],
        bump,
    )]
    pub program_authority: Account<'info, ProgramAuthority>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct SubmitChallengeProof<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        constraint = challenge.challenger.unwrap() == authority.key(),
        constraint = !challenge.is_finalized,
        constraint = Clock::get()?.unix_timestamp < challenge.deadline @ WorkProofError::ChallengeDeadlinePassed
    )]
    pub challenge: Account<'info, Challenge>,
    
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct ReviewChallenge<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        seeds = [b"user", authority.key().as_ref()],
        bump,
        constraint = user.authority == authority.key(),
        constraint = user.domains.contains(&challenge.domain)
    )]
    pub user: Account<'info, User>,
    
    #[account(
        mut,
        constraint = !challenge.is_finalized,
        constraint = challenge.proof_url.is_some(),
        constraint = !challenge.reviews.iter().any(|r| r.reviewer == authority.key()) @ WorkProofError::AlreadyReviewed
    )]
    pub challenge: Account<'info, Challenge>,
    
    #[account(
        seeds = [b"domain", challenge.domain.as_bytes()],
        bump
    )]
    pub domain: Account<'info, Domain>,
    
    #[account(
        constraint = user_token_account.mint == domain.token_mint,
        constraint = user_token_account.owner == authority.key(),
        constraint = user_token_account.amount >= MIN_TOKENS_TO_REVIEW @ WorkProofError::NotAuthorizedToReview
    )]
    pub user_token_account: Account<'info, TokenAccount>,
}

#[derive(Accounts)]
pub struct FinalizeChallenge<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        constraint = challenge.creator == authority.key() || challenge.challenger.unwrap() == authority.key(),
        constraint = !challenge.is_finalized,
        constraint = challenge.proof_url.is_some(),
        constraint = challenge.reviews.len() >= MIN_REVIEWS_TO_FINALIZE @ WorkProofError::NotEnoughReviews
    )]
    pub challenge: Account<'info, Challenge>,
    
    #[account(
        seeds = [b"domain", challenge.domain.as_bytes()],
        bump
    )]
    pub domain: Account<'info, Domain>,
    
    #[account(
        mut,
        constraint = challenger_token_account.mint == domain.token_mint,
        constraint = challenger_token_account.owner == challenge.challenger.unwrap()
    )]
    pub challenger_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = escrow_token_account.mint == domain.token_mint,
        constraint = escrow_token_account.owner == program_authority.key()
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = token_mint.key() == domain.token_mint
    )]
    pub token_mint: Account<'info, Mint>,
    
    #[account(
        seeds = [b"program-authority"],
        bump,
    )]
    pub program_authority: Account<'info, ProgramAuthority>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn create_challenge(
    ctx: Context<CreateChallenge>,
    domain_name: String,
    description: String,
    fee: u64,
    deadline: i64,
) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    
    challenge.creator = ctx.accounts.authority.key();
    challenge.domain = domain_name;
    challenge.description = description;
    challenge.fee = fee;
    challenge.deadline = deadline;
    challenge.is_completed = false;
    challenge.is_finalized = false;
    challenge.proof_url = None;
    challenge.reviews = Vec::new();
    challenge.challenger = None;
    challenge.bump = ctx.bumps.challenge;
    
    Ok(())
}

pub fn take_challenge(
    ctx: Context<TakeChallenge>,
    challenge_id: Pubkey,
) -> Result<()> {
    // Transfer tokens from user to escrow
    let cpi_accounts = token::Transfer {
        from: ctx.accounts.user_token_account.to_account_info(),
        to: ctx.accounts.escrow_token_account.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
    );
    
    token::transfer(cpi_ctx, ctx.accounts.challenge.fee)?;
    
    // Set the challenger
    ctx.accounts.challenge.challenger = Some(ctx.accounts.authority.key());
    
    Ok(())
}

pub fn submit_challenge_proof(
    ctx: Context<SubmitChallengeProof>,
    challenge_id: Pubkey,
    proof_url: String,
) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    
    challenge.proof_url = Some(proof_url);
    challenge.is_completed = true;
    
    Ok(())
}

pub fn review_challenge(
    ctx: Context<ReviewChallenge>,
    challenge_id: Pubkey,
    completed: bool,
    review_notes: String,
) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    
    let review = Review {
        reviewer: ctx.accounts.authority.key(),
        completed,
        review_notes,
    };
    
    challenge.reviews.push(review);
    
    Ok(())
}

pub fn finalize_challenge(
    ctx: Context<FinalizeChallenge>,
    challenge_id: Pubkey,
) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    
    // Count positive reviews
    let positive_reviews = challenge.reviews.iter()
        .filter(|review| review.completed)
        .count();
    
    // Mark challenge as finalized
    challenge.is_finalized = true;
    
    // If challenge is successfully completed (majority positive reviews)
    if positive_reviews >= MIN_REVIEWS_TO_FINALIZE {
        // Calculate reward (1.5x the fee)
        let reward = challenge.fee
            .checked_mul(CHALLENGE_REWARD_MULTIPLIER)
            .unwrap()
            .checked_div(CHALLENGE_REWARD_DIVISOR)
            .unwrap();
        
        // Transfer fee back to challenger from escrow
        let program_authority_bump = ctx.accounts.program_authority.bump;
        let seeds = &[b"program-authority".as_ref(), &[program_authority_bump]];
        let signer_seeds = &[&seeds[..]];
        
        let transfer_accounts = token::Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.challenger_token_account.to_account_info(),
            authority: ctx.accounts.program_authority.to_account_info(),
        };
        
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_accounts,
            signer_seeds,
        );
        
        token::transfer(transfer_ctx, challenge.fee)?;
        
        // Mint additional tokens as reward
        let mint_accounts = token::MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.challenger_token_account.to_account_info(),
            authority: ctx.accounts.program_authority.to_account_info(),
        };
        
        let mint_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            mint_accounts,
            signer_seeds,
        );
        
        let additional_reward = reward.checked_sub(challenge.fee).unwrap();
        token::mint_to(mint_ctx, additional_reward)?;
        
        // Reward correct reviewers
        for review in &challenge.reviews {
            if review.completed {
                // Find the reviewer's token account and mint reward tokens
                // Note: In a real implementation, you would need to pass in each reviewer's token account
                // Here, we're simplifying by only rewarding the challenger
            }
        }
    } else {
        // If challenge failed, return tokens to the creator
        // In a real implementation, you would handle this case
    }
    
    Ok(())
}