# builder
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# # runtime
# FROM node:20-alpine
# WORKDIR /app
# ENV NODE_ENV=production
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/.env .env
# EXPOSE 3000
# CMD ["node", "dist/main.js"]

# Stage 1: Install dependencies
FROM node:20-alpine AS base
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Stage 2: Build for production
FROM base AS build
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine AS prod
WORKDIR /app

# Copy only necessary files from build stage
COPY package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

# Run production
CMD ["node", "dist/main.js"]
