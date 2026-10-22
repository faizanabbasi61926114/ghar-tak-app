---
name: Clerk web-to-API auth path
description: How the web app authenticates to the API server — cookie-based, no bearer token; verified e2e.
---

The web app authenticates API calls via the same-origin Clerk `__session` cookie, NOT a bearer token.

**Why:** Web and API share one origin behind the path-routing proxy, so the browser attaches Clerk's first-party `__session` cookie to relative `/api/...` fetches automatically. `@clerk/express` `clerkMiddleware` on the API server verifies it. The api-client's `setAuthTokenGetter` is exclusively for the Expo/mobile bundle (its own docstring says never use it on web). The Clerk FAPI proxy middleware is production-only; in development cookies still work because Clerk sets `__session` first-party on the app origin.

**How to apply:** If a review or debugging session claims web requests are unauthenticated because "no Authorization header is sent," check for the `__session` cookie first — this exact false positive already happened once. Verified e2e (programmatic Clerk sign-in): `/api/providers/me` → 404 pre-registration (not 401), `POST /api/providers` → 201, product create → 201. Only wire a token getter for non-browser or cross-origin clients.
