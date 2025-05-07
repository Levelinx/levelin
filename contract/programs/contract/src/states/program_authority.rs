use anchor_lang::prelude::*;

#[account]
pub struct ProgramAuthority {
    pub authority: Pubkey,
    pub bump: u8,
}