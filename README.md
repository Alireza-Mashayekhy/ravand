# روند (Ravand)

قالب پایهٔ مونوریپو برای شروع سریع پروژه‌های وب فارسی/RTL:

**NestJS + TypeORM + MySQL** در بک‌اند، **Next.js (App Router) + React Query + Tailwind v4** در فرانت‌اند،
با **pnpm workspace** و **Turbo**، تایپ‌های مشترک، داکر آماده و یک feature نمونهٔ کامل.

---

## شروع سریع

پیش‌نیازها: **Node 22+**، **pnpm 10+**، **Docker** (برای دیتابیس).

```bash
cp .env.example .env     # یک‌بار
pnpm install

# گزینهٔ ۱ — همه‌چیز با یک دستور (نصب + دیتابیس + مایگریشن + دادهٔ نمونه)
pnpm setup
pnpm dev

# گزینهٔ ۲ — مرحله‌به‌مرحله
pnpm db:up               # فقط MySQL روی پورت 3307
pnpm db:migration:run
pnpm db:seed
pnpm dev
```

| سرویس          | آدرس                             |
| -------------- | -------------------------------- |
| وب             | <http://localhost:3333>          |
| API            | <http://localhost:4444/api/v1>   |
| Swagger        | <http://localhost:4444/api/docs> |
| نمونهٔ feature | <http://localhost:3333/users>    |

---

## ساختار

```
apps/
├── api/                 NestJS + TypeORM
│   └── src/
│       ├── common/      زیرساخت مشترک (فیلتر، interceptor، میدلور، paginate، BaseEntity)
│       ├── config/      تنها منبع حقیقت متغیرهای محیطی (اسکیمای Joi)
│       ├── database/    data-source (CLI)، مایگریشن‌ها، سیدرها
│       ├── health/      /api/v1/health (readiness شامل دیتابیس)
│       └── modules/     ماژول‌های دامنه — نمونه: users
└── web/                 Next.js App Router
    └── src/
        ├── app/         مسیرها، layout فارسی/RTL، error/loading/not-found
        ├── components/  ui (shadcn-style) و layout
        ├── features/    هر feature با api / hooks / components / types
        ├── hooks/       هوک‌های مشترک
        └── lib/         کلاینت API، خطاها، فرمت تاریخ شمسی
packages/
├── contracts/           ⭐ تایپ‌ها، کدهای خطا و ساختار پاسخ (مشترک بین api و web)
├── eslint-config/       کانفیگ مشترک ESLint
└── tsconfig/            کانفیگ مشترک TypeScript
infra/
├── docker-compose.yml   MySQL (+ پروفایل full برای api و web)
└── docker/              Dockerfileهای اپ‌ها
scripts/                 اسکریپت‌های کمکی (clean)
docs/                    ROADMAP
```

---

## قراردادها

### ۱) شکل پاسخ

همهٔ پاسخ‌ها (موفق و ناموفق) یک ساختار دارند — تعریف مشترک در `packages/contracts`:

```jsonc
// موفق
{ "success": true, "data": { /* ... */ }, "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3, "hasNextPage": true, "hasPreviousPage": false } }

// ناموفق
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "…", "statusCode": 400, "details": [{ "field": "email", "messages": ["…"] }] }, "requestId": "…", "timestamp": "…", "path": "…" }
```

### ۲) تایپ‌های مشترک

هر تایپ یا کد خطایی که هر دو طرف لازم دارند، در `packages/contracts` زندگی می‌کند.
DTOهای بک‌اند با `implements` به آن گره خورده‌اند:

```ts
// apps/api/src/modules/users/dto/create-user.dto.ts
export class CreateUserDto implements CreateUserInput { … }
```

اگر یکی تغییر کند، `pnpm typecheck` می‌شکند — یعنی واگرایی فرانت و بک غیرممکن می‌شود.

### ۳) ارتباط فرانت با API

مرورگر به `/api/v1/...` روی **همان دامنه** درخواست می‌دهد و Next آن را به `API_URL` پروکسی می‌کند
(`next.config.ts` → `rewrites`). نتیجه: نه CORS دردسر دارد، نه `localhost` در داکر/دامنه/موبایل.

> در داکر، `API_URL` هم به‌صورت **build-arg** و هم **runtime env** ست می‌شود، چون مقدار rewrite
> در زمان build داخل خروجی Next نوشته می‌شود.

### ۴) دیتابیس

- `synchronize: false` همیشه؛ تغییر اسکیما فقط با **مایگریشن**.
- `apps/api/src/database/data-source.ts` (CLI) و `AppModule` (اپ) هر دو از یک فایل کانفیگ
  (`database/typeorm-options.ts`) و یک اسکیمای env استفاده می‌کنند.
