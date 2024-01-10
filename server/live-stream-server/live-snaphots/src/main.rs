use std::net::SocketAddr;
use warp::{ http::{ Response, StatusCode }, Rejection, Filter };
use serde::{ Deserialize, Serialize };
use mysql::*;
use mysql::prelude::*;
use dotenv::dotenv;
use std::env;
use log::{ error, info };
use std::thread;
use std::sync::{ Arc, Mutex };
use serde_json::json;
use serde_json::Value;
use tokio::time::{ sleep, Duration };

#[derive(Debug, Deserialize, Clone, Serialize)]
struct LiveStartShnapshotRequest {
    StreamToken: String,
}

#[derive(Debug, Serialize)]
struct SuccessResponse {
    message: String,
}

#[derive(Debug, Serialize)]
struct LiveDataResponse {
    error: bool,
    views: i64,
}

#[derive(Debug, Serialize)]
struct ErrorResponse {
    error: bool,
}

#[derive(Debug, Serialize)]
struct StreamDataCheck {
    active: i64,
}

fn setup_logger() {
    // Enable logging based on environment variable
    if env::var("RUST_LOG").is_err() {
        env::set_var("RUST_LOG", "info");
    }
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
}

async fn fetch_and_update(_req: LiveStartShnapshotRequest, _pool: Pool) -> Result<bool, Rejection> {
    // Use tokio runtime to run the async block within the thread
    let mut connection = _pool.get_conn().unwrap(); // Replace with your connection logic

    let get_stream_data_query_string = format!(
        "SELECT Active FROM streams WHERE StreamToken = '{}';",
        _req.StreamToken
    );

    let result = connection.query_map(get_stream_data_query_string, |active: i64| StreamDataCheck {
        active,
    });

    let pool_clone = _pool.clone();

    match result {
        Ok(data) => {
            if let Some(record) = data.first() {
                // Respond with the active status if data is available
                if record.active == 0 {
                    return Ok(false);
                }
                // Spawn a new thread to update the database
                // Use tokio runtime to run the async block within the thread
                // Make a GET request
                let response = reqwest::get(
                    format!(
                        "http://localhost:7070/api/live-manager/get-stream-viwers/{}",
                        _req.StreamToken
                    )
                ).await;

                match response {
                    Ok(resp) => {
                        if resp.status().is_success() {
                            let body_json: Value = resp.json().await.unwrap();

                            // Extracting and working with the "error, views" field
                            if
                                let (Some(error), Some(views)) = (
                                    body_json.get("error").and_then(Value::as_bool),
                                    body_json.get("views").and_then(Value::as_i64),
                                )
                            {
                                if error == false {
                                    let mut connection = pool_clone.get_conn().unwrap();
                                    let update_query = format!(
                                        "INSERT INTO Live_Snapshots (live_id, streamToken, views)
                                                    SELECT id AS live_id, '{}', {}
                                                    FROM streams
                                                    WHERE StreamToken = '{}';",
                                        _req.StreamToken,
                                        views,
                                        _req.StreamToken
                                    );

                                    let result = connection.query_drop(update_query);

                                    if let Err(err) = result {
                                        error!("Failed to update database: {:?}", err);
                                        // Handle database update errors here
                                        return Ok(false);
                                    } else {
                                        info!("Database updated successfully");
                                        return Ok(true);
                                    }

                                    // Return the recursive call properly
                                }
                            }
                        } else {
                            error!("Request failed with status code: {}", resp.status());
                        }
                    }
                    Err(err) => {
                        info!("Error: {:?}", err);
                    }
                }
            } else {
                error!("Live not found");
            }
        }
        Err(_) => {
            error!("Database error");
        }
    }

    return Ok(true);
}

async fn start_snapshot(
    _req: LiveStartShnapshotRequest,
    _pool: Pool
) -> Result<impl warp::Reply, Rejection> {
    thread::spawn(move || {
        // Code that runs in the new thread
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            loop {
                tokio::time::sleep(Duration::from_secs(10)).await;

                // Spawn the asynchronous operation and capture the JoinHandle
                let handle = tokio::spawn(fetch_and_update(_req.clone(), _pool.clone()));

                // Await the completion of the spawned asynchronous operation
                let result = handle.await;

                // Handle the result
                match result {
                    Ok(fetch_result) =>
                        match fetch_result {
                            Ok(true) => {
                                // Update was successful
                                info!("stilLive");
                                // Do something here
                            }
                            Ok(false) => {
                                info!("finished live");
                                break;
                                // Update failed
                                // Handle failure case here
                            }
                            Err(_) => {
                                error!("ERROR");

                                // Handle fetch_and_update error case here
                            }
                        }
                    Err(e) => {
                        // Handle error if the spawned task panics
                        error!("Task panicked: {:?}", e);
                        // Handle error case here
                    }
                }
            }
        });
    });

    // Handle database query errors
    let error_response = ErrorResponse {
        error: false,
    };
    Ok(warp::reply::json(&error_response))
}

#[tokio::main]
async fn main() {
    setup_logger();

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
    let address: SocketAddr = "127.0.0.1:7556".parse().expect("Invalid address");

    // Create MySQL connection options
    let opts = Opts::from_url(&db_url).unwrap();
    let pool = Pool::new(opts).unwrap();

    // Clone the pool to move into the closure
    let pool_clone = pool.clone();

    // Define a route for "/start_snapshot"
    let start_snapshot_route = warp
        ::path("start-snapshot")
        .and(warp::post()) // Handle POST requests
        .and(warp::body::json()) // Parse JSON body
        .and(warp::any().map(move || pool_clone.clone())) // Capture pool reference
        .and_then(start_snapshot);

    // Combine routes using the `or` combinator
    let routes = start_snapshot_route;

    // Serve the routes on the specified address and port
    warp::serve(routes).run(address).await;
}
