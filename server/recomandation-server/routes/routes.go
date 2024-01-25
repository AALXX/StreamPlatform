package routes

import (
    "database/sql"
    "recomandation-server/controllers"

    "github.com/gin-gonic/gin"
)

func InitRoutes(router *gin.Engine, db *sql.DB) {
    userGroup := router.Group("/api")
    {
        userGroup.POST("/get-recomandations/get-recomandation", func(c *gin.Context) {
            controllers.GetRecomandedVideo(c, db)
        })
    }
}