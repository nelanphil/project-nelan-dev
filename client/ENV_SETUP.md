# Client Environment Variables Setup

The client now talks to the Express API (which handles MongoDB + JWT auth). Only one environment variable is required, but we still recommend separating development and production values.

## Required Variable

Create `.env.development` and `.env.production` inside the `client` directory with the backend API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production you’ll typically point to your deployed backend, e.g.:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

If the variable is omitted the client defaults to `http://localhost:5000/api`, which works for local development as long as the server runs on port `5000`.

## How Vite Loads Environment Files

- `npm run dev` → loads `.env.development`
- `npm run build` → loads `.env.production`
- Use `.env.development.local` / `.env.production.local` (gitignored) for local overrides that shouldn’t be committed.

## Important Notes

- The `VITE_` prefix is required for Vite to expose variables to the browser.
- Keep all `.env*` files with real secrets out of git.
- Update hosting/platform settings to include `VITE_API_BASE_URL` for production deployments of the client.

## After Setup

1. Create `.env.development`/`.env.production` in `client`.
2. Set `VITE_API_BASE_URL` to the appropriate backend URL per environment.
3. Restart `npm run dev` after changes so Vite picks up the new value.
