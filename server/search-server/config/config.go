package config

import (
	"database/sql"

	"fmt"
	"search-server/models"
	"strconv"

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
	// Replace this with your SQL query to retrieve data from the MySQL database
	rows, err := db.Query("SELECT OwnerToken, VideoTitle, VideoToken FROM videos")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var videos []models.Video

	for rows.Next() {
		var video models.Video

		if err := rows.Scan(&video.OwnerToken, &video.VideoTitle, &video.VideoToken); err != nil {
			return nil, err
		}

		rows2, err := db.Query("SELECT UserName FROM users WHERE UserPublicToken = ?", video.OwnerToken)
		if err != nil {
			return nil, err
		}
		defer rows2.Close()

		for rows2.Next() {

			if err := rows2.Scan(&video.OwnerName); err != nil {
				return nil, err
			}
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
			"VideoToken": videos[i].VideoToken,
			"VideoTitle": videos[i].VideoTitle,
			"OwnerToken": videos[i].OwnerToken,
			"OwnerName":  videos[i].OwnerName,
		}
		// Index the document
		if err := index.Index(videos[i].VideoToken, bleveDoc); err != nil {
			return err
		}
	}
	return nil
}

// Function to get the last video ID from the index
func GetLastVideoID(index bleve.Index) (int, error) {
	// Define a query to retrieve all documents sorted by ID in descending order
	query := bleve.NewMatchAllQuery()
	searchRequest := bleve.NewSearchRequest(query)

	// Sort the results by the "ID" field in descending order
	searchRequest.SortBy([]string{"ID"})

	// Perform the search
	searchResults, err := index.Search(searchRequest)
	if err != nil {
		return 0, err
	}

	// Check if there are any search results
	if len(searchResults.Hits) == 0 {
		return 0, fmt.Errorf("no documents found in the index")
	}

	// Convert the last document's ID (string) to an integer
	lastDocumentID := searchResults.Hits[0].ID
	lastVideoID, err := strconv.Atoi(lastDocumentID)
	if err != nil {
		return 0, err
	}

	return lastVideoID, nil
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
