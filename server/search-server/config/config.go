package config

import (
	"database/sql"
	"log"

	"fmt"
	"search-server/models"

	"github.com/blevesearch/bleve"
	_ "github.com/go-sql-driver/mysql"
)

func InitDB() (*sql.DB, error) {
	// Construct the data source name
	dataSourceName := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		"root",
		"",
		"127.0.0.1",
		"3306",
		"stream_platform",
	)

	// Open a database connection
	db, err := sql.Open("mysql", dataSourceName)
	if err != nil {
		return nil, err
	}

	// Check if the connection is valid by pinging the database
	if err := db.Ping(); err != nil {
		db.Close() // Close the connection
		return nil, err
	}

	return db, nil
}

func InitializeIndex() (bleve.Index, error) {
	// Create or open a Bleve index
	mapping := bleve.NewIndexMapping()
	index, err := bleve.Open("videos_index")
	if err != nil {
		index, err = bleve.New("videos_index", mapping)
		if err != nil {
			return nil, err
		}
	}
	return index, nil
}

func RetrieveDataFromMySQL(db *sql.DB) ([]models.Video, error) {
	rows, err := db.Query("SELECT  VideoTitle, VideoToken, Visibility FROM videos")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var videos []models.Video

	for rows.Next() {
		var video models.Video

		if err := rows.Scan(&video.VideoTitle, &video.VideoToken, &video.VideoVisibility); err != nil {
			return nil, err
		}

		videos = append(videos, video)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return videos, nil
}

func IndexData(index bleve.Index, videos []models.Video) error {
	// Index data from the MySQL database
	for i := 0; i < len(videos); i++ {

		// Create a Bleve document as a map
		bleveDoc := map[string]interface{}{
			"VideoToken":      videos[i].VideoToken,
			"VideoTitle":      videos[i].VideoTitle,
			"VideoVisibility": videos[i].VideoVisibility,
		}
		// Index the document
		if err := index.Index(videos[i].VideoToken, bleveDoc); err != nil {
			return err
		}
	}
	return nil
}

// Function to open or create an index
func openOrCreateIndex(indexName string) (bleve.Index, error) {
	indexMapping := bleve.NewIndexMapping()
	index, err := bleve.Open(indexName)
	if err == bleve.ErrorIndexPathDoesNotExist {
		// Create a new index if it doesn't exist
		index, err = bleve.New(indexName, indexMapping)
	}
	return index, err
}

func GetPublicTokenByPrivateToken(PrivateToken string, db *sql.DB) string {
	rows, err := db.Query("SELECT UserPublicToken FROM users WHERE UserPrivateToken=?;", PrivateToken)
	if err != nil {
		return "error"
	}
	defer rows.Close()

	var userPublicToken string

	for rows.Next() {
		if err := rows.Scan(&userPublicToken); err != nil {
			return "error"
		}
	}

	if err := rows.Err(); err != nil {
		return "error"
	}

	return userPublicToken
}

func VideoOwnerTokenCheck(UserPublicToken string, VideoToken string, db *sql.DB) bool {
	log.Printf(UserPublicToken)
	log.Printf(VideoToken)
	rows, err := db.Query("SELECT OwnerToken FROM videos WHERE VideoToken=?;", VideoToken)
	if err != nil {
		return false
	}
	defer rows.Close()

	var OwnerToken string

	for rows.Next() {
		if err := rows.Scan(&OwnerToken); err != nil {
			return false
		}
	}
	log.Printf(OwnerToken)

	if err := rows.Err(); err != nil {
		return false
	}

	if OwnerToken == UserPublicToken {
		return true
	}

	return false
}
