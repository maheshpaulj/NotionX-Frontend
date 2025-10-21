# Dockerfile in notionx-frontend repository (FINAL SECURE VERSION)

# ---- Dependencies Stage ----
# Use Yarn as your project is set up for it
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

# ---- Builder Stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The build command will use placeholder values for NEXT_PUBLIC_ variables.
# These will be replaced by the real values at runtime in the browser.
RUN yarn build

# ---- Runner Stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed for a production server
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
# If using Next.js standalone output, this is the correct way
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Install ONLY production dependencies
RUN yarn install --production

EXPOSE 3001
# The standalone output provides a server.js file
CMD ["node", "server.js"]