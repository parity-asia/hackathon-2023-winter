use clap::Parser;
use rocket::{data::Limits, Build, Config, Rocket};
use std::path::Path;

use crate::{controllers, error::Error, storage::fs::FilesStorageBackend, Result};

/// Server & App Configurations
pub mod config;
use self::config::Settings;

#[derive(Parser, Debug)]
#[clap(author, version, about)]
struct CliOpts {
    /// loads the server configurations
    #[clap(short = 'c', long)]
    config: String,
}

/// Parse the settings from the command line arguments
fn parse_settings_from_cli() -> Result<Settings> {
    // parse the cli options
    let cli_opts = CliOpts::parse();
    let cfg_file = &cli_opts.config;

    if cfg_file.is_empty() {
        // No config file, so start
        // with default settings
        Ok(Settings::default())
    } else {
        // Config file passed in cli, check
        // to see if config file exists
        if Path::new(cfg_file).exists() {
            // load settings from the config file or return error
            // if error in loading the given config file
            Settings::from_file(&cfg_file)
        } else {
            // config file does not exist, quit app
            Err(Error::ConfigFileNotFound)
        }
    }
}

/// Initialise the Rocket Server app
pub async fn init_server() -> Result<Rocket<Build>> {
    let settings = parse_settings_from_cli()?;

    let server_settings = settings.server;

    let limits = Limits::new()
        .limit("forms", server_settings.forms_limit.into())
        .limit("json", server_settings.json_limit.into());

    let rocket_cfg = Config::figment()
        .merge(("address", server_settings.host.to_string()))
        .merge(("port", server_settings.port as u16))
        .merge(("limits", limits))
        .merge(("secret_key", (server_settings.secret_key.as_str())))
        .merge(("keep_alive", server_settings.keep_alive as u32));

    let backend = FilesStorageBackend::new();

    // Configure the Rocket server with configured settings
    let app = rocket::custom(rocket_cfg);

    // Catchers
    let app = app.register("/", rocket::catchers![]);

    // Add the NFT routes
    let app = app.mount(
        "/nft",
        routes![
            controllers::energy::nfts_for_sale,
            controllers::energy::nft_sell,
        ],
    );

    let app = app
        // Add Filestorage connection to the state
        .manage(backend);

    // Return the configured Rocket App
    Ok(app)
}
