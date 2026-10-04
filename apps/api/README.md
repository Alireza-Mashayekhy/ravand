# @ravand/api

API روند بر پایهٔ NestJS + TypeORM + MySQL.

> سند راه‌اندازی کامل و توضیح معماری در [`README.md` ریشه](../../README.md) است.
> این فایل فقط جزئیات مخصوص API را دارد.

## اجرا

```bash
# از ریشهٔ ریپو
pnpm db:up          # بالا آوردن MySQL (فقط دیتابیس)
pnpm db:migration:run
pnpm db:seed
pnpm dev:api        # http://localhost:4444/api/v1
```

مستندات Swagger: <http://localhost:4444/api/docs>

## ساختار

```
src/
├── common/                 # زیرساخت مشترک و بی‌طرف نسبت به دامنه
│   ├── bootstrap/          # setupApp: CORS، validation، swagger، فیلترها
│   ├── database/           # BaseEntity و paginate
│   ├── exceptions/         # AppException (کد خطای مشترک)
│   ├── filters/            # تبدیل همهٔ خطاها به یک ساختار واحد
│   ├── interceptors/       # لاگ درخواست + envelope پاسخ
│   ├── messages/           # تنها منبع پیام‌های فارسی
│   ├── middleware/         # requestId (قبل از guardها اجرا می‌شود)
│   ├── query/              # DTOهای پایهٔ صفحه‌بندی/لیست
│   └── validation/         # فرمت‌کردن خطاهای class-validator
├── config/                 # env (اسکیمای Joi) و سطح لاگ
├── database/               # data-source (CLI)، مایگریشن‌ها، سیدرها
├── health/                 # /api/v1/health (readiness شامل دیتابیس)
└── modules/                # ماژول‌های دامنه — الگوی نمونه: users
```

## قواعد

- **هیچ‌وقت entity را برنگردان.** همیشه یک `*ResponseDto` بساز (نمونه: `UserResponseDto`).
- **همهٔ متغیرهای محیطی فقط در `src/config/env.ts`.** جای دیگری مقدار پیش‌فرض تعریف نکن.
- **`synchronize` همیشه false است.** تغییر جدول = مایگریشن.
- **`sortBy` بدون allowlist ممنوع** (`@IsIn(...)` را از دست نده).
- قراردادهای مشترک با فرانت‌اند در `packages/contracts` است؛ DTOها با
  `implements` به آن گره خورده‌اند تا واگرایی غیرممکن شود.
