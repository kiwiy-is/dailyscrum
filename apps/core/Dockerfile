# syntax = docker/dockerfile:1


ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG ASSET_PREFIX
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
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
ENV ASSET_PREFIX=${ASSET_PREFIX}

COPY . .

RUN pnpm install --prod=false

RUN pnpm exec nx build dailyscrum-core

EXPOSE 4001

CMD ["pnpm", "exec", "nx", "start", "dailyscrum-core"]