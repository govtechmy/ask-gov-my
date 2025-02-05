# Use the official Node.js 20 Alpine image as the base image
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@9.11.0 --activate
WORKDIR /app

# Install turbo
FROM base AS turbo
RUN pnpm install turbo@2.1.2 --global
COPY . .
RUN turbo prune frontend --docker

# Install dependencies in a separate stage to leverage Docker layer caching
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# First install the dependencies (as they change less often)
COPY --from=turbo /app/out/json/ .
COPY --from=turbo /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# First install only production deps and cache them, then install all deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build arguments for the NextJS app
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY

# Build the project
COPY --from=turbo /app/out/full/ .
# These arguments enable remote cacheing inside docker build
# And they need to be here because the token always changes which stops all further lines from being cached
# ARG TURBO_TOKEN
# ARG TURBO_TEAMID
# ARG TURBO_API

# Build the project
RUN pnpm run build --filter=frontend...

FROM base AS runner

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public

WORKDIR /app/apps/frontend

CMD ["node", "server.js"]