# Ghar Tak

A hyperlocal services and delivery app where users discover stores, order products, and book services from their neighborhood.

## Run & Operate

- `pnpm --filter @workspace/ghar-tak run dev` — run the frontend (Vite dev server)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, wouter (routing), shadcn/ui components
- Auth: Firebase Auth (email/password)
- Theme: next-themes (dark/light mode)
- QR: html5-qrcode

## Where things live

- `apps/ghar-tak/` — React/Vite frontend (all UI lives here)
- `apps/ghar-tak/src/pages/` — page components (one per route)
- `apps/ghar-tak/src/components/` — shared UI components (shadcn/ui + custom)
- `apps/ghar-tak/src/hooks/` — React hooks (useAuth, use-toast, etc.)
- `apps/ghar-tak/src/lib/` — utilities and Firebase config
- `apps/ghar-tak/src/ai/flows/` — AI flow stubs (stubbed for client-side)
- `apps/ghar-tak/src/data/` — mock data (stores, services, products)
- `apps/ghar-tak/src/index.css` — Tailwind v4 theme vars (HSL color tokens)

## Architecture decisions

- Next.js → Vite migration: replaced `next/link` with wouter `Link`, `useRouter`/`useSearchParams` with wouter hooks, `next/image` with `<img>`, removed `'use client'` directives
- Firebase env vars renamed from `NEXT_PUBLIC_FIREBASE_*` to `VITE_FIREBASE_*`
- Genkit AI server flows (`'use server'`) stubbed as no-op async functions — AI features need a backend to work
- Firebase initializes with placeholder config if env vars are missing, so the app loads without crashing
- Dynamic routes (stores/[id], services/[category]) implemented with wouter params pattern

## Product

- **Home**: Hero search, AI-powered product search, category navigation, "Just For You" recommendations
- **Stores**: Browse all local stores with filtering, favorites
- **Services**: Browse service categories (Plumbers, Cleaners, etc.)
- **Search**: Full-text and image-based search results
- **Auth**: Email/password sign in and sign up via Firebase
- **Profile**: User account management
- **Dashboard**: Provider dashboard for managing listings
- **QR Scanner**: Scan QR codes to navigate to stores/products
- **Image Analyzer**: AI image search (requires backend AI flow)
- **Dark mode**: Full dark/light theme toggle

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Firebase requires `VITE_FIREBASE_API_KEY` and other `VITE_FIREBASE_*` env vars to be set for auth to work. Without them the app loads but sign in/out will fail.
- AI flows in `src/ai/flows/` are stubbed — they return empty/placeholder responses. To enable real AI, connect them to a backend API.
- The app uses Tailwind v4 — do NOT add a `postcss.config.mjs` (it conflicts with `@tailwindcss/vite` plugin).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
