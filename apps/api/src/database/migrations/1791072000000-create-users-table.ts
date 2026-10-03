import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * ساخت جدول users.
 *
 * این مایگریشن نمونه است تا الگوی درست را نشان دهد:
 * - حذف نرم با deleted_at
 * - قفل خوش‌بینانه با version
 * - نام‌گذاری snake_case و utf8mb4
 */
export class CreateUsersTable1791072000000 implements MigrationInterface {
  name = 'CreateUsersTable1791072000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` varchar(36) NOT NULL,
        \`email\` varchar(191) NOT NULL,
        \`full_name\` varchar(100) NOT NULL,
        \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        \`version\` int NOT NULL DEFAULT 1,
        UNIQUE INDEX \`uq_users_email\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `users`');
  }
}
