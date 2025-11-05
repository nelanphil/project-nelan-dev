# Nelan Dev Server

Backend API server for nelan.dev web application.

## Local Development

1. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

2. Create a `.env` file in the `server/` directory with the following variables:

   ```env
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. Run the development server:

   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. Build for production:

   ```bash
   yarn build
   # or
   npm run build
   ```

5. Start production server:
   ```bash
   yarn start
   # or
   npm start
   ```

## Environment Variables

### Required for Production (Render)

| Variable                    | Description                                                             | Example                                                                                |
| --------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `PORT`                      | Server port (automatically set by Render)                               | `10000`                                                                                |
| `NODE_ENV`                  | Environment mode                                                        | `production`                                                                           |
| `CORS_ORIGIN`               | Allowed frontend origin(s). Can be comma-separated for multiple origins | `https://nelan-dev.onrender.com` or `https://nelan-dev.onrender.com,https://nelan.dev` |
| `SUPABASE_URL`              | Your Supabase project URL                                               | `https://xxxxx.supabase.co`                                                            |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (server-side only)                       | `eyJhbGc...`                                                                           |

### Setting Environment Variables in Render

1. Go to your web service dashboard in Render
2. Navigate to **Environment** tab
3. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your frontend static site URL (e.g., `https://your-frontend.onrender.com`)
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

**Note:** `PORT` is automatically provided by Render - you don't need to set it manually.

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/health` - API health check
- `GET /api/example` - Example route

## Deployment on Render

### Using render.yaml (Recommended)

If you have a `render.yaml` file in the root of your repository, Render will automatically detect and use it. The configuration is already set up for this service.

### Manual Configuration

If configuring manually in the Render dashboard:

- **Root Directory**: `server`
- **Build Command**: `yarn install && yarn build` (or `npm install && npm run build`)
- **Start Command**: `yarn start` (or `npm start`)
- **Environment**: `Node`
- **Node Version**: Check your `package.json` or use latest LTS

## CORS Configuration

The server supports multiple allowed origins by providing a comma-separated list in the `CORS_ORIGIN` environment variable:

```env
CORS_ORIGIN=https://nelan-dev.onrender.com,https://nelan.dev,https://www.nelan.dev
```

In production, if `CORS_ORIGIN` is not set, the server will log a warning and CORS requests may fail.
