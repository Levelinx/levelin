use anchor_lang::prelude::*;

declare_id!("Ewxy19J2YDAQQv74hkHbz9MiVSzb9xvuK1drHxitrJos");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
