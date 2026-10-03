# syntax=docker/dockerfile:1
# ════════════════════════════════════════════════════════════════════
#  Web (Next.js) — خروجی standalone
#
#  Next فقط فایل‌هایی که واقعاً استفاده می‌شوند را trace می‌کند، پس
#  ایمیج نهایی (~۴۰MB محتوا) به node_modules کامل نیازی ندارد.
# ════════════════════════════════════════════════════════════════════

FROM node:22-alpine AS base

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    HUSKY=0 \
    CI=1 \
    NEXT_TELEMETRY_DISABLED=1

RUN npm install --global pnpm@10.29.3

WORKDIR /app


# ──────────────────────────── نصب و بیلد ────────────────────────────
FROM base AS build

COPY . .

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# آدرس API برای rewrite پروکسی؛ در زمان build داخل خروجی Next نوشته می‌شود،
# پس باید دقیقاً با مقدار runtime یکی باشد.
ARG API_URL=http://localhost:4444
ENV API_URL=$API_URL

RUN pnpm --filter @ravand/web... build


# ────────────────────────────── اجرا ──────────────────────────────
FROM node:22-alpine AS runtime

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# خروجی standalone ساختار مسیر ریپو را حفظ می‌کند: apps/web/server.js
COPY --from=build --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=node:node /app/apps/web/public ./apps/web/public

USER node

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
