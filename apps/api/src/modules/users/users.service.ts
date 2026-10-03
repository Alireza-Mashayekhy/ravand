import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { UserSortField } from '@ravand/contracts';
import { ErrorCode } from '@ravand/contracts';
import { QueryFailedError, Repository } from 'typeorm';

import { paginate } from '../../common/database/paginate';
import { AppException } from '../../common/exceptions/app.exception';
import type { CreateUserDto } from './dto/create-user.dto';
import type { ListUsersQueryDto } from './dto/list-users.query.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserEntity } from './entities/user.entity';

/**
 * نگاشت فیلدهای قابل مرتب‌سازی به نام ستون‌های دیتابیس.
 *
 * چون QueryBuilder نام ستون را عیناً در SQL می‌گذارد، فقط مقادیر همین
 * آبجکت مجاز هستند (کلید آن‌ها هم با @IsIn در DTO محدود شده است).
 */
const SORT_COLUMNS: Record<UserSortField, string> = {
  createdAt: 'user.created_at',
  updatedAt: 'user.updated_at',
  email: 'user.email',
  fullName: 'user.full_name',
};

const DEFAULT_SORT: UserSortField = 'createdAt';

function isDuplicateEntryError(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  const driverError = error.driverError as { code?: string; errno?: number } | undefined;

  return driverError?.code === 'ER_DUP_ENTRY' || driverError?.errno === 1062;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  async list(query: ListUsersQueryDto) {
    const builder = this.users.createQueryBuilder('user');

    if (query.search) {
      builder.where('(user.full_name LIKE :term OR user.email LIKE :term)', {
        term: `%${query.search}%`,
      });
    }

    builder.orderBy(SORT_COLUMNS[query.sortBy ?? DEFAULT_SORT], query.sortOrder);

    const { data, meta } = await paginate(builder, query.page, query.limit);

    return { data: data.map((user) => UserResponseDto.fromEntity(user)), meta };
  }

  async findOneOrFail(id: string): Promise<UserEntity> {
    const user = await this.users.findOne({ where: { id } });

    if (!user) {
      throw new AppException(ErrorCode.NOT_FOUND, 'کاربر موردنظر پیدا نشد', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    return UserResponseDto.fromEntity(await this.findOneOrFail(id));
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.users.create({
      email: dto.email,
      fullName: dto.fullName,
      isActive: dto.isActive ?? true,
    });

    try {
      await this.users.save(user);
    } catch (error) {
      // ایندکس unique تنها ضامن است؛ بررسی قبلی به‌تنهایی در شرایط همزمانی کافی نیست
      if (isDuplicateEntryError(error)) {
        throw new AppException(
          ErrorCode.CONFLICT,
          'کاربری با این ایمیل از قبل ثبت شده است',
          HttpStatus.CONFLICT,
        );
      }

      throw error;
    }

    return UserResponseDto.fromEntity(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findOneOrFail(id);

    this.users.merge(user, dto);

    try {
      await this.users.save(user);
    } catch (error) {
      if (isDuplicateEntryError(error)) {
        throw new AppException(
          ErrorCode.CONFLICT,
          'کاربری با این ایمیل از قبل ثبت شده است',
          HttpStatus.CONFLICT,
        );
      }

      throw error;
    }

    return UserResponseDto.fromEntity(user);
  }

  /** حذف نرم: رکورد باقی می‌ماند ولی دیگر در queries برنمی‌گردد */
  async remove(id: string): Promise<{ id: string }> {
    const user = await this.findOneOrFail(id);

    await this.users.softRemove(user);

    return { id };
  }
}
