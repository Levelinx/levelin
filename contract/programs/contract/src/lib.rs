use anchor_lang::prelude::*;

declare_id!("Db48pxhkNZzJgt8ddMkhY6xbsmoPpTzPDqHuPtDSQBGr");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn store_value(ctx: Context<StoreValue>, data: u64, text: String) -> Result<()> {
        let value_account = &mut ctx.accounts.value_account;
        value_account.value = data;

        // Copy the string data into the fixed-size array
        let str_bytes = text.as_bytes();
        let max_len = value_account.text.len();
        let copy_len = std::cmp::min(str_bytes.len(), max_len);

        value_account.text[..copy_len].copy_from_slice(&str_bytes[..copy_len]);
        value_account.text_len = copy_len as u32;

        msg!("Stored value: {}", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

// Account structure for the store_value instruction
#[derive(Accounts)]
pub struct StoreValue<'info> {
    #[account(init, payer = user, space = 8 + 8 + 4 + 100)]
    pub value_account: Account<'info, ValueData>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// Define the structure of our data account
#[account]
pub struct ValueData {
    pub value: u64,
    pub text_len: u32,           // Length of the actual text stored
    pub text: [u8; 100],
}