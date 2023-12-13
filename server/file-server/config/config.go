package config

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

func InitDB() (*sql.DB, error) {
    // Construct the data source name
    dataSourceName := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
        "root",
        "root",
        "127.0.0.1",
        "3306",
        "gh_platform_db",
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