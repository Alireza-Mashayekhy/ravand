import type { SortOrder } from '@ravand/contracts';
import { SORT_ORDERS, SortOrder as SortOrderValues } from '@ravand/contracts';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

import { PaginationQueryDto } from './pagination-query.dto';

/**
 * پیش‌فرض امن برای لیست‌ها: جست‌وجو + ترتیب + صفحه‌بندی.
 *
 * نکتهٔ مهم: `sortBy` عمداً اینجا تعریف نشده است.
 * هر feature باید خودش با `@IsIn(...)` یک allowlist اعلام کند تا هیچ‌وقت
 * مقدار دلخواه کاربر به ORDER BY نرسد.
 */
export class ListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder: SortOrder = SortOrderValues.DESC;
}
