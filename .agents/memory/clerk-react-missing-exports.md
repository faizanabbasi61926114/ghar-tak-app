---
name: Clerk React missing exports
description: The installed @clerk/react version does not export SignedIn/SignedOut/Show
---

The `@clerk/react` package installed in this project does **not** export `SignedIn`, `SignedOut`, or `Show` components.

**Why:** The installed version predates those exports being part of the public API.

**How to apply:** Always use `useUser()` for auth state and render conditionally:

```tsx
const { user } = useUser();
// instead of <SignedIn> ... </SignedIn>
{user && <AuthenticatedContent />}
// instead of <SignedOut> ... </SignedOut>
{!user && <UnauthenticatedContent />}
```

`useClerk()` is available for `signOut()` and other imperative actions.
