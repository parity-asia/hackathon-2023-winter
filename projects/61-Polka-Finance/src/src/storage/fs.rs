use crate::blockchain::westmint::WestmintApi;
use crate::error::Error;
use crate::models::energy::{EnergyNFT, EnergyNFTDTO, EnergyNFTMetadata};
use crate::models::westmint::PalletUniquesItemMetadata;
use subxt::sp_core::storage::StorageKey;

use serde_json;
use std::fs;
use std::io::Write;
use std::path::Path;
use std::sync::Once;
use std::thread;
use std::time;

static START: Once = Once::new();

// const STORAGE_FOLDER_BASE: &str = "data";
const STORAGE_FOLDER_FETCHED: &str = "data/fetched";
const STORAGE_FOLDER_SOLD: &str = "data/sold";

// const STORAGE_FOLDER_RPOCESSED: &str = "data/processed";

#[derive(Clone)]
pub struct FilesStorageBackend {}

impl FilesStorageBackend {
    pub fn new() -> FilesStorageBackend {
        START.call_once(|| {
            thread::spawn(move || {
                FilesStorageBackend::start_data_loading();
            });
        });

        FilesStorageBackend {}
    }

    #[tokio::main]
    pub async fn start_data_loading() {
        let interval = time::Duration::from_secs(10); // each 10 secs for now
        loop {
            match FilesStorageBackend::load_nft_data().await {
                Ok(_) => {}
                Err(e) => {
                    println!("Error ocurred during data loading: {:?}\n Retrying ...", e)
                }
            }
            thread::sleep(interval);
        }
    }

    pub async fn load_nft_data() -> Result<(), Error> {
        let collection_id: u32 = 482;
        let data = WestmintApi::get_nft_metadata_all(collection_id)
            .await
            .unwrap();
        let storage_data_pairs: Vec<EnergyNFT> = data
            .into_iter()
            .map(|item| EnergyNFT {
                storage_key: item.0,
                metadata: item.1.data,
            })
            .collect();

        // Create if not exists
        fs::create_dir_all(STORAGE_FOLDER_FETCHED)?;

        for item in storage_data_pairs {
            let processed_data_file = format!("{}/{}", STORAGE_FOLDER_FETCHED, item.storage_key);
            let sold_data_file = format!("{}/{}", STORAGE_FOLDER_SOLD, item.storage_key);
            // Do not create data file for item if it was already processed
            if Path::new(&processed_data_file).exists() || Path::new(&sold_data_file).exists() {
                continue;
            }

            let data_file = format!("{}/{}", STORAGE_FOLDER_FETCHED, item.storage_key);
            let mut file = fs::OpenOptions::new()
                .create(true)
                .write(true)
                .open(data_file)
                .unwrap();

            writeln!(file, "{}", item.metadata)?;
        }

        Ok(())
    }

    pub async fn get_nfts_for_sale(&self) -> Result<Vec<EnergyNFTDTO>, Error> {
        let mut data: Vec<EnergyNFT> = Vec::new();
        for entry in
            fs::read_dir(Path::new(STORAGE_FOLDER_FETCHED)).expect("Unable to open directory")
        {
            let file = entry?.path();
            let storage_key = file.file_name().unwrap().to_str().unwrap().to_string();
            let metadata = fs::read_to_string(file).expect("Unable to read file with metadata");

            data.push(EnergyNFT {
                storage_key,
                metadata,
            });
        }

        let data_dto: Vec<EnergyNFTDTO> = data
            .into_iter()
            .map(|item| EnergyNFTDTO {
                storage_key: item.storage_key,
                metadata: serde_json::from_str(&item.metadata).unwrap_or_default(),
            })
            .collect();

        // // Move processed files from fetched folder to processed
        // fs::create_dir_all(STORAGE_FOLDER_RPOCESSED)?;
        // for entry in fs::read_dir(STORAGE_FOLDER_FETCHED)? {
        //     let entry = entry?;
        //     fs::rename(
        //         entry.path(),
        //         format!(
        //             "{}/{}",
        //             STORAGE_FOLDER_RPOCESSED,
        //             entry.file_name().to_str().unwrap()
        //         ),
        //     )?;
        // }

        Ok(data_dto)
    }

    pub async fn sell_nft(&self, storage_key_str: String) -> Result<(), Error> {
        println!("Item {} sold. Applying actions...", storage_key_str);
        let asset_hash = WestmintApi::get_uniques_assets_prefix_key().unwrap();
        let instance_metadata_hash =
            WestmintApi::get_uniques_instance_metadata_prefix_key().unwrap();
        let nft_item_id_hash =
            WestmintApi::extract_nft_item_id_from_hash(&storage_key_str).unwrap();
        let nft_collection_id_hash =
            WestmintApi::extract_nft_collection_id_from_hash(&storage_key_str).unwrap();

        let nft_asset_key = format!(
            "{}{}{}",
            asset_hash, nft_collection_id_hash, nft_item_id_hash
        );
        let nft_metadata_key = format!(
            "{}{}{}",
            instance_metadata_hash, nft_collection_id_hash, nft_item_id_hash
        );

        if !storage_key_str.starts_with(&nft_metadata_key) {
            return Err(Error::FormatError("Storage key is not valid".to_string()));
        }

        let storage_key_asset = StorageKey(hex::decode(&nft_asset_key).unwrap());
        let storage_key_metadata = StorageKey(hex::decode(&nft_metadata_key).unwrap());

        let asset_exists = WestmintApi::check_uniques_item_exists(&storage_key_asset)
            .await
            .unwrap();
        let metadata_exists = WestmintApi::check_uniques_item_exists(&storage_key_metadata)
            .await
            .unwrap();

        if !asset_exists || !metadata_exists {
            return Err(Error::InternalError);
        }

        // Verify metadata exists in blockchain
        match WestmintApi::get_uniques_item_by_storage_key::<PalletUniquesItemMetadata>(
            &storage_key_metadata,
        )
        .await
        {
            Ok(_) => {}
            Err(_) => return Err(Error::InternalError),
        };

        // Destory NFT item and it is metadata

        WestmintApi::destroy_nft_item(storage_key_asset, storage_key_metadata)
            .await
            .unwrap();
        
        // Move file from `fetched` to `sold` storage
        
        // Create if not exists
        fs::create_dir_all(STORAGE_FOLDER_SOLD)?;
        let metadata_fetched_file =
            format!("{}/{}", STORAGE_FOLDER_FETCHED, nft_metadata_key.as_str());
        let metadata_sold_file = format!("{}/{}", STORAGE_FOLDER_SOLD, nft_metadata_key.as_str());
        let storage_update_result = fs::rename(&metadata_fetched_file, &metadata_sold_file);
        if storage_update_result.is_err() {
            println!(
                "Failed to move file with metadata ({}) to storage of sold items in internal storage!",
                nft_metadata_key
            );
        }
        
        // Transfer tokens to owner address

        let metadata =
            fs::read_to_string(&metadata_sold_file).expect("Unable to read file with metadata");
        let metadata_obj: EnergyNFTMetadata = serde_json::from_str(&metadata).unwrap_or_default();
        let transfer_result =
            WestmintApi::transfer_tokens(&metadata_obj.owner_addr, metadata_obj.price_pvse).await;
        if transfer_result.is_err() {
            return Err(Error::InternalError);
        }

        Ok(())
    }
}
