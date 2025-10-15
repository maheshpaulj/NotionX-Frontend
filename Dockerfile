# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Declare ALL build-time secrets here
ARG LIVEBLOCKS_SECRET_KEY
ARG EDGE_STORE_ACCESS_KEY
ARG EDGE_STORE_SECRET_KEY

# Make them available as environment variables for the build process
ENV LIVEBLOCKS_SECRET_KEY=sk_prod_3ctefqLRo76yOCu5gmy3f-K75nPsIPzPCAgC7rLprvCUfdMyOAiwh9bt6cA9RNdW
ENV EDGE_STORE_ACCESS_KEY=SUdXsjcMZk0L63d8n9ycSi3fT0UxI670
ENV EDGE_STORE_SECRET_KEY=$RglpbduvsoHlP9HuY19IzLZO4kA4NEud9A7u7Il8D0p3jU3x

COPY package*.json ./
RUN npm install
COPY . .
# Pass build-time public env vars here if needed
RUN npm run build

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