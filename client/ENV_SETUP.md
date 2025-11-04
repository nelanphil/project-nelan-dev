# Client Environment Variables Setup

The client application requires Supabase environment variables to be configured.

Since you have separate Supabase projects for development and production, you should create environment-specific files.

## Required Variables

Create two files in the `client` directory:

### For Development: `.env.development`

```env
VITE_SUPABASE_URL=your_development_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_development_supabase_anon_key
```

### For Production: `.env.production`

```env
VITE_SUPABASE_URL=your_production_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## How Vite Loads Environment Files

Vite automatically loads the correct file based on the mode:

- **Development mode** (`npm run dev`): Loads `.env.development`
- **Production build** (`npm run build`): Loads `.env.production`

You can also use `.local` variants (gitignored):

- `.env.development.local` - for development overrides
- `.env.production.local` - for production overrides

## Where to Find These Values

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon/public key** → Use as `VITE_SUPABASE_ANON_KEY`

## Example

**Development (.env.development):**

```env
VITE_SUPABASE_URL=https://dev-xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldi14eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTk2ODg4MCwiZXhwIjoxOTYxNTQ0ODgwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Production (.env.production):**

```env
VITE_SUPABASE_URL=https://prod-xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByb2QteHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTk2ODg4MCwiZXhwIjoxOTYxNTQ0ODgwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Important Notes

- The `VITE_` prefix is required for Vite to expose these variables to the client
- `.env.development.local` and `.env.production.local` are gitignored (use these if you want to keep credentials out of git)
- Never commit `.env.local` or `.env` files with real credentials to git
- For production deployments, you can also set these as environment variables in your hosting platform

## After Setup

1. Create `.env.development` and `.env.production` files in the `client` directory
2. Add your respective Supabase credentials to each file
3. Restart your development server (`npm run dev`) to use the development credentials
4. When building for production (`npm run build`), it will automatically use the production credentials
