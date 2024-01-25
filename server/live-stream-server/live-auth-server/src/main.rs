use std::net::SocketAddr;
use warp::{http::Response, Filter};
use serde::{Deserialize, Serialize};
use mysql::*;
use mysql::prelude::*;
use dotenv::dotenv;
use std::env;


#[derive(Debug, Deserialize, Serialize)]
struct LiveStreamAuthRequest {
    name: String,
    key: String,
}

struct UserTable {
    StreamKey: String,
}

// Handler for /live_stream_auth
async fn live_stream_auth(req: LiveStreamAuthRequest, pool:Pool) -> Result<impl warp::Reply, warp::Rejection> {
    let mut connection = pool.get_conn().unwrap(); // Replace with your connection logic

    let get_user_data_query_string = format!("SELECT StreamKey FROM users WHERE UserPublicToken=\"{}\";", req.name);

    let result = connection
        .query_map(&get_user_data_query_string, |(stream_key,)| UserTable { StreamKey: stream_key });

    match result {
        Ok(rows) => {
            if let Some(stream_key) = rows.get(0).map(|row| row.StreamKey.clone()) {
                if stream_key == req.key {
                    return Ok(Response::builder()
                        .status(warp::http::StatusCode::OK)
                        .body("OK: Correct keyey found")
                        .unwrap())
                }else{
                    return Ok(Response::builder()
                        .status(warp::http::StatusCode::OK)
                        .body("OK: Incorect key")
                        .unwrap())
                }
            } else {
                Ok(Response::builder()
                    .status(warp::http::StatusCode::FORBIDDEN)
                    .body("Forbidden: No data found")
                    .unwrap())
            }
        }
        Err(_) => {
            Ok(Response::builder()
                .status(warp::http::StatusCode::INTERNAL_SERVER_ERROR)
                .body("Error occurred")
                .unwrap())
        }
    }

}

#[tokio::main]
async fn main() {

    dotenv().ok(); // Load environment variables from .env file

    // Fetch MySQL credentials from environment variables
    let db_url = format!(
        "mysql://{}:{}@{}:{}/{}",
        env::var("MYSQL_USERNAME").unwrap(),
        env::var("MYSQL_PASSWORD").unwrap(),
        env::var("MYSQL_HOST").unwrap(),
        env::var("MYSQL_PORT").unwrap(),
        env::var("MYSQL_DATABASE").unwrap()
    );

    // Define the address and port
    let address: SocketAddr = "0.0.0.0:7555".parse().expect("Invalid address");


    // Create MySQL connection options
    let opts = Opts::from_url(&db_url).unwrap();
    let pool = Pool::new(opts).unwrap();

    // Clone the pool to move into the closure
    let pool_clone = pool.clone();

    // Define a route for "/live_stream_auth"
    let live_stream_auth_route = warp::path("stream-auth")
        .and(warp::post())
        .and(warp::body::json())
        .and(warp::any().map(move || pool_clone.clone())) // Capture pool reference
        .and_then(live_stream_auth);

    // Combine routes using the `or` combinator
    let routes = live_stream_auth_route;

    // Serve the routes on the specified address and port
    warp::serve(routes).run(address).await;
}