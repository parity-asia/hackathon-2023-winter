use rocket::http;
use serde::{de, Deserialize, Deserializer, Serialize, Serializer};
use std::fmt;

#[derive(Debug, Copy, Clone, Eq, PartialEq, Hash)]
pub enum Method {
    Any,
    Http(http::Method),
}

impl fmt::Display for Method {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Any => write!(f, "*"),
            Self::Http(method) => write!(f, "{}", method.as_str()),
        }
    }
}

impl Serialize for Method {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        String::serialize(&self.to_string(), serializer)
    }
}

impl<'de> Deserialize<'de> for Method {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        match String::deserialize(deserializer)?.as_str() {
            "*" => Ok(Self::Any),
            "get" | "GET" => Ok(Self::Http(http::Method::Get)),
            "put" | "PUT" => Ok(Self::Http(http::Method::Put)),
            "post" | "POST" => Ok(Self::Http(http::Method::Post)),
            "delete" | "DELETE" => Ok(Self::Http(http::Method::Delete)),
            "options" | "OPTIONS" => Ok(Self::Http(http::Method::Options)),
            "head" | "HEAD" => Ok(Self::Http(http::Method::Head)),
            "trace" | "TRACE" => Ok(Self::Http(http::Method::Trace)),
            "connect" | "CONNECT" => Ok(Self::Http(http::Method::Connect)),
            "patch" | "PATCH" => Ok(Self::Http(http::Method::Patch)),
            s => Err(de::Error::custom(format!("unknown '{}' method", s))),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Endpoint {
    pub name: String,
    pub method: Method,
}
