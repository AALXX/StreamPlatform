# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=20.0.0

FROM node:${NODE_VERSION}-alpine


# Copy package.json and package-lock.json to the working directory

WORKDIR /usr/src/server

# Download dependencies as a separate step to take advantage of Docker's caching.
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

RUN npm run build
ENV MYSQL_HOST=mysql-container
ENV MYSQL_DATABASE=gh_platform_db
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=root

# Copy the startup script into the container
COPY startup.sh .

# Set execute permissions on the startup script

# Expose the port that the application listens on.
EXPOSE 7000

RUN chmod +x startup.sh

# Run the startup script when the container starts
CMD ["/usr/local/binstartup.sh"]