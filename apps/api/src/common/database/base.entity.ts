import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

/**
 * پایهٔ همهٔ entityها:
 * - کلید UUID (بدون افشای ترتیب و تعداد رکوردها)
 * - createdAt / updatedAt با نام ستون snake_case
 * - deletedAt برای حذف نرم (soft delete)
 * - version برای قفل خوش‌بینانه (optimistic locking)
 *
 * توجه: soft delete یعنی رکوردهای حذف‌شده در find به‌صورت پیش‌فرض برنمی‌گردند
 * و برای دیدن‌شان باید از withDeleted() استفاده کنی.
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', precision: 6, nullable: true })
  deletedAt: Date | null;

  @VersionColumn({ name: 'version' })
  version: number;
}
