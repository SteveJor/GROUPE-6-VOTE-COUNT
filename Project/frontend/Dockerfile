# Stage 1: Build Angular app
FROM node:lts-slim AS build

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies with clean install
RUN npm ci

# Copy all source files
COPY . ./

# Build Angular app for development
RUN npm run build -- --configuration=development --output-path=dist

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine AS final

# Expose port
EXPOSE 4200

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app to nginx
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Optional: Handle server-side rendering index file if it exists
RUN if [ -f /usr/share/nginx/html/index.csr.html ]; then \
    cp /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; \
    fi

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4200/ || exit 1
