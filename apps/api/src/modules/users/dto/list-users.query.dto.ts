import { ApiPropertyOptional } from '@nestjs/swagger';
import type { UserSortField } from '@ravand/contracts';
import { USER_SORT_FIELDS } from '@ravand/contracts';
import { IsIn, IsOptional } from 'class-validator';

import { ListQueryDto } from '../../../common/query/list-query.dto';

export class ListUsersQueryDto extends ListQueryDto {
  /**
   * allowlist ستون‌های مجاز برای مرتب‌سازی.
   * بدون این allowlist، مقدار دلخواه کاربر به ORDER BY می‌رسد.
   */
  @ApiPropertyOptional({ enum: USER_SORT_FIELDS, default: 'createdAt' })
  @IsOptional()
  @IsIn(USER_SORT_FIELDS)
  sortBy?: UserSortField;
}
