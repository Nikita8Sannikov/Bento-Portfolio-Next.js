# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update -y \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*


# ----------------------------------------------------
# Dependencies
# ----------------------------------------------------

FROM base AS dependencies

COPY package.json package-lock.json ./

RUN npm ci


# ----------------------------------------------------
# Build Next.js and generate Prisma Client
# ----------------------------------------------------

FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Prisma config may require DATABASE_URL while loading.
# This URL is only used during build; no connection is made by prisma generate.
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bento?schema=public"

ENV S3_ENDPOINT=http://localhost:9000
ENV S3_REGION=us-east-1
ENV S3_ACCESS_KEY=build
ENV S3_SECRET_KEY=build

RUN npx prisma generate
RUN npm run build

# ----------------------------------------------------
# Prisma migration image
# ----------------------------------------------------

    FROM base AS migrator

    ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
        
    COPY --from=dependencies /app/node_modules ./node_modules
    COPY package.json package-lock.json ./
        
    COPY prisma ./prisma
    COPY prisma.config.ts ./
        
    RUN npx prisma generate
        
    CMD ["npx", "prisma", "migrate", "deploy"]

# ----------------------------------------------------
# Production Next.js server
# ----------------------------------------------------

FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]