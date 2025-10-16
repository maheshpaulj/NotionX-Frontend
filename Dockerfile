# /notionx-frontend/Dockerfile
# Enable modern Dockerfile syntax for secrets
# syntax=docker/dockerfile:1

# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Securely mount the .env file for the build command ONLY
RUN --mount=type=secret,id=dotenv,target=.env npm run build

# Stage 2: Runner (Final Image)
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001
CMD ["npm", "start"]