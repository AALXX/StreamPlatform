package main

import (
    "github.com/gin-gonic/gin"
    "recomandation-server/config"
    "recomandation-server/routes"
	
	"log"
)

func main() {
    // Initialize the database connection
    db, err := config.InitDB()
   	if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Create a Gin router
    router := gin.Default()

    // Initialize routes
    routes.InitRoutes(router, db)

    // Start the server
    router.Run(":7200")
}