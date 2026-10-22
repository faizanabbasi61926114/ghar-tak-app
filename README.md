# Ghar Tak

Neighborhood marketplace for Pakistan: local stores (quick-commerce), home services (booking, verified pros), orders, reviews, and provider dashboards.

## What's in the repo

| Path | App | Runs at |
| --- | --- | --- |
| `apps/ghar-tak` | Customer web app (React 19, Vite, Tailwind v4) | http://localhost:3000 |
| `apps/api-server` | Express API (port from `API_PORT`) | http://localhost:8000 |
| `packages/db` | Drizzle ORM schema, push + seed scripts | — |
| `packages/api-spec` | OpenAPI spec (source for generated client) | — |
| `packages/api-client-react` | Generated React Query API hooks | — |

## Prerequisites

- **Node.js 20+**
- **pnpm 10+** (`npm install` / `yarn` are blocked by a preinstall guard)
- **PostgreSQL** database (Neon, Supabase, or local)
- **Clerk** account (publishable + secret keys)

## 1. Install dependencies

```bash
pnpm install
```

## 2. Create `.env` at the repo root

Both the web app and the API read from the root `.env`.

```ini
NODE_ENV=development
PORT=3000
API_PORT=8000
BASE_PATH=/

# Database (required)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Clerk (required) — both keys from the same Clerk application
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Optional — AI "search by image" on the search bar
AI_INTEGRATIONS_OPENAI_BASE_URL=
AI_INTEGRATIONS_OPENAI_API_KEY=

# Optional — store maps
VITE_GOOGLE_MAPS_API_KEY=
VITE_GOOGLE_MAPS_MAP_ID=
```

> `.env` is gitignored. Never commit real keys.

## 3. Prepare the database

```bash
pnpm --filter @workspace/db push-force
pnpm --filter @workspace/db seed
```

`push-force` applies the Drizzle schema; `seed` inserts demo stores, services, products, reviews, orders, bookings, and coupons (safe to re-run).

If drizzle-kit reports `DATABASE_URL, ensure the database is provisioned`, point it at the root env explicitly:

```bash
DOTENV_CONFIG_PATH="$PWD/.env" pnpm --filter @workspace/db push-force
```

Windows PowerShell equivalent:

```powershell
$env:DOTENV_CONFIG_PATH="$PWD\.env"; pnpm --filter @workspace/db push-force
```

## 4. Run it in the browser

Use two terminals from the repo root.

**Terminal 1 — API server:**

```bash
pnpm --filter @workspace/api-server dev
```

Wait for `Server listening` on port 8000.

**Terminal 2 — web app:**

```bash
pnpm --filter @workspace/ghar-tak dev
```

Then open **http://localhost:3000**.

The Vite dev server proxies `/api` to `http://localhost:8000`, so no CORS setup is needed. Sign up / sign in with Clerk, then browse stores, order products, and book services.

## Useful commands

```bash
pnpm typecheck                                        # all packages + apps
pnpm build                                            # typecheck + production builds
pnpm --filter @workspace/api-spec run codegen         # regenerate API hooks after editing openapi.yaml
pnpm --filter @workspace/db exec tsc -p tsconfig.json # rebuild db package types
```

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Use pnpm instead` on install | Use `pnpm install`, not npm/yarn. |
| API responds 401 | Sign in through the web UI; Clerk keys must belong to the same instance. |
| `DATABASE_URL` missing during db scripts | Prefix with `DOTENV_CONFIG_PATH="$PWD/.env"` (see step 3). |
| Port already in use | Change `PORT` or `API_PORT` in `.env`, then restart both servers. |
| API type errors mentioning missing columns | Rebuild db types: `pnpm --filter @workspace/db exec tsc -p tsconfig.json`. |
