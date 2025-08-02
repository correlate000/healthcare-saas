# Multi-stage build for production deployment
# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ 

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY api/package*.json ./api/

# Install dependencies
RUN npm ci --only=production
RUN cd api && npm ci --only=production

# Copy source code
COPY . .

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: API Server
FROM node:18-alpine AS api

RUN apk add --no-cache curl

WORKDIR /app

# Copy API dependencies and built files
COPY --from=builder /app/api/node_modules ./api/node_modules
COPY --from=builder /app/api ./api
COPY --from=builder /app/.env.example ./.env.example

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "api/server.js"]

# Stage 3: Next.js Server
FROM node:18-alpine AS frontend

RUN apk add --no-cache curl

WORKDIR /app

# Copy Next.js dependencies and built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]

# Stage 4: Nginx reverse proxy
FROM nginx:alpine AS nginx

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/*.conf /etc/nginx/conf.d/

# Copy SSL certificates (production)
# COPY nginx/ssl/cert.pem /etc/nginx/ssl/cert.pem
# COPY nginx/ssl/key.pem /etc/nginx/ssl/key.pem

# Create cache directory
RUN mkdir -p /var/cache/nginx

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]