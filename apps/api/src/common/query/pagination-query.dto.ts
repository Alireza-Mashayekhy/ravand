import { PAGINATION } from '@ravand/contracts';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = PAGINATION.DEFAULT_PAGE;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION.MAX_LIMIT)
  limit: number = PAGINATION.DEFAULT_LIMIT;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
