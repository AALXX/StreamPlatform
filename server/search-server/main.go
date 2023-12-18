package main

import (
	"search-server/config"
	"search-server/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
    "github.com/joho/godotenv"

	"log"
)

func main() {
	// Load the environment variables from the .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file: %v", err)
    }

	// Initialize the database connection
	db, err := config.InitDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create a Gin router
	router := gin.Default()

	// Initialize the Bleve index
	index, err := config.InitializeIndex()
	if err != nil {
		log.Fatal(err)
	}

	// Retrieve data from MySQL (replace this with your database query)
	videos, err := config.RetrieveDataFromMySQL(db)
	if err != nil {
		log.Fatal(err)
	}

	// Index the retrieved data into the Bleve index
	err = config.IndexData(index, videos)
	if err != nil {
		log.Fatal(err)
	}

	// Enable CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"} // You can specify specific origins or use "*" to allow all
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	router.Use(cors.New(config))

	// Initialize routes
	routes.InitRoutes(router, db, index)

	// Start the server
	router.Run("localhost:7300")
}
