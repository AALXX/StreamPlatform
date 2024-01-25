FROM tiangolo/nginx-rtmp

COPY nginx.conf /etc/nginx/nginx.conf

# Copy the entrypoint script into the container
COPY entrypoint.sh /entrypoint.sh

# Set execute permissions on the entrypoint script
RUN chmod +x /entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]
