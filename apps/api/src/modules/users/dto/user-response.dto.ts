import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@ravand/contracts';

import type { UserEntity } from '../entities/user.entity';

/**
 * خروجی API برای کاربر.
 *
 * قاعدهٔ پروژه: هیچ‌وقت entity را مستقیم برنگردان.
 * این DTO تعیین می‌کند چه چیزی به بیرون درز می‌کند (مثلاً version یا deletedAt نه).
 */
export class UserResponseDto implements User {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'ali@example.com' })
  email: string;

  @ApiProperty({ example: 'علی محمدی' })
  fullName: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  static fromEntity(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      fullName: entity.fullName,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
