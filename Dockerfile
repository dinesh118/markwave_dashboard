# ---------- Build Stage ----------
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (legacy peer deps)
RUN npm install --legacy-peer-deps

# Copy all source
COPY . .

# Disable CRA CI strict lint errors
ENV CI=false

# Build React app
RUN npm run build

# ---------- Runtime Stage ----------
FROM nginx:alpine

# Remove default nginx static
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
