#[macro_use]
extern crate rocket;
#[macro_use]
pub(crate) mod macros;

/// All server related
pub mod server;

/// All the Routes/endpoints
mod controllers;

/// Database
mod storage;

/// Models
pub mod models;

/// Blockchain API connection
pub mod blockchain;

/// App related Errors
pub mod error;
pub type Result<T> = std::result::Result<T, error::Error>;