- `BaseEntity` شامل `id` (UUID)، `createdAt`، `updatedAt`، `deletedAt` (حذف نرم) و `version` است.

---

## متغیرهای محیطی

همه در `.env.example` مستند شده‌اند و اسکیمای آن‌ها فقط در `apps/api/src/config/env.ts` است.
خلاصهٔ مهم‌ترین‌ها:

| متغیر            | پیش‌فرض                 | توضیح                                |
| ---------------- | ----------------------- | ------------------------------------ |
| `API_PORT`       | `4444`                  | پورت API                             |
| `DB_PORT`        | `3307`                  | پورت MySQL روی میزبان (نه داخل داکر) |
| `CORS_ORIGINS`   | `http://localhost:3333` | با کاما جدا می‌شود                   |
| `API_URL`        | `http://localhost:4444` | فقط سمت سرور (SSR + rewrite)         |
| `RUN_MIGRATIONS` | `false`                 | در کانتینر `true` می‌شود             |

هیچ `NEXT_PUBLIC_API_URL` وجود ندارد و لازم هم نیست.

---

## اسکریپت‌ها

| دستور                                                       | کار                                              |
| ----------------------------------------------------------- | ------------------------------------------------ |
| `pnpm dev`                                                  | اجرای هم‌زمان API و وب                           |
| `pnpm dev:api` / `pnpm dev:web`                             | اجرای جداگانه                                    |
| `pnpm check`                                                | lint + typecheck + build (تور نجات قبل از کامیت) |
| `pnpm lint` / `pnpm lint:fix`                               | ESLint                                           |
| `pnpm typecheck`                                            | بررسی تایپ‌ها در کل workspace                    |
| `pnpm format` / `pnpm format:check`                         | Prettier                                         |
| `pnpm db:up` / `pnpm db:down`                               | فقط MySQL                                        |
| `pnpm db:migration:run` / `:generate` / `:revert` / `:show` | مایگریشن‌ها                                      |
| `pnpm db:seed`                                              | دادهٔ نمونه (idempotent)                         |
| `pnpm stack:up` / `pnpm stack:down`                         | کل استک روی داکر                                 |
| `pnpm clean`                                                | پاک‌کردن خروجی بیلدها                            |

ساخت مایگریشن جدید:

```bash
pnpm --filter @ravand/api db:migration:create src/database/migrations/AddSomething
```

---

## داکر

```bash
pnpm db:up      # فقط دیتابیس (سبک، مناسب توسعهٔ لوکال)
pnpm stack:up   # mysql + api + web با healthcheck واقعی
```

- ایمیج API با کاربر غیر root و **بدون وابستگی‌های dev** ساخته می‌شود.
- ایمیج وب از **`output: 'standalone'`** استفاده می‌کند (کوچک و بدون node_modules کامل).
- `RUN_MIGRATIONS=true` مایگریشن‌ها را پیش از بالا آمدن API اعمال می‌کند.
- برای build از BuildKit استفاده می‌شود (پیش‌فرض Docker مدرن).

---

## افزودن یک feature جدید (چک‌لیست)

**بک‌اند**

1. `packages/contracts/src/index.ts` → تایپ‌های دامنه و ورودی/خروجی را اضافه کن.
2. `apps/api/src/modules/<name>/entities/*.entity.ts` (با `extends BaseEntity`).
3. DTOها با `implements` از contracts + `class-validator`.
4. سرویس با `paginate()` و `AppException` برای خطاهای دامنه.
5. کنترلر با `@ApiTags`/`@ApiOperation`؛ هرگز entity را مستقیم برنگردان.
6. `pnpm db:migration:generate` → بازبینی مایگریشن → `pnpm db:migration:run`.

**فرانت‌اند** 7. `apps/web/src/features/<name>/api/index.ts` (توابع API) و `api/query-keys.ts`. 8. `apps/web/src/features/<name>/hooks/index.ts` (useQuery/useMutation). 9. کامپوننت‌ها + صفحه در `apps/web/src/app/<route>/page.tsx`.

---

## چه چیزی داخل این قالب نیست؟

آگاهانه کنار گذاشته شده‌اند تا پایه سبک بماند: احراز هویت، تست، CI، i18n، لاگ ساختارمند/pino،
Sentry، rate limit، صف و آپلود فایل. فهرست و ترتیب پیشنهادی در [`docs/ROADMAP.md`](docs/ROADMAP.md) است.
