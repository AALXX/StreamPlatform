package main

import (
	"database/sql"
	"file-server/config"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func safeFileServer(dir string, db *sql.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

        // userPublicToken := r.URL.Query().Get("ut")

        // privateToken := GetUserPrivateTokenFromPublicToken(userPublicToken, db)

		// Ensure the requested path is safe.
		// requestedPath := filepath.Join(dir, filepath.Clean(privateToken + r.URL.Query().Get("vt") + r.URL.Query().Get("f")))
		requestedPath := filepath.Join(dir, filepath.Clean(r.URL.Path))

		if !strings.HasPrefix(requestedPath, dir) {
			http.Error(w, "Access Denied", http.StatusForbidden)
			return
		}

		// Check if the requested file exists.
		fileInfo, err := os.Stat(requestedPath)
		if os.IsNotExist(err) {
			http.ServeFile(w, r, "./AccountIcon.svg")

			return
		}

		// Ensure the requested path is a file (not a directory).
		if fileInfo.IsDir() {
			http.Error(w, "Not a File", http.StatusForbidden)
			return
		}

		// Serve the file using the built-in FileServer.
		http.ServeFile(w, r, requestedPath)
	})
}

func restrictIP(next http.Handler, allowedIP string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		remoteAddr := r.RemoteAddr
		log.Printf("remote address %s\n", remoteAddr)

		if remoteAddr != allowedIP {
			http.Error(w, "Access Denied", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func GetUserPrivateTokenFromPublicToken(userToken string, db *sql.DB) (string) {
	// Insert the user data into the database
	rows, err := db.Query("SELECT UserPrivateToken FROM users WHERE UserPublicToken=?;", userToken)
	if err != nil {
		log.Printf(err.Error())
        return ""
	}

	var userPrivateToken string

	for rows.Next() {
		if err := rows.Scan(&userPrivateToken); err != nil {
			log.Fatal(err)
		}
	}
    return userPrivateToken
}

func main() {

	// Initialize the database connection
	db, err := config.InitDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Define the directory from which to serve files.
	dir := "../accounts" // Change this to your desired directory.

	// Create a file server handler.
	fileServer := safeFileServer(dir, db)

	// Create a router and register the file server.
	// mux := http.NewServeMux()
	// mux.Handle("/", restrictIP(fileServer, "192.168.72.81")) // Replace with your allowed IP address.
	http.Handle("/", fileServer)

	// Define the server address and port.
	addr := "localhost:5500"

	log.Printf("Server started on %s\n", addr)
	// Start the HTTP server.
	if err := http.ListenAndServe(addr, nil); err != nil {
		panic(err)
	}

}
