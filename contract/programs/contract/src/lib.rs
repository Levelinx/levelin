use anchor_lang::prelude::*;

declare_id!("Db48pxhkNZzJgt8ddMkhY6xbsmoPpTzPDqHuPtDSQBGr");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Check if the program has already been initialized by trying to find the PDA
        let (expected_authority_pda, _) = Pubkey::find_program_address(
            &[b"authority"],
            ctx.program_id
        );
        
        // Only allow initialization if the account matches our expected PDA
        require!(
            ctx.accounts.program_authority.key() == expected_authority_pda,
            ErrorCode::InvalidProgramAuthority
        );
        
        let program_authority = &mut ctx.accounts.program_authority;
        program_authority.authority = ctx.accounts.authority.key();
        
        msg!("Program initialized with authority: {:?}", program_authority.authority);
        Ok(())
    }

    pub fn register_user(
        ctx: Context<RegisterUser>,
        name: String,
        date_of_birth: i64,
        email: String,
    ) -> Result<()> {
        let user = &mut ctx.accounts.user;
        user.authority = ctx.accounts.authority.key();
        user.name = name;
        user.date_of_birth = date_of_birth;
        user.email = email;
        user.domains = Vec::new();
        
        msg!("User registered: {}", user.name);
        Ok(())
    }

    pub fn update_user(
        ctx: Context<UpdateUser>,
        name: String,
        date_of_birth: i64,
        email: String,
    ) -> Result<()> {
        let user = &mut ctx.accounts.user;
        
        // Only the user's authority can update their profile
        require!(
            user.authority == ctx.accounts.authority.key(),
            ErrorCode::NotAuthorized
        );
        
        user.name = name;
        user.date_of_birth = date_of_birth;
        user.email = email;
        
        msg!("User updated: {}", user.name);
        Ok(())
    }

    pub fn create_domain(
        ctx: Context<CreateDomain>,
        domain_name: String,
        description: String,
    ) -> Result<()> {
        let domain = &mut ctx.accounts.domain;
        let program_authority = &ctx.accounts.program_authority;
        
        // Only the program authority can create domains
        require!(
            program_authority.authority == ctx.accounts.authority.key(),
            ErrorCode::NotAuthorized
        );
        
        domain.name = domain_name;
        domain.description = description;
        domain.authority = ctx.accounts.authority.key();
        
        msg!("Domain created: {}", domain.name);
        Ok(())
    }

    pub fn add_domain_to_user(
        ctx: Context<AddDomainToUser>,
        domain_name: String,
    ) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let domain = &ctx.accounts.domain;
        
        // Check if the user already has this domain
        if user.domains.iter().any(|d| d.name == domain_name) {
            return err!(ErrorCode::DomainAlreadyAdded);
        }
        
        // Add the domain to the user's profile
        user.domains.push(UserDomain {
            name: domain_name,
            token_balance: 100, // Mint 100 tokens of that domain to the user
        });
        
        msg!("Domain added to user: {}", domain.name);
        Ok(())
    }

    pub fn create_challenge(
        ctx: Context<CreateChallenge>,
        domain_name: String,
        description: String,
        token_fee: u64,
        deadline: i64,
    ) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;
        let domain = &ctx.accounts.domain;
        
        // Only the program authority can create challenges
        let program_authority = &ctx.accounts.program_authority;
        require!(
            program_authority.authority == ctx.accounts.authority.key(),
            ErrorCode::NotAuthorized
        );
        
        // Verify the domain exists
        require!(domain.name == domain_name, ErrorCode::DomainMismatch);
        
        challenge.domain = domain_name;
        challenge.description = description;
        challenge.token_fee = token_fee;
        challenge.deadline = deadline;
        challenge.creator = ctx.accounts.authority.key();
        challenge.challenger = None;
        challenge.submission_url = None;
        challenge.reviews = Vec::new();
        challenge.is_completed = false;
        challenge.is_finalized = false;
        
        msg!("Challenge created in domain: {}", challenge.domain);
        Ok(())
    }

    pub fn take_challenge(
        ctx: Context<TakeChallenge>,
    ) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;
        let user = &mut ctx.accounts.user;
        
        // Check if the challenge is already taken
        require!(challenge.challenger.is_none(), ErrorCode::ChallengeAlreadyTaken);
        
        // Check if the deadline has passed
        let clock = Clock::get()?;
        require!(
            challenge.deadline > clock.unix_timestamp,
            ErrorCode::DeadlinePassed
        );
        
        // Verify the user is registered in the domain
        let domain_index = user.domains
            .iter()
            .position(|d| d.name == challenge.domain)
            .ok_or(ErrorCode::UserNotInDomain)?;
        
        // Check if the user has enough tokens
        require!(
            user.domains[domain_index].token_balance >= challenge.token_fee,
            ErrorCode::InsufficientTokens
        );
        
        // Deduct the token fee from the user
        user.domains[domain_index].token_balance -= challenge.token_fee;
        
        // Register the user as the challenger
        challenge.challenger = Some(user.authority);
        
        msg!("Challenge taken by user: {}", user.name);
        Ok(())
    }

    pub fn submit_challenge(
        ctx: Context<SubmitChallenge>,
        submission_url: String,
    ) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;
        let user = &ctx.accounts.user;
        
        // Verify that the user is the challenger
        require!(
            challenge.challenger == Some(user.authority),
            ErrorCode::NotChallengeOwner
        );
        
        // Check if the deadline has passed
        let clock = Clock::get()?;
        require!(
            challenge.deadline > clock.unix_timestamp,
            ErrorCode::DeadlinePassed
        );
        
        // Set the submission URL
        challenge.submission_url = Some(submission_url);
        
        msg!("Challenge submission received");
        Ok(())
    }

    pub fn review_challenge(
        ctx: Context<ReviewChallenge>,
        passed: bool,
        notes: String,
    ) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;
        let user = &mut ctx.accounts.user;
        
        // Verify that the challenge has a submission
        require!(
            challenge.submission_url.is_some(),
            ErrorCode::NoSubmission
        );
        
        // Verify that the challenge is not finalized
        require!(!challenge.is_finalized, ErrorCode::ChallengeFinalized);
        
        // Verify the user is registered in the domain
        let domain_index = user.domains
            .iter()
            .position(|d| d.name == challenge.domain)
            .ok_or(ErrorCode::UserNotInDomain)?;
        
        // Verify the user has enough tokens to review (600+)
        require!(
            user.domains[domain_index].token_balance >= 600,
            ErrorCode::InsufficientTokensForReview
        );
        
        // Check if the user has already reviewed this challenge
        require!(
            !challenge.reviews.iter().any(|r| r.reviewer == user.authority),
            ErrorCode::AlreadyReviewed
        );
        
        // Add the review
        challenge.reviews.push(Review {
            reviewer: user.authority,
            passed,
            notes,
        });
        
        // Check if we have at least 5 reviews
        if challenge.reviews.len() >= 5 {
            // Count passing reviews
            let passing_reviews = challenge.reviews
                .iter()
                .filter(|r| r.passed)
                .count();
            
            // Mark as completed if at least 3 passing reviews
            if passing_reviews >= 3 {
                challenge.is_completed = true;
            }
            
            // Get the majority vote
            let majority_passed = passing_reviews > challenge.reviews.len() / 2;
            
            // Reward reviewers who voted with the majority
            for review in challenge.reviews.iter() {
                if review.passed == majority_passed {
                    // For now, we only reward the current reviewer if they voted with the majority
                    // In a complete implementation, we would need to fetch all reviewer accounts
                    if review.reviewer == user.authority {
                        // Add 10 tokens to the reviewer
                        user.domains[domain_index].token_balance += 10;
                    }
                }
            }
        }
        
        msg!("Challenge reviewed, passed: {}", passed);
        Ok(())
    }

    pub fn finalize_challenge(
        ctx: Context<FinalizeChallenge>,
    ) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;
        let user = &mut ctx.accounts.user;
        
        // Verify the user is the challenger
        require!(
            challenge.challenger == Some(user.authority),
            ErrorCode::NotChallengeOwner
        );
        
        // Verify that the challenge is not already finalized
        require!(!challenge.is_finalized, ErrorCode::ChallengeFinalized);
        
        // Verify that we have at least 5 reviews
        require!(
            challenge.reviews.len() >= 5,
            ErrorCode::InsufficientReviews
        );
        
        // Find the challenger's domain index
        let domain_index = user.domains
            .iter()
            .position(|d| d.name == challenge.domain)
            .ok_or(ErrorCode::UserNotInDomain)?;
        
        // If the challenge is completed (3+ positive reviews), reward the challenger
        if challenge.is_completed {
            // Return the fee + 50% bonus
            let reward = challenge.token_fee + (challenge.token_fee / 2);
            user.domains[domain_index].token_balance += reward;
        }
        
        // Mark the challenge as finalized
        challenge.is_finalized = true;
        
        msg!("Challenge finalized, completed: {}", challenge.is_completed);
        Ok(())
    }
}

