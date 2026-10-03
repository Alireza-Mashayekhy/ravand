import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateUserInput } from '@ravand/contracts';
import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * `implements CreateUserInput` تضمین می‌کند این DTO با قرارداد مشترک
 * (packages/contracts) هم‌خوان بماند؛ اگر یکی تغییر کند، compile می‌شکند.
 */
export class CreateUserDto implements CreateUserInput {
  @ApiProperty({ example: 'ali@example.com', maxLength: 191 })
  @IsEmail({}, { message: 'ایمیل واردشده معتبر نیست' })
  @MaxLength(191)
  email: string;

  @ApiProperty({ example: 'علی محمدی', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2, { message: 'نام باید حداقل ۲ کاراکتر باشد' })
  @MaxLength(100)
  fullName: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
