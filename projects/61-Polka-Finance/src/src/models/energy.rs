use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, Debug, Default)]
pub struct EnergyNFTMetadata {
    #[serde(rename(serialize = "power_mw", deserialize = "p"))]
    pub power_mw: f32,
    #[serde(rename(serialize = "owner_addr", deserialize = "o"))]
    pub owner_addr: String,
    #[serde(rename(serialize = "price_pvse", deserialize = "t"))]
    pub price_pvse: u32,
    #[serde(rename(serialize = "creation_start_date", deserialize = "s"))]
    pub creation_start_date: String,
    #[serde(rename(serialize = "creation_end_date", deserialize = "e"))]
    pub creation_end_date: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EnergyNFT {
    pub(crate) storage_key: String,
    pub(crate) metadata: String,
}

#[derive(Clone, Serialize, Deserialize, Debug, Default)]
pub struct EnergyNFTDTO {
    pub(crate) storage_key: String,
    pub(crate) metadata: EnergyNFTMetadata,
}

#[derive(Clone, Serialize, Deserialize, Debug, Default)]
pub struct EnergyNFTSellDTO {
    pub(crate) storage_key: String,
}
