# Qodriva

Qodriva is a React coding-practice platform with a searchable problem catalog, difficulty/topic filters, a code workspace, progress views, and a leaderboard. It includes a responsive sign-in/create-profile screen, ThinkingOrb loading states, and a chromatic MetalFx edge effect on the authentication button. MetalFx requires WebGL2 and renders the regular styled button when WebGL2 is unavailable.

## Run locally

Run the API and frontend in separate terminals to use real accounts, saved progress, and API-backed problems:

```powershell
cd server
npm install
npm run dev
```

```powershell
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). By default, Vite proxies `/api` requests to `http://localhost:5000`, and the frontend uses the Express API. The server defaults to in-memory storage in development; set `STORAGE_MODE=mysql` only when MySQL is available. Without a Judge0-compatible service, code execution endpoints return a clear configuration error.

For a UI-only preview without starting the backend, set `VITE_API_MODE=demo` in `client/.env` and restart Vite. Demo profiles are saved in browser storage, passwords are not saved or checked, and **Run** and **Submit** do not execute code. The account-creation form includes a password-strength hint and **Explore as a guest** skips profile setup.

Run the API authentication tests from the `server` directory with `npm test`.

## Authentication

In API mode, accounts can sign in with either their username or email. Passwords are hashed with Node's scrypt before storage. Successful sign-in issues a signed JWT in an `HttpOnly`, `SameSite=Strict` cookie; the token is never stored in browser JavaScript storage. Sessions last 8 hours, or 7 days when “Keep me signed in” is selected. Login and registration attempts are rate-limited. In UI-only mode, demo profile data is saved in browser storage, but passwords are not saved or checked.

Copy `server/.env.example` to `server/.env`. For persistent accounts and submissions, install and start MySQL, create the configured database (default `fullstack_app`), set `STORAGE_MODE=mysql`, and provide the database host, port, database name, username, and password. The MySQL account must be able to create and alter the app's `users` and `submissions` tables. The API creates/updates these tables at startup.

Set a private JWT secret before deploying. Generate one with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`JWT_SECRET` is required in production; development generates a temporary secret if none is set, so sessions do not survive an API restart. Set `CLIENT_ORIGIN` to the deployed frontend origin if it differs from the local Vite origin. Existing user-management API routes require an authenticated administrator; new registrations always receive the Member role.

## Deploy the API on Render

The root `render.yaml` configures the Express API service and its health check. Connect this repository to Render as a Blueprint and provide `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` from a publicly reachable MySQL provider. The local MySQL host (`localhost`) cannot be used by Render. Render generates `JWT_SECRET` for the service. Set `CLIENT_ORIGIN` to the exact Vercel site origin if its domain changes.

After the API deploys, set these production environment variables in Vercel and redeploy the frontend:

```env
VITE_API_MODE=server
VITE_API_URL=https://your-qodriva-api.onrender.com
```

The frontend sends credentialed requests to this API. Production auth cookies use `SameSite=None; Secure` for the cross-site Vercel-to-Render session, and the API only permits configured `CLIENT_ORIGIN` values. Judge0 must also use a public API URL; a localhost Judge0 URL only works from the developer machine. If no Judge0 service is configured, submissions remain disabled and return a configuration error.

## Code execution

In frontend-only mode, code execution is disabled; the editor and execution-result UI are previews only. User-submitted source code is never executed by the Express process. In server mode, submissions require a signed-in user. To enable isolated execution, configure a Judge0-compatible API in `server/.env` using the keys in `server/.env.example`:

```env
JUDGE0_API_URL=https://your-judge0-host
JUDGE0_API_KEY=
JUDGE0_API_HOST=
```

Use the Judge0 provider's API base URL for `JUDGE0_API_URL` (the server appends `/submissions`). `JUDGE0_API_KEY` and `JUDGE0_API_HOST` configure RapidAPI headers; `JUDGE0_AUTH_TOKEN` configures the Judge0 `X-Auth-Token` header. Set only the credential fields required by your provider. The server supports the asynchronous Judge0 submission-token flow and polls until execution completes. `JUDGE0_TIMEOUT_MS` controls the execution wait (1–120 seconds); `JUDGE0_POLL_INTERVAL_MS` controls polling cadence (100 ms–10 seconds). Check your provider's plan, language IDs, authentication headers, and request limits; API credentials must only be configured on the server and must never be placed in the React client.

Run executes the supplied standard input. Submit runs the problem's server-managed test cases; the client cannot supply the expected output. Accepted submissions update account-specific solved problems, difficulty counts, points, streak, and rank. Points are awarded once per problem (10 for Easy, 25 for Medium, 50 for Hard). The included problem set and tests are a learning/demo workflow, not production-grade hidden-test judging; test cases are limited and some problem input formats are simplified for this editor.

## Available API routes

- `GET /api/health` — service status and database/runner availability
- `POST /api/auth/register` — create account and sign in
- `POST /api/auth/login` — sign in with username or email
- `GET /api/auth/me` — get the current account plus solved IDs, difficulty breakdown, streak, daily challenge, and rank
- `POST /api/auth/logout` — clear the session cookie
- `GET /api/problems` — coding problem catalog (without expected answers)
- `GET /api/problems/:id` — get one coding problem by ID (without expected answers)
- `GET /api/leaderboard` — global ranking of registered accounts based on accepted solutions
- `POST /api/submissions` — execute code using configured Judge0 service (authentication required)
- `GET/POST/PUT/DELETE /api/users` — user CRUD routes (administrator required)

Weekly/monthly leaderboard periods, email verification, password reset, production-scale hidden test suites, and contest management are not implemented yet.
