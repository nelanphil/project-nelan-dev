import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// Declare __dirname for CommonJS
declare const __dirname: string;

/**
 * Script to create an admin user in Supabase for both development and production environments.
 *
 * Usage:
 *   npm run create-admin-user
 *   or
 *   tsx scripts/create-admin-user.ts
 *
 * The script will:
 * 1. Prompt for email and password
 * 2. Create the user in development Supabase (from .env.development)
 * 3. Create the user in production Supabase (from .env.production)
 * 4. Set user_metadata.role = 'admin' for both
 */

interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

function loadEnvFile(envPath: string): EnvConfig | null {
  if (!fs.existsSync(envPath)) {
    console.warn(`⚠️  ${envPath} not found. Skipping.`);
    return null;
  }

  // Parse the .env file manually
  const envContent = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};

  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const equalIndex = trimmed.indexOf("=");
      if (equalIndex > 0) {
        const key = trimmed.substring(0, equalIndex).trim();
        const value = trimmed
          .substring(equalIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, "");
        env[key] = value;
      }
    }
  });

  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(`❌ Missing required variables in ${envPath}`);
    console.error("Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }

  return { SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key };
}

function createSupabaseClient(config: EnvConfig) {
  return createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function createAdminUser(
  supabase: ReturnType<typeof createSupabaseClient>,
  email: string,
  password: string,
  environment: string
): Promise<boolean> {
  try {
    console.log(`\n📝 Creating admin user in ${environment}...`);
    console.log(`   Email: ${email}`);

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: "admin",
      },
    });

    if (error) {
      console.log(`   Error code: ${error.code || "N/A"}`);
      console.log(`   Error message: ${error.message}`);
    }

    if (error) {
      // Check for various "user already exists" error messages
      const isUserExistsError =
        error.message.includes("already registered") ||
        error.message.includes("already exists") ||
        error.message.includes("User already registered") ||
        error.code === "user_already_exists";

      if (isUserExistsError) {
        console.log(`⚠️  User ${email} already exists in ${environment}.`);
        console.log(`   Attempting to update user metadata...`);

        // Try to get the user and update metadata
        const { data: users, error: listError } =
          await supabase.auth.admin.listUsers();

        if (listError) {
          console.error(`❌ Failed to list users: ${listError.message}`);
          return false;
        }

        const existingUser = users?.users.find((u) => u.email === email);

        if (existingUser) {
          const { error: updateError } =
            await supabase.auth.admin.updateUserById(existingUser.id, {
              user_metadata: {
                role: "admin",
                ...existingUser.user_metadata,
              },
            });

          if (updateError) {
            console.error(
              `❌ Failed to update user metadata: ${updateError.message}`
            );
            return false;
          }

          console.log(
            `✅ User metadata updated successfully in ${environment}.`
          );
          return true;
        } else {
          console.error(`❌ Could not find existing user with email ${email}`);
          return false;
        }
      } else {
        console.error(
          `❌ Failed to create user in ${environment}: ${error.message}`
        );
        return false;
      }
    } else {
      console.log(`✅ Admin user created successfully in ${environment}!`);
      console.log(`   User ID: ${data.user.id}`);
      return true;
    }
  } catch (error: any) {
    console.error(`❌ Unexpected error in ${environment}:`, error.message);
    return false;
  }

  return false;
}

async function promptInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log("🔐 Admin User Creation Script\n");
  console.log(
    "This script will create an admin user in both development and production Supabase instances.\n"
  );

  // Get email and password
  const email = await promptInput("Enter admin email: ");
  if (!email) {
    console.error("❌ Email is required.");
    process.exit(1);
  }

  const password = await promptInput("Enter admin password: ");
  if (!password) {
    console.error("❌ Password is required.");
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("❌ Password must be at least 6 characters.");
    process.exit(1);
  }

  // Load environment files from server directory (where service role keys are stored)
  const rootDir = path.resolve(__dirname, "..");
  const serverDir = path.join(rootDir, "server");
  const devEnvPath = path.join(serverDir, ".env.development");
  const prodEnvPath = path.join(serverDir, ".env.production");

  // Fallback to root directory if server files don't exist
  const rootDevEnvPath = path.join(rootDir, ".env.development");
  const rootProdEnvPath = path.join(rootDir, ".env.production");

  // Try server directory first, then fallback to root
  let devConfig = loadEnvFile(devEnvPath);
  if (!devConfig && fs.existsSync(rootDevEnvPath)) {
    console.log("📁 Using .env.development from project root");
    devConfig = loadEnvFile(rootDevEnvPath);
  }

  let prodConfig = loadEnvFile(prodEnvPath);
  if (!prodConfig && fs.existsSync(rootProdEnvPath)) {
    console.log("📁 Using .env.production from project root");
    prodConfig = loadEnvFile(rootProdEnvPath);
  }

  if (!devConfig && !prodConfig) {
    console.error("❌ No valid environment files found.");
    console.error(
      "   Please ensure .env.development and/or .env.production exist in:"
    );
    console.error(`   - ${serverDir}`);
    console.error(`   - ${rootDir} (fallback)`);
    console.error("\n   Each file should contain:");
    console.error("   SUPABASE_URL=your_supabase_url");
    console.error("   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key");
    process.exit(1);
  }

  let successCount = 0;

  // Create user in development
  if (devConfig) {
    console.log(`\n🔧 Testing connection to development Supabase...`);
    const devSupabase = createSupabaseClient(devConfig);

    // Test connection by listing users
    const { error: testError } = await devSupabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    if (testError) {
      console.error(
        `❌ Cannot connect to development Supabase: ${testError.message}`
      );
      console.error(
        `   Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env.development`
      );
    } else {
      console.log(`✅ Connected to development Supabase`);
      const success = await createAdminUser(
        devSupabase,
        email,
        password,
        "development"
      );
      if (success) successCount++;
    }
  }

  // Create user in production
  if (prodConfig) {
    console.log(`\n🔧 Testing connection to production Supabase...`);
    const prodSupabase = createSupabaseClient(prodConfig);

    // Test connection by listing users
    const { error: testError } = await prodSupabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    if (testError) {
      console.error(
        `❌ Cannot connect to production Supabase: ${testError.message}`
      );
      console.error(
        `   Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env.production`
      );
    } else {
      console.log(`✅ Connected to production Supabase`);
      const success = await createAdminUser(
        prodSupabase,
        email,
        password,
        "production"
      );
      if (success) successCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  if (successCount > 0) {
    console.log(
      `✅ Script completed. Admin user setup in ${successCount} environment(s).`
    );
  } else {
    console.log("❌ Failed to create admin user in any environment.");
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
