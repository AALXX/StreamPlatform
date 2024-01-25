# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=20.0.0

FROM node:${NODE_VERSION}


# Copy package.json and package-lock.json to the working directory

WORKDIR /app

# Download dependencies as a separate step to take advantage of Docker's caching.
COPY package*.json ./

# Install app dependencies
RUN npm install typescript -g && npm install

# Copy the rest of the source files into the image.
COPY . .

RUN mkdir -p /accounts
RUN mkdir -p /accounts/IconTmp
RUN mkdir -p /accounts/VideosTmp
RUN mkdir -p /accounts/Lives

RUN npm run build
ENV MYSQL_HOST=mysql-container
ENV MYSQL_DATABASE=gh_platform_db
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=root
ENV ACCOUNTS_FOLDER_PATH=../accounts
ENV SEARCH_SERVER=http://search-server:7300/api
ENV VIDEO_CATEGORIZE_SERVER=http://categorize-server:6200/api


EXPOSE 7000

# Run the startup script when the container starts
CMD [ "npm", "start" ]  # Replace with your entry point command

