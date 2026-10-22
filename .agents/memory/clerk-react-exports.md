---
name: Clerk React export list
description: What @clerk/react actually exports — useful for avoiding broken imports
---

The version of `@clerk/react` in this project does NOT export:
- `SignedIn` — use `{user && ...}` (via `useUser()`)
- `SignedOut` — use `{!user && ...}` (via `useUser()`)
- `Show` — does not exist

**What it does export (auth-related):**
`ClerkProvider`, `SignIn`, `SignUp`, `SignInButton`, `SignUpButton`, `SignOutButton`,
`UserButton`, `UserAvatar`, `UserProfile`,
`useUser`, `useClerk`, `useAuth`, `useSignIn`, `useSignUp`,
`RedirectToSignIn`, `RedirectToSignUp`, `RedirectToUserProfile`,
`ClerkLoaded`, `ClerkLoading`, `ClerkDegraded`, `ClerkFailed`,
`AuthenticateWithRedirectCallback`, `OAuthConsent`, `useOAuthConsent`, `useReverification`

**Pattern for conditional auth rendering:**
\`\`\`tsx
import { useUser } from '@clerk/react';
const { user, isLoaded } = useUser();
// Signed in:  {user && <Component />}
// Signed out: {!user && <Component />}
// Loading:    {!isLoaded && <Spinner />}
\`\`\`

**`useToast` lives at `@/hooks/use-toast`**, not `@/components/ui/toaster`.

**Why:** The installed package predates the export of `SignedIn`/`SignedOut` as named components; use hook-based conditional rendering instead.
