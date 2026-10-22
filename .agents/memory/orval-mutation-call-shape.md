---
name: Orval mutation call shape
description: How to pass path params vs body in orval-generated mutation hooks
---

When orval generates a mutation that takes a path param (e.g. `providerId`, `productId`, `serviceId`, `orderId`) plus a request body, the generated type is:

```ts
{ providerId: string; data: BodyType<CreateProductRequest> }
```

So `mutate()` must be called with the path param as a **sibling** of `data`, never nested inside `data`:

```ts
// CORRECT
createMutation.mutate({ providerId, data: { name, price, ... } });

// WRONG — will silently 404 because providerId isn't used as the URL segment
createMutation.mutate({ data: { providerId, name, price, ... } });
```

**Why:** Orval injects path params directly into the URL; the `data` field maps to the request body only.

**How to apply:** Any time you call a create/update/delete mutation, check the generated type signature first to confirm which fields are path params vs body fields.
