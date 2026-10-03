import type { DataSource } from 'typeorm';

import { UserEntity } from '../../modules/users/entities/user.entity';
import type { Seeder } from './seeder';

const SAMPLE_USERS = [
  { email: 'ali@example.com', fullName: 'علی محمدی' },
  { email: 'sara@example.com', fullName: 'سارا احمدی' },
  { email: 'reza@example.com', fullName: 'رضا کریمی' },
];

export const usersSeeder: Seeder = {
  name: 'users',

  async run(dataSource: DataSource): Promise<void> {
    const users = dataSource.getRepository(UserEntity);

    for (const sample of SAMPLE_USERS) {
      const existing = await users.findOne({ where: { email: sample.email }, withDeleted: true });

      if (existing) {
        console.log(`   ↷ ${sample.email} از قبل وجود دارد`);
        continue;
      }

      await users.save(users.create({ ...sample, isActive: true }));

      console.log(`   ✓ ${sample.email} اضافه شد`);
    }
  },
};
