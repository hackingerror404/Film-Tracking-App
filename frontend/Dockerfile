# Stage 1: Build the Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build  # This command generates the static files in the 'dist' directory

# Stage 2: Serve the application with NGINX (Production-ready)
FROM nginx:alpine

# Copy the built files from the previous stage to the NGINX web root
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom NGINX configuration (optional, but often required for React routing)
# If you need this, create a file named 'nginx.conf' in your frontend directory.
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# NGINX runs on port 80 by default
EXPOSE 80

# The default NGINX CMD runs automatically