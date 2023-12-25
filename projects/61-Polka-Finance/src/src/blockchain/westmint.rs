use crate::models::westmint::{PalletUniquesItemDetails, PalletUniquesItemMetadata};
use codec::Decode;
use std::str::FromStr;
use subxt::sp_core::{sr25519, storage::StorageKey, Pair};
use subxt::storage::{StorageEntryKey, StorageKeyPrefix, StorageMapKey};
use subxt::{ClientBuilder, DefaultConfig, PairSigner, PolkadotExtrinsicParams};

const API_URL_WESTMINT_WSS: &str = "wss://westmint-rpc.polkadot.io:443";
const API_URL_WESTEND_WSS: &str = "wss://westend-rpc.polkadot.io:443";

#[subxt::subxt(runtime_metadata_path = "artifacts/westmint_metadata.scale")]
pub mod polkadot {}

#[derive(Clone)]
pub struct WestmintApi();

impl WestmintApi {
    pub async fn get_nft_details_all(
        collection_id: u32,
    ) -> Result<Vec<PalletUniquesItemDetails>, Box<dyn std::error::Error>> {
        let mut client = ClientBuilder::new();
        client = client.set_url(API_URL_WESTMINT_WSS);
        let api = client.build()
            .await
            .unwrap()
            .to_runtime_api::<polkadot::RuntimeApi<DefaultConfig, PolkadotExtrinsicParams<DefaultConfig>>>();

        // Obtain the prefixed `twox_128("uniques") ++ twox_128("Asset")`
        let prefix = StorageKeyPrefix::new::<polkadot::uniques::storage::Asset>();
        let entry_key = StorageEntryKey::Map(vec![StorageMapKey::new(
            &collection_id,
            ::subxt::StorageHasher::Blake2_128Concat,
        )]);

        // The final query key is:
        let query_key = entry_key.final_key(prefix);
        println!("Query key: 0x{}", hex::encode(&query_key));

        // TODO : Here we need to use start_key + count to allow loading of some particular items
        // For now we just loading 100 entries
        let keys = api
            .client
            .rpc()
            .storage_keys_paged(Some(query_key), 100, None, None)
            .await?;

        let mut data: Vec<PalletUniquesItemDetails> = Vec::new();
        for key in keys.iter() {
            println!("Key: 0x{}", hex::encode(&key));

            if let Some(storage_data) = api.client.storage().fetch_raw(key.clone(), None).await? {
                let item: PalletUniquesItemDetails = Decode::decode(&mut &storage_data.0[..])?;
                println!("value: {:?}", item);
                data.push(item);
            }
        }

        Ok(data)
    }

    pub async fn get_nft_details_by_id(
        collection_id: u32,
        item_id: u32,
    ) -> Result<PalletUniquesItemDetails, Box<dyn std::error::Error>> {
        let mut client = ClientBuilder::new();
        client = client.set_url(API_URL_WESTMINT_WSS);
        let api = client.build()
            .await
            .unwrap()
            .to_runtime_api::<polkadot::RuntimeApi<DefaultConfig, PolkadotExtrinsicParams<DefaultConfig>>>();

        // Obtain the prefixed `twox_128("uniques") ++ twox_128("Asset")`
        let prefix = StorageKeyPrefix::new::<polkadot::uniques::storage::Asset>();
        let entry_key = StorageEntryKey::Map(vec![
            StorageMapKey::new(&collection_id, ::subxt::StorageHasher::Blake2_128Concat),
            StorageMapKey::new(&item_id, ::subxt::StorageHasher::Blake2_128Concat),
        ]);

        // The final query key is:
        let query_key = entry_key.final_key(prefix);
        println!("Query key: 0x{}", hex::encode(&query_key));

        let storage_data = api.client.rpc().storage(&query_key, None).await?.unwrap();
        let data: PalletUniquesItemDetails = Decode::decode(&mut &storage_data.0[..])?;
        println!("Value data {:?}", data);

        Ok(data)
    }

    pub async fn get_nft_metadata_all(
        collection_id: u32,
    ) -> Result<Vec<(String, PalletUniquesItemMetadata)>, Box<dyn std::error::Error>> {
        let mut client = ClientBuilder::new();
        client = client.set_url(API_URL_WESTMINT_WSS);
        let api = client.build()
            .await
            .unwrap()
            .to_runtime_api::<polkadot::RuntimeApi<DefaultConfig, PolkadotExtrinsicParams<DefaultConfig>>>();

        // Obtain the prefixed `twox_128("uniques") ++ twox_128("InstanceMetadataOf")`
        let prefix = StorageKeyPrefix::new::<polkadot::uniques::storage::InstanceMetadataOf>();
        let entry_key = StorageEntryKey::Map(vec![StorageMapKey::new(
            &collection_id,
            ::subxt::StorageHasher::Blake2_128Concat,
        )]);

        // The final query key is:
        let query_key = entry_key.final_key(prefix);
        println!("Query key: 0x{}", hex::encode(&query_key));

        // TODO : Here we need to use start_key + count to allow loading of some particular items
        // For now we just loading 100 entries
        let keys = api
            .client
            .rpc()
            .storage_keys_paged(Some(query_key), 100, None, None)
            .await?;

        let mut data: Vec<(String, PalletUniquesItemMetadata)> = Vec::new();
        for key in keys.iter() {
            // println!("Key: 0x{}", hex::encode(&key));

            if let Some(storage_data) = api.client.storage().fetch_raw(key.clone(), None).await? {
                let item: PalletUniquesItemMetadata = Decode::decode(&mut &storage_data.0[..])?;
                // println!("value: {:?}", item);
                data.push((hex::encode(&key), item));
            }
        }

        Ok(data)
    }

