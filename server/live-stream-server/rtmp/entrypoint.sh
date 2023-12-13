#!/bin/bash


# Start the desired service (nginx, etc.)
# exec "$@"
nginx -g "daemon off;"

# chmod -R 755 /tmp/hls