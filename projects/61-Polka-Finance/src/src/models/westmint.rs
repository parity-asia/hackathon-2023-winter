use codec::{Decode, Encode};
use subxt::sp_core::crypto::AccountId32;

#[derive(Clone, Eq, PartialEq, Debug, Encode, Decode)]
pub struct PalletUniquesItemDetails {
    pub owner: AccountId32,
    pub approved: Option<AccountId32>,
    pub is_frozen: bool,
    pub deposit: u128,
}

#[derive(Clone, Eq, PartialEq, Debug, Encode, Decode)]
pub struct PalletUniquesItemMetadata {
    pub deposit: u128,
    pub data: String,
    pub is_frozen: bool,
}
