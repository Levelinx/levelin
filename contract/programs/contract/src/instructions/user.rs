use anchor_lang::prelude::*;

use crate::errors::WorkProofError;

#[account]
pub struct User {
    pub authority: Pubkey,
    pub name: String,
    pub dob: String,
    pub email: String,
    pub domains: Vec<String>,
    pub bump: u8,
}

#[derive(Accounts)]
#[instruction(name: String, dob: String, email: String, domains: Vec<String>)]
pub struct RegisterUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + name.len() + 4 + dob.len() + 4 + email.len() + 4 + domains.iter().map(|d| 4 + d.len()).sum::<usize>() + 1,
        seeds = [b"user", authority.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUserMetadata<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"user", authority.key().as_ref()],
        bump = user.bump,
        constraint = user.authority == authority.key()
    )]
    pub user: Account<'info, User>,
    
    pub system_program: Program<'info, System>,
}

pub fn register_user(
    ctx: Context<RegisterUser>,
    name: String,
    dob: String,
    email: String,
    domains: Vec<String>,
) -> Result<()> {
    let user = &mut ctx.accounts.user;
    
    user.authority = ctx.accounts.authority.key();
    user.name = name;
    user.dob = dob;
    user.email = email;
    user.domains = domains.clone();
    user.bump = ctx.bumps.user;
    
    // We'll mint tokens for each domain later in add_domain_to_user
    
    Ok(())
}

pub fn update_user_metadata(
    ctx: Context<UpdateUserMetadata>,
    name: Option<String>,
    dob: Option<String>,
    email: Option<String>,
) -> Result<()> {
    let user = &mut ctx.accounts.user;
    
    if let Some(name) = name {
        user.name = name;
    }
    
    if let Some(dob) = dob {
        user.dob = dob;
    }
    
    if let Some(email) = email {
        user.email = email;
    }
    
    Ok(())
}