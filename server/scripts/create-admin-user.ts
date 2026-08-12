/**
 * Bootstrap the first admin user against MongoDB.
 *
 * Usage (from server/):
 *   npx tsx scripts/create-admin-user.ts
 *
 * Requires MONGO_URI_DEVELOPMENT or MONGO_URI_PRODUCTION (based on NODE_ENV)
 * and optional ADMIN_EMAIL / ADMIN_PASSWORD env vars (otherwise prompts).
 */

import 'dotenv/config';
import readline from 'readline';
import { connectToDatabase, disconnectFromDatabase } from '../src/config/mongodb';
import { UserModel } from '../src/models/User';
import { hashPassword } from '../src/utils/auth';
import { seedRbac, getSystemRoleId } from '../src/utils/seedRbac';

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  let email = process.env.ADMIN_EMAIL?.trim() || '';
  let password = process.env.ADMIN_PASSWORD?.trim() || '';

  if (!email) {
    email = await prompt('Admin email: ');
  }

  if (!password) {
    password = await prompt('Admin password (min 6 chars): ');
  }

  if (!email || !password || password.length < 6) {
    console.error('Email and a password of at least 6 characters are required.');
    process.exit(1);
  }

  await connectToDatabase();
  await seedRbac();

  const adminRoleId = await getSystemRoleId('admin');
  const existing = await UserModel.findOne({ email: email.toLowerCase() });

  if (existing) {
    existing.roleId = adminRoleId;
    existing.isActive = true;
    existing.passwordHash = await hashPassword(password);
    await existing.save();
    console.log(`Updated existing user to admin: ${existing.email}`);
  } else {
    const user = await UserModel.create({
      email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      roleId: adminRoleId,
    });
    console.log(`Created admin user: ${user.email}`);
  }

  await disconnectFromDatabase();
}

main().catch(async (error) => {
  console.error('Failed to create admin user:', error);
  try {
    await disconnectFromDatabase();
  } catch {
    // ignore
  }
  process.exit(1);
});