// Account contexts for each instruction
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32)]
    pub program_authority: Account<'info, ProgramAuthority>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterUser<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 50 + 8 + 100 + 4 + 300  // Base + pubkey + name + date + email + vector + domains
    )]
    pub user: Account<'info, User>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUser<'info> {
    #[account(mut)]
    pub user: Account<'info, User>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateDomain<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 50 + 200 + 32  // Base + name + description + authority
    )]
    pub domain: Account<'info, Domain>,
    
    pub program_authority: Account<'info, ProgramAuthority>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddDomainToUser<'info> {
    #[account(mut)]
    pub user: Account<'info, User>,
    
    pub domain: Account<'info, Domain>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateChallenge<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 50 + 500 + 8 + 8 + 32 + 32 + 200 + 4 + 1000 + 1 + 1  // Base + domain + desc + fee + deadline + creator + challenger + url + vector + reviews + bools
    )]
    pub challenge: Account<'info, Challenge>,
    
    pub domain: Account<'info, Domain>,
    
    pub program_authority: Account<'info, ProgramAuthority>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TakeChallenge<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,
    
    #[account(mut)]
    pub user: Account<'info, User>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SubmitChallenge<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,
    
    pub user: Account<'info, User>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ReviewChallenge<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,
    
    #[account(mut)]
    pub user: Account<'info, User>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct FinalizeChallenge<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,
    
    #[account(mut)]
    pub user: Account<'info, User>,
    
    pub authority: Signer<'info>,
}

