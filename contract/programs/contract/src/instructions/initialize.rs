use anchor_lang::prelude::*;

use crate::states::program_authority::ProgramAuthority;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32,
        seeds = [b"program-authority"],
        bump
    )]
    pub program_authority: Account<'info, ProgramAuthority>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let program_authority = &mut ctx.accounts.program_authority;
    program_authority.authority = ctx.accounts.authority.key();
    program_authority.bump = ctx.bumps.program_authority;
    Ok(())
}