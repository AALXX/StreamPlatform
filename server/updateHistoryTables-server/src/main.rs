use mysql::*;
use mysql::prelude::*;
use dotenv::dotenv;
use std::env;
use tokio::task;
use chrono::NaiveDateTime;
use tokio::time::{sleep, Duration};

#[derive(Debug, PartialEq, Eq)]
struct Video {
    id: i64,
    video_id: i64,
    update_date: NaiveDateTime,
    views: i64,
    likes: i64,
    dislikes: i64,
}

#[derive(Debug, PartialEq, Eq)]
struct Users {
    id: i64,
    user_id: i64,
    update_date: NaiveDateTime,
    views: i64,
    followers: i64,
    videos: i64,
}

//* /////////////////////////////
//*      Videos related        //
//* /////////////////////////////
async fn fetch_history_videos(pool: &Pool) -> Vec<Video> {
    // Acquire connection from the pool
    let mut conn = pool.get_conn().unwrap();

    // Execute a query asynchronously
    let query = "SELECT * FROM creator_videos_history;";
    task::spawn_blocking(move || {
        conn.query_map(query, |(id, video_id, update_date, views, likes, dislikes)| {
            let datetime_str: String = update_date; // Adjust the type here based on the actual type returned
            let parsed_datetime = NaiveDateTime::parse_from_str(&datetime_str, "%Y-%m-%d %H:%M:%S").unwrap();

            Video {
                id,
                video_id,
                update_date: parsed_datetime,
                views,
                likes,
                dislikes,
            }
        }).unwrap()
    }).await.unwrap()
}

async fn insert_default_videos(pool: &Pool) {
    // Acquire connection from the pool
    let mut conn = pool.get_conn().unwrap();

    // Perform insertion
    let query = "INSERT INTO creator_videos_history (video_id, views, likes, dislikes) SELECT id, Views, Likes,  Dislikes FROM videos;";
    conn.query_drop(query).unwrap();
}

async fn add_to_video_history(pool: &Pool, videos: &[Video]) {
    // Acquire connection from the pool
    let mut conn = pool.get_conn().unwrap();

    // Process the videos
    for video in videos {
        let query = format!("INSERT INTO creator_videos_history (video_id, views, likes, dislikes) SELECT id, {}, Views, {}, Likes, {}, Dislikes FROM videos WHERE id={};", video.views, video.likes,  video.dislikes, video.video_id);
        conn.query_drop(&query).unwrap();
        println!("{:?}", video);
    }
}


//* /////////////////////////////
//*      Users related         //
//* /////////////////////////////

async fn fetch_history_users(pool: &Pool) -> Vec<Users> {
    // Acquire connection from the pool
    let mut conn = pool.get_conn().unwrap();

    // Execute a query asynchronously
    let query = "SELECT * FROM user_account_history;";
    task::spawn_blocking(move || {
        conn.query_map(query, |(id, user_id, update_date, views, followers, videos)| {
            let datetime_str: String = update_date; // Adjust the type here based on the actual type returned
            let parsed_datetime = NaiveDateTime::parse_from_str(&datetime_str, "%Y-%m-%d %H:%M:%S").unwrap();

            Users {
                id,
                user_id,
                update_date: parsed_datetime,
                views,
                followers,
                videos,
            }
        }).unwrap()
    }).await.unwrap()
}

async fn insert_default_users(pool: &Pool) {
    // Acquire connection from the pool
    let mut conn = pool.get_conn().unwrap();

    // Perform insertion
    // let query = "INSERT INTO user_account_history (user_id, views, folowers, videos) ";
    let query = "INSERT INTO user_account_history (user_id, followers, videos, views)
    SELECT
        users.id AS user_id,
        users.AccountFolowers AS followers,
        COALESCE(
            (
                SELECT COUNT(v.id)
                FROM videos v
                WHERE v.OwnerToken = users.UserPublicToken
            ), 0) AS videos,
        COALESCE(
            (
                SELECT SUM(v.views)
                FROM videos v
                WHERE v.OwnerToken = users.UserPublicToken
            ), 0) AS views
    FROM
        users;";

        conn.query_drop(query).unwrap();
}


//* /////////////////////////////
//*      Main Function         //
//* /////////////////////////////
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

    // Create MySQL connection options
    let opts = Opts::from_url(&db_url).unwrap();
    let pool = Pool::new(opts).unwrap();

    // Fetch videos
    // let users = insert_default_users(&pool).await;   
    
    // let videos = fetch_history_videos(&pool).await;

    // Sleep for 24 hours
    
    // if videos.is_empty() {
    //     // Insert default values if no videos exist
    //     insert_default_videos(&pool).await;
    //     println!("Successfully inserted default videos.");
    // } 
    // Process the existing videos
        
    loop {
        // sleep(Duration::from_secs(24*60*60)).await;
        sleep(Duration::from_secs(10)).await;
        
        // add_to_video_history(&pool, &videos).await;
        insert_default_users(&pool).await
    }
}
