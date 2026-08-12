# Admin User Creation Script

This script creates an admin user in both development and production Supabase instances.

## Prerequisites

1. Create `.env.development` and `.env.production` files in the **server directory** (where your server-side Supabase config is)
2. Each file should contain:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

**Important:**

- The script looks for `.env` files in the `server/` directory first, then falls back to project root
- The `SUPABASE_URL` is the same as `VITE_SUPABASE_URL` in your client `.env` files (just without the `VITE_` prefix)
- The `SUPABASE_SERVICE_ROLE_KEY` is **different** from `VITE_SUPABASE_ANON_KEY`
- Find the service role key in Supabase Dashboard → Settings → API → **service_role key** (secret)
- **Never commit these files** - they contain sensitive credentials

**Note:** Your client `.env` files should stay in the `client/` folder with `VITE_` prefix. The server `.env` files should be in the `server/` folder without the `VITE_` prefix.

## Usage

From the project root, run:

```bash
# Option 1: From scripts directory (recommended)
cd scripts
npm install  # First time only - installs dependencies
npm run create-admin

# Option 2: Using tsx from scripts directory (after npm install)
cd scripts
npx tsx create-admin-user.ts

# Option 3: Using tsx from project root (if tsx is installed globally)
cd scripts
npm install  # First time only
tsx create-admin-user.ts
```

The script will:

1. Prompt you for an email address
2. Prompt you for a password (minimum 6 characters)
3. Create the admin user in development Supabase (if `.env.development` exists)
4. Create the admin user in production Supabase (if `.env.production` exists)
5. Set `user_metadata.role = 'admin'` for both users

## Notes

- **About User Tables:** Supabase Auth users are stored in `auth.users` which is managed by Supabase. You **won't see this table in the Table Editor** - this is normal! To view users:
  - Go to your Supabase Dashboard → **Authentication** → **Users** section
  - Or query via SQL: `SELECT * FROM auth.users;`
  - Users are accessible via the Auth API, not as regular database tables
- If a user with the same email already exists, the script will attempt to update their metadata to set the admin role
- The script uses the service role key, which bypasses Row Level Security (RLS) and can create users programmatically
- Passwords are automatically hashed by Supabase (bcrypt)
- JWT tokens are automatically generated upon sign-in

## Admin Role

The admin role is stored in `user.user_metadata.role = 'admin'`. You can check for admin status in your application code:

```typescript
const user = await supabase.auth.getUser();
const isAdmin = user?.user_metadata?.role === "admin";
```
