# ---------- Build Stage ----------
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency files first (better caching)
COPY package.json package-lock.json ./

RUN npm ci

# Copy source code
COPY . .

# Build React app
RUN npm run build

# ---------- Runtime Stage ----------
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
