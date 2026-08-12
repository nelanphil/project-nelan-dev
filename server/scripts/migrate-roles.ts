/**
 * One-off migration: converts any users still on the legacy `role: 'admin' |
 * 'user'` string field to the new `roleId` reference against the seeded
 * system roles, and backfills `isActive: true`.
 *
 * Safe to run multiple times — only touches documents missing `roleId`.
 *
 * Usage (from server/):
 *   npx tsx scripts/migrate-roles.ts
 */

import 'dotenv/config';
import { connectToDatabase, disconnectFromDatabase } from '../src/config/mongodb';
import { UserModel } from '../src/models/User';
import { seedRbac, getSystemRoleId } from '../src/utils/seedRbac';

async function main() {
  await connectToDatabase();
  await seedRbac();

  const adminRoleId = await getSystemRoleId('admin');
  const userRoleId = await getSystemRoleId('user');

  const legacyUsers = await UserModel.collection
    .find({ roleId: { $exists: false } })
    .toArray();

  console.log(`Found ${legacyUsers.length} user(s) without roleId to migrate.`);

  for (const raw of legacyUsers) {
    const legacyRole = (raw as Record<string, unknown>).role;
    const roleId = legacyRole === 'admin' ? adminRoleId : userRoleId;

    await UserModel.collection.updateOne(
      { _id: raw._id },
      {
        $set: { roleId, isActive: true },
        $unset: { role: '' },
      }
    );

    console.log(`Migrated ${raw.email} -> role "${legacyRole || 'user'}"`);
  }

  console.log('Migration complete.');
  await disconnectFromDatabase();
}

main().catch(async (error) => {
  console.error('Migration failed:', error);
  try {
    await disconnectFromDatabase();
  } catch {
    // ignore
  }
  process.exit(1);
});
