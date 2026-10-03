FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app


FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages packages

RUN pnpm install --frozen-lockfile --prod=false

RUN pnpm --filter api exec node -e "console.log('CLI:', require.resolve('@nestjs/cli/package.json'))"

RUN pnpm --filter api exec node -e "console.log('Nest CLI:', require('@nestjs/cli/package.json').version)"

FROM dependencies AS build

COPY apps/api apps/api

RUN pnpm --filter api build


FROM base AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json

WORKDIR /app/apps/api

CMD ["node", "dist/main.js"]