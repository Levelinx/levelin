use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::INITIAL_DOMAIN_TOKENS;
use crate::errors::WorkProofError;
use crate::states::program_authority::ProgramAuthority;
use crate::instructions::user::User;

#[account]
pub struct Domain {
    pub name: String,
    pub description: String,
    pub token_mint: Pubkey,
    pub bump: u8,
}

#[derive(Accounts)]
#[instruction(domain_name: String, domain_description: String)]
pub struct CreateDomain<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        seeds = [b"program-authority"],
        bump,
        constraint = program_authority.authority == authority.key()
    )]
    pub program_authority: Account<'info, ProgramAuthority>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 4 + domain_name.len() + 4 + domain_description.len() + 32 + 1,
        seeds = [b"domain", domain_name.as_bytes()],
        bump
    )]
    pub domain: Account<'info, Domain>,
    
    #[account(
        init,
        payer = authority,
        mint::decimals = 6,
        mint::authority = program_authority,
    )]
    pub token_mint: Account<'info, Mint>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(domain_name: String)]
pub struct AddDomainToUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"user", authority.key().as_ref()],
        bump = user.bump,
        constraint = user.authority == authority.key()
    )]
    pub user: Account<'info, User>,
    
    #[account(
        seeds = [b"domain", domain_name.as_bytes()],
        bump = domain.bump
    )]
    pub domain: Account<'info, Domain>,
    
    #[account(
        mut,
        constraint = token_mint.key() == domain.token_mint
    )]
    pub token_mint: Account<'info, Mint>,
    
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = token_mint,
        associated_token::authority = authority,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        seeds = [b"program-authority"],
        bump,
    )]
    pub program_authority: Account<'info, ProgramAuthority>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_domain(
    ctx: Context<CreateDomain>,
    domain_name: String,
    domain_description: String,
) -> Result<()> {
    let domain = &mut ctx.accounts.domain;
    
    domain.name = domain_name;
    domain.description = domain_description;
    domain.token_mint = ctx.accounts.token_mint.key();
    domain.bump = ctx.bumps.domain;
    
    Ok(())
}

pub fn add_domain_to_user(
    ctx: Context<AddDomainToUser>,
    domain_name: String,
) -> Result<()> {
    let user = &mut ctx.accounts.user;
    
    // Check if user already has this domain
    if !user.domains.contains(&domain_name) {
        user.domains.push(domain_name);
        
        // Mint 100 tokens to the user
        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.program_authority.to_account_info(),
        };
        
        let program_authority_bump = ctx.accounts.program_authority.bump;
        let seeds = &[b"program-authority".as_ref(), &[program_authority_bump]];
        let signer_seeds = &[&seeds[..]];
        
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        
        token::mint_to(cpi_ctx, INITIAL_DOMAIN_TOKENS)?;
    } else {
        return Err(WorkProofError::DomainAlreadyExists.into());
    }
    
    Ok(())
}