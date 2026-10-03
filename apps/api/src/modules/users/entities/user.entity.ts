import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '../../../common/database/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Index('uq_users_email', { unique: true })
  @Column({ type: 'varchar', length: 191 })
  email: string;

  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
