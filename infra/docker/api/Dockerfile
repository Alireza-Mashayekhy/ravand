# syntax=docker/dockerfile:1
# ════════════════════════════════════════════════════════════════════
#  API (NestJS) — بیلد چندمرحله‌ای با pnpm deploy
#
#  چرا pnpm deploy؟ چون `pnpm install --prod` اندازهٔ node_modules را
#  کم نمی‌کند (فایل‌ها داخل .pnpm می‌مانند). deploy فقط وابستگی‌های
#  production را در یک پوشهٔ مستقل می‌سازد: حدود ۱۳۰MB به‌جای ۷۴۵MB.
#
#  نکته: `--ignore-scripts` لازم است، چون اسکریپت `prepare` ریشهٔ
#  workspace (husky) بعد از حذف devDependencyها اجرا نمی‌شود.
# ════════════════════════════════════════════════════════════════════

FROM node:22-alpine AS base

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    HUSKY=0 \
    CI=1

# نصب pnpm با نسخهٔ ثابت (corepack در نسخه‌های جدید Node حذف شده است)
RUN npm install --global pnpm@10.29.3

WORKDIR /app


# ──────────────────────────── نصب و بیلد ────────────────────────────
FROM base AS build

# .dockerignore جلوی رفتن node_modules/.next/.git/.env را به context می‌گیرد
COPY . .

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ساخت @ravand/contracts و سپس API (ترتیب وابستگی‌ها با «...» رعایت می‌شود)
RUN pnpm --filter @ravand/api... build

# فقط وابستگی‌های production در یک پوشهٔ مستقل و قابل حمل
RUN pnpm --filter @ravand/api deploy --legacy --prod --ignore-scripts /deploy


# ────────────────────────────── اجرا ──────────────────────────────
# مرحلهٔ اجرا تصویر پایهٔ بدون pnpm است تا ایمیج کوچک‌تر بماند
FROM node:22-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build --chown=node:node /deploy ./apps/api

USER node

WORKDIR /app/apps/api

EXPOSE 3001

# با RUN_MIGRATIONS=true مایگریشن‌ها هنگام بالا آمدن اجرا می‌شوند
CMD ["node", "dist/main.js"]
