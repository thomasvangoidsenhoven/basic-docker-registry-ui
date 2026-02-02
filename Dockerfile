# Stage 1: Build the static SPA
FROM node:22-alpine AS build

WORKDIR /app

# Build argument for the default registry URL
ARG PUBLIC_DEFAULT_REGISTRY_URL=http://localhost:5050
ENV PUBLIC_DEFAULT_REGISTRY_URL=$PUBLIC_DEFAULT_REGISTRY_URL

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy static files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8082

CMD ["nginx", "-g", "daemon off;"]
