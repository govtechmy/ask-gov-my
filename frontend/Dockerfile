# Use the official Node.js 20 Alpine image as the base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies in a separate stage to leverage Docker layer caching
FROM base AS dependencies

# Install PNPM package manager globally
RUN npm install -g pnpm

# Copy only package.json and pnpm-lock.yaml to install dependencies
COPY package.json pnpm-lock.yaml ./

# Install dependencies without modifying lockfile
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN pnpm run build

# Use a lightweight production stage with only the essentials
FROM node:20-alpine AS runner

# Install PNPM package manager globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/.next ./.next
COPY --from=dependencies /app/public ./public
COPY --from=dependencies /app/package.json ./package.json

# Expose the port that the app will run on
EXPOSE 3000

# Set environment variable to production
ENV NODE_ENV=production

# Start the Next.js application
CMD ["pnpm", "start"]