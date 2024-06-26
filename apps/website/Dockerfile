# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=21.6.1
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

RUN --mount=type=secret,id=NEXT_PUBLIC_METADATA_BASE_URL \
  --mount=type=secret,id=PROXY_URL \
  NEXT_PUBLIC_METADATA_BASE_URL="$(cat /run/secrets/NEXT_PUBLIC_METADATA_BASE_URL)" \
  PROXY_URL="$(cat /run/secrets/PROXY_URL)" \
  pnpm exec nx build dailyscrum-website

EXPOSE 3000

CMD ["pnpm", "exec", "nx", "start", "dailyscrum-website"]