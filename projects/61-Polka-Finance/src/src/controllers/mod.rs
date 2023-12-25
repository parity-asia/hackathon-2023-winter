pub mod energy;

use rocket::{http::Status, serde::json::Value};
use serde::Serialize;

use crate::error::Error;

fn generic_response<T: Serialize>(result: Result<T, Error>) -> (Status, Value) {
    match result {
        Ok(data) => json_response!(data),
        Err(e) => json_response!(e.to_status().code, e.to_string()),
    }
}
