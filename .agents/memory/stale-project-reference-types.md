---
name: Stale TS project-reference types
description: Phantom "no exported member" TS errors from @workspace/* libs while the app runs fine
---

In this pnpm monorepo, TypeScript resolves `@workspace/*` imports against each lib's built `dist/` (project references), not its source. If a lib changed but wasn't rebuilt, `tsc` reports phantom errors like "Module '@workspace/api-zod' has no exported member 'X'" while the app runs fine (vite/esbuild bundle from source).

**Why:** Wasted debugging time chasing "missing exports" that existed in source all along.

**How to apply:** Before trusting cross-package type errors, rebuild the lib dists first (`npx tsc -b lib/<changed-libs>`), then re-run the app typecheck — only errors that survive are real.
