use anchor_lang::prelude::*;

#[error_code]
pub enum WorkProofError {
    #[msg("User already has this domain")]
    DomainAlreadyExists,
    
    #[msg("Challenge deadline has passed")]
    ChallengeDeadlinePassed,
    
    #[msg("Challenge is already finalized")]
    ChallengeFinalized,
    
    #[msg("Not enough tokens")]
    NotEnoughTokens,
    
    #[msg("Not authorized to review")]
    NotAuthorizedToReview,
    
    #[msg("Already reviewed")]
    AlreadyReviewed,
    
    #[msg("Challenge is not completed")]
    ChallengeNotCompleted,
    
    #[msg("Not enough reviews")]
    NotEnoughReviews,
}