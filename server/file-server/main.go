package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func safeFileServer(dir string) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Ensure the requested path is safe.
        requestedPath := filepath.Join(dir, filepath.Clean(r.URL.Path))
        if !strings.HasPrefix(requestedPath, dir) {
            http.Error(w, "Access Denied", http.StatusForbidden)
            return
        }

        // Check if the requested file exists.
        fileInfo, err := os.Stat(requestedPath)
        if os.IsNotExist(err) {
            http.Error(w, "File Not Found", http.StatusNotFound)
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

func main() {
    // Define the directory from which to serve files.
    dir := "../accounts" // Change this to your desired directory.

    // Create a file server handler.
    fileServer := safeFileServer(dir)

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