// Account structures
#[account]
pub struct ProgramAuthority {
    pub authority: Pubkey,
}

#[account]
pub struct User {
    pub authority: Pubkey,
    pub name: String,
    pub date_of_birth: i64,
    pub email: String,
    pub domains: Vec<UserDomain>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UserDomain {
    pub name: String,
    pub token_balance: u64,
}

#[account]
pub struct Domain {
    pub name: String,
    pub description: String,
    pub authority: Pubkey,
}

#[account]
pub struct Challenge {
    pub domain: String,
    pub description: String,
    pub token_fee: u64,
    pub deadline: i64,
    pub creator: Pubkey,
    pub challenger: Option<Pubkey>,
    pub submission_url: Option<String>,
    pub reviews: Vec<Review>,
    pub is_completed: bool,
    pub is_finalized: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Review {
    pub reviewer: Pubkey,
    pub passed: bool,
    pub notes: String,
}

// Error codes
#[error_code]
pub enum ErrorCode {
    #[msg("Not authorized to perform this action")]
    NotAuthorized,
    
    #[msg("Domain already added to user")]
    DomainAlreadyAdded,
    
    #[msg("Domain name mismatch")]
    DomainMismatch,
    
    #[msg("Challenge already taken")]
    ChallengeAlreadyTaken,
    
    #[msg("Deadline has passed")]
    DeadlinePassed,
    
    #[msg("User is not registered in this domain")]
    UserNotInDomain,
    
    #[msg("Insufficient tokens")]
    InsufficientTokens,
    
    #[msg("Not the challenge owner")]
    NotChallengeOwner,
    
    #[msg("No submission found")]
    NoSubmission,
    
    #[msg("Insufficient tokens for review (need 600+)")]
    InsufficientTokensForReview,
    
    #[msg("Already reviewed this challenge")]
    AlreadyReviewed,
    
    #[msg("Challenge already finalized")]
    ChallengeFinalized,
    
    #[msg("Insufficient reviews (need 5+)")]
    InsufficientReviews,

    #[msg("Invalid program authority")]
    InvalidProgramAuthority,
}