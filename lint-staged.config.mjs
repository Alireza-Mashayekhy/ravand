/**
 * pre-commit فقط فرمت را اصلاح می‌کند تا کامیت‌ها سریع بمانند.
 * lint و typecheck در `pnpm check` (و در آینده CI) اجرا می‌شوند.
 */
export default {
  '*.{js,jsx,ts,tsx,mjs,cjs}': ['prettier --write --ignore-unknown'],
  '*.{json,md,yml,yaml,css,scss}': ['prettier --write --ignore-unknown'],
};
