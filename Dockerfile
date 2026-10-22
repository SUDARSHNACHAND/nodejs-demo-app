# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (utilizing Docker layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Serve stage with lightweight high-performance Nginx
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Health check to ensure service vitality
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
