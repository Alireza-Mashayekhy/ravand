import type { PaginationMeta } from '@ravand/contracts';
import { createPaginationMeta } from '@ravand/contracts';
import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * یک SelectQueryBuilder را صفحه‌بندی می‌کند و متادیتای مشترک را برمی‌گرداند
 * تا ResponseInterceptor آن را داخل پاسخ قرار دهد.
 *
 * مثال:
 *   const query = repository.createQueryBuilder('user').orderBy('user.created_at', 'DESC');
 *   const { data, meta } = await paginate(query, page, limit);
 */
export async function paginate<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  page: number,
  limit: number,
): Promise<Paginated<T>> {
  const [data, total] = await query
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    data,
    meta: createPaginationMeta(page, limit, total),
  };
}
