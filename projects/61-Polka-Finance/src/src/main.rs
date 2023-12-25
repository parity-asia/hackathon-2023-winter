use energy_trading_api::server::init_server;
use rocket::error::Error;
use std::process::exit;

#[rocket::main]
async fn main() -> Result<(), Error> {
    // start the server
    match init_server().await {
        Ok(server) => server.launch().await.map(|_| ()),
        Err(e) => {
            println!("{}", e);
            exit(1)
        }
    }
}
