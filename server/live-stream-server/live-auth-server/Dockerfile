FROM rust:latest


# Set the working directory in the container for the Rust application
WORKDIR /usr/src/app

# Copy the Rust application code into the container
COPY . .

ENV MYSQL_USERNAME="root"
ENV MYSQL_PASSWORD="root"
ENV MYSQL_HOST="mysql-container"
ENV MYSQL_PORT="3306"
ENV MYSQL_DATABASE="gh_platform_db"

# Build the Rust application
RUN cargo build --release

EXPOSE 7555

# Set the entrypoint to start the application when the container starts
CMD ["./target/release/LiveServer"]