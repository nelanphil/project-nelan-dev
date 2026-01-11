# Nelan Dev Server

Backend API server for nelan.dev web application (Express + MongoDB + JWT).

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
   MONGO_URI_DEVELOPMENT=mongodb+srv://<dev-connection-string>
   MONGO_URI_PRODUCTION=mongodb+srv://<prod-connection-string>
   JWT_SECRET=super-secret-value
   ```

   > Even in development the code expects both `MONGO_URI_DEVELOPMENT` and `MONGO_URI_PRODUCTION`, so keep placeholders for the value you’re not using yet.

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

| Variable                | Description                                                             | Example                                                                                |
| ----------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `PORT`                  | Server port (automatically set by Render)                               | `10000`                                                                                |
| `NODE_ENV`              | Environment mode                                                        | `production`                                                                           |
| `CORS_ORIGIN`           | Allowed frontend origin(s). Comma-separated supported                   | `https://nelan-dev.onrender.com,https://nelan.dev`                                     |
| `MONGO_URI_DEVELOPMENT` | MongoDB connection string for dev (used during build hooks/tests)       | `mongodb+srv://username:password@cluster0.mongodb.net/dev?retryWrites=true&w=majority` |
| `MONGO_URI_PRODUCTION`  | MongoDB connection string for prod                                      | `mongodb+srv://username:password@cluster0.mongodb.net/prod?retryWrites=true&w=majority`|
| `JWT_SECRET`            | Secret used to sign/verify JWTs                                         | `change-me-please`                                                                     |

### Setting Environment Variables in Render

1. Go to your web service dashboard in Render
2. Navigate to **Environment** tab
3. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your frontend URL(s)
   - `MONGO_URI_DEVELOPMENT`: Optional but recommended so preview builds still connect
   - `MONGO_URI_PRODUCTION`: Production MongoDB connection string
   - `JWT_SECRET`: Strong, unpredictable string (rotate periodically)

**Note:** `PORT` is automatically provided by Render - you don't need to set it manually.

## API Endpoints

- `GET /health` – root health check
- `GET /api/health` – API health check
- `POST /api/auth/register` – create a new user (email + password)
- `POST /api/auth/login` – login and receive a JWT
- `GET /api/auth/me` – return the authenticated user (requires `Authorization: Bearer <token>`)
- `POST /api/contact` – submit contact form payload
- `GET /api/dashboard` – sample protected endpoint

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
