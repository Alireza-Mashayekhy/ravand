# نقشهٔ راه

این‌ها آگاهانه از قالب پایه بیرون گذاشته شده‌اند تا سبک و بی‌سرباز بماند.
هر مورد با ترتیب پیشنهادی آمده است.

## ۱) تضمین کیفیت

- [ ] **تست:** Vitest برای وب (کامپوننت/هوک) و Jest + Supertest برای API (unit + e2e).
  - شروع پیشنهادی: تست `UsersService` با `DataSource` تستی، و یک e2e برای `/api/v1/users`.
- [ ] **CI (GitHub Actions):** `pnpm install --frozen-lockfile` → `pnpm check` روی PR.
      (توجه: cache توربو و pnpm store را اضافه کن.)
- [ ] **commitlint + conventional commits** و اختیاری Changesets برای نسخه‌گذاری.

## ۲) احراز هویت و دسترسی

- [ ] مدل `User` فعلی → افزودن `passwordHash`، `roles`، `refreshTokens`.
- [ ] JWT با access token کوتاه‌عمر + refresh token چرخشی (`@nestjs/jwt`, `passport-jwt`).
- [ ] دکوراتورهای `@Public()` و `@Roles()` + guardهای متناظر.
- [ ] ذخیرهٔ توکن در کوکی `httpOnly` (نه localStorage) — هم‌خوان با پروکسی هم‌دامنهٔ فعلی.
- [ ] صفحهٔ ورود/ثبت‌نام در وب + `AuthProvider` و محافظت مسیرها در `middleware.ts`.

## ۳) مشاهدپذیری (Observability)

- [ ] لاگ ساختارمند JSON با `nestjs-pino` و تزریق `requestId` در هر خط.
- [ ] Sentry (یا جایگزین) برای خطاهای API و وب.
- [ ] متریک‌های پایه (`/metrics` با prom-client) و در صورت نیاز OpenTelemetry.

## ۴) امنیت و پایداری

- [ ] `@nestjs/throttler` برای rate limit (خاصه روی مسیرهای ورود).
- [ ] CSRF در صورت استفاده از کوکی برای auth.
- [ ] سیاست رمز عبور و قفل موقت پس از تلاش‌های ناموفق.
- [ ] هدرهای امنیتی پیشرفته (CSP) — فعلاً `useSecurityHeaders()` داخلی Nest فعال است.
- [ ] `trust proxy` در صورت استقرار پشت reverse proxy.

## ۵) زیرساخت

- [ ] Redis برای کش و صف (`@nestjs/bullmq`).
- [ ] آپلود فایل (S3 یا MinIO) با محدودیت حجم و نوع.
- [ ] `docker-compose.prod.yml` + secrets به‌جای رمز داخل فایل compose.
- [ ] مهاجرت به Postgres در صورت نیاز (تغییر `type` + بازتولید مایگریشن‌ها).
- [ ] استقرار: image tag مبتنی بر commit + healthcheck مبتنی بر readiness.

## ۶) تجربهٔ کاربری

- [ ] i18n چندزبانه (`next-intl`) — با توجه به RTL فعلی، افزودن انگلیسی ساده است.
- [ ] کامپوننت‌های بیشتر shadcn: `dialog`, `select`, `dropdown-menu`, `form` (react-hook-form + zod).
- [ ] حالت آفلاین/PWA در صورت نیاز + `manifest.webmanifest`.
- [ ] جداسازی liveness از readiness در health (الان یکی هستند و دیتابیس هم چک می‌شود).

## ۷) بدهی‌های فنی شناخته‌شده

- [ ] **تست‌ها وجود ندارند** → بازآرایی‌های بزرگ بدون تور نجات ریسک دارند.
- [ ] `pre-commit` فقط فرمت را اصلاح می‌کند؛ lint در `pnpm check`/CI است.
- [ ] کانفیگ Prettier تکی برای مونوریپوست؛ اگر پروژه‌ها سلیقهٔ متفاوتی خواستند،
      باید به کانفیگ per-app منتقل شود.
- [ ] `deleteOutDir` در `nest-cli.json` هر بار پوشهٔ dist را پاک می‌کند (کندتر ولی امن‌تر).
