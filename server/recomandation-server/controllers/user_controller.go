package controllers

import (
	"database/sql"
	"log"
	"net/http"
	"recomandation-server/models"
	videoRecomandationHelper "recomandation-server/util"

	"github.com/gin-gonic/gin"
)

func GetRecomandedVideo(c *gin.Context, db *sql.DB) {
	var req models.VideoRecomandationRequest

	// Bind JSON data from the request body into the user variable
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var videosCategories []int

	for i := 0; i < len(req.LastVideos); i++ {

		// Insert the user data into the database
		rows, err := db.Query("SELECT CategoryId from `videos_categoriy_alloc` WHERE VideoToken=?", req.LastVideos[i])
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		for rows.Next() {
			var videoCategory int
			if err := rows.Scan(&videoCategory); err != nil {
				log.Fatal(err)
			}
			videosCategories = append(videosCategories, videoCategory)
		}
	}

	result := videoRecomandationHelper.MostFrequentNumber(videosCategories)

	// Insert the user data into the database
	rows, err := db.Query("SELECT VideoToken FROM videos_categoriy_alloc WHERE CategoryId=? ORDER BY RAND() LIMIT 1", result)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var recomandedVideo string

	for rows.Next() {
		if err := rows.Scan(&recomandedVideo); err != nil {
			log.Fatal(err)
		}
	}

	// Return the user data in the response
	c.JSON(http.StatusCreated, gin.H{"VideoRecomanded": result, "LastVideos": req.LastVideos})
}