    pub async fn get_nft_metadata_by_id(
        collection_id: u32,
        item_id: u32,
    ) -> Result<(String, PalletUniquesItemMetadata), Box<dyn std::error::Error>> {
        let mut client = ClientBuilder::new();
        client = client.set_url(API_URL_WESTMINT_WSS);
        let api = client.build()
            .await
            .unwrap()
            .to_runtime_api::<polkadot::RuntimeApi<DefaultConfig, PolkadotExtrinsicParams<DefaultConfig>>>();

        // Obtain the prefixed `twox_128("uniques") ++ twox_128("InstanceMetadataOf")`
        let prefix = StorageKeyPrefix::new::<polkadot::uniques::storage::InstanceMetadataOf>();
        let entry_key = StorageEntryKey::Map(vec![
            StorageMapKey::new(&collection_id, ::subxt::StorageHasher::Blake2_128Concat),
            StorageMapKey::new(&item_id, ::subxt::StorageHasher::Blake2_128Concat),
        ]);

        // The final query key is:
        let query_key = entry_key.final_key(prefix);
        // println!("Query key: 0x{}", hex::encode(&query_key));

        let storage_data = api.client.rpc().storage(&query_key, None).await?.unwrap();
        let data: PalletUniquesItemMetadata = Decode::decode(&mut &storage_data.0[..])?;
        // println!("Value data {:?}", data);

        Ok((hex::encode(&query_key), data))
    }

    pub async fn get_uniques_item_by_storage_key<T: Decode>(
        storage_key: &StorageKey,
    ) -> Result<T, Box<dyn std::error::Error>> {
        let mut client = ClientBuilder::new();
        client = client.set_url(API_URL_WESTMINT_WSS);
        let api = client.build()
            .await
            .unwrap()
            .to_runtime_api::<polkadot::RuntimeApi<DefaultConfig, PolkadotExtrinsicParams<DefaultConfig>>>();

        let storage_data = api.client.rpc().storage(storage_key, None).await?.unwrap();
        let data: T = Decode::decode(&mut &storage_data.0[..])?;

        Ok(data)
    }

    pub async fn check_uniques_item_exists(
        storage_key: &StorageKey,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        let mut client = ClientBuilder::new();
        client = client.set_url(API_URL_WESTMINT_WSS);
        let api = client.build()
            .await
            .unwrap()
            .to_runtime_api::<polkadot::RuntimeApi<DefaultConfig, PolkadotExtrinsicParams<DefaultConfig>>>();

        let storage_data = api.client.rpc().storage(storage_key, None).await.unwrap();
        match storage_data {
            Some(_) => Ok(true),
            None => Ok(false),
        }
    }

    pub async fn destroy_nft_item(
        _storage_key_asset: StorageKey,
        _storage_key_metadata: StorageKey,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // TODO : implement it
        Ok(())
    }

    pub async fn transfer_tokens(
        receiver_addr: &str,
        amount: u32,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut client = ClientBuilder::new();
        client = client.set_url(API_URL_WESTEND_WSS);
        let api = client.build()
            .await
            .unwrap()
            .to_runtime_api::<polkadot::RuntimeApi<DefaultConfig, PolkadotExtrinsicParams<DefaultConfig>>>();

        let signer_pair = sr25519::Pair::from_string_with_seed(
            "tray toast boost hospital blur butter vast glide upset crunch dial video",
            None,
        )
        .unwrap();
        let signer = PairSigner::new(signer_pair.0);
        let dest = subxt::sp_core::crypto::AccountId32::from_str(receiver_addr)
            .unwrap()
            .into();

        // TODO : we need to transfer PVSE, not WND, but for now there is some problems with Westmint networks and
        // tranasctions cannot be signed. I suppouse it will work on other networks and respective parachains (Statemine, Statemint, ...)

        // 10^12 - 1 WND
        // For testing I am using 10^6
        let amount_internal = 10_u128.pow(10) * amount as u128;
        println!("internal amount : {amount_internal}");
        let extrinsic = api.tx().balances().transfer(dest, amount_internal)?;
        // Sign and submit the extrinsic, returning its hash.
        let tx_hash = extrinsic.sign_and_submit_default(&signer).await?;
        println!("Transfered {} WND to {receiver_addr} address, transaction hash : {tx_hash}", ((amount as f32) * 0.01));

        Ok(())
    }

    pub fn extract_nft_item_id_from_hash(storage_key: &String) -> Result<String, String> {
        let id_length = 40;
        let valid_storage_key_length = 144;

        if storage_key.len() != valid_storage_key_length {
            return Err("Input storage key is not valid!".to_string());
        }

        let item_id = &storage_key[storage_key.len() - id_length..];

        Ok(item_id.to_string())
    }

    pub fn extract_nft_collection_id_from_hash(storage_key: &String) -> Result<String, String> {
        let id_length = 40;
        let valid_storage_key_length = 144;

        if storage_key.len() != valid_storage_key_length {
            return Err("Input storage key is not valid!".to_string());
        }

        let collection_id =
            &storage_key[storage_key.len() - 2 * id_length..storage_key.len() - id_length];

        Ok(collection_id.to_string())
    }

    pub fn get_uniques_assets_prefix_key() -> Result<String, String> {
        let prefix = StorageKeyPrefix::new::<polkadot::uniques::storage::Asset>();
        let string_hash = hex::encode(&prefix.to_storage_key());
        Ok(string_hash)
    }

    pub fn get_uniques_instance_metadata_prefix_key() -> Result<String, String> {
        let prefix = StorageKeyPrefix::new::<polkadot::uniques::storage::InstanceMetadataOf>();
        let hash = hex::encode(&prefix.to_storage_key());
        Ok(hash)
    }
}
