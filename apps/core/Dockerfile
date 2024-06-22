# syntax = docker/dockerfile:1

ARG NODE_VERSION=21.6.1

# Adjust NODE_VERSION as desired
FROM node:${NODE_VERSION}-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

LABEL fly_launch_runtime="Next.js"

# Next.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

COPY . .

RUN pnpm install --prod=false

RUN --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_URL \
  --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --mount=type=secret,id=SUPABASE_SERVICE_ROLE_KEY \
  --mount=type=secret,id=ASSET_PREFIX \
  NEXT_PUBLIC_SUPABASE_URL="$(cat /run/secrets/NEXT_PUBLIC_SUPABASE_URL)" \
  NEXT_PUBLIC_SUPABASE_ANON_KEY="$(cat /run/secrets/NEXT_PUBLIC_SUPABASE_ANON_KEY)" \
  NEXT_PUBLIC_METADATA_BASE_URL="$(cat /run/secrets/NEXT_PUBLIC_METADATA_BASE_URL)" \
  SUPABASE_SERVICE_ROLE_KEY="$(cat /run/secrets/SUPABASE_SERVICE_ROLE_KEY)" \
  ASSET_PREFIX="$(cat /run/secrets/ASSET_PREFIX)" \
  pnpm exec nx build dailyscrum-core

EXPOSE 4001

CMD ["pnpm", "exec", "nx", "start", "dailyscrum-core"]