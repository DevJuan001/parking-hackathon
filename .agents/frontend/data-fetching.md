# Data Fetching

Canonical patterns for the three server-state situations in this codebase: reads with `@tanstack/react-query`, plain-`useState` write hooks, and periodic polling. **No `useMutation`** — write hooks follow the same shape as `useUpdateCurrentUserInfo`.

## Read with React Query (no polling)

```js
// src/modules/<name>/hooks/use<Name>.js
import { useQuery } from "@tanstack/react-query";
import { get<Name>Service } from "../services/get<Name>Service";

export function use<Name>() {
  const query = useQuery({
    queryKey: ["<name>"],
    queryFn: get<Name>Service,
    staleTime: 1000 * 60 * 60, // 1h, matches useCurrentUser
  });

  return {
    data: query.data?.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

`query.data?.data` mirrors the backend envelope (`{ data: ... }`) and the `useCurrentUser` pattern.

## Read with polling

Add three options to `useQuery`:

```js
useQuery({
  queryKey: ["parkingSpots"],
  queryFn: getAllSpotsService,
  refetchInterval: 25_000,             // ms; 25s
  refetchIntervalInBackground: false,  // pause when tab hidden
  refetchOnWindowFocus: true,          // catch up on focus
  staleTime: 10_000,                   // < refetchInterval
});
```

- `refetchIntervalInBackground: false` keeps us friendly to the 30 req/min rate limit when the user is on another tab.
- `staleTime: 10_000` (10s) prevents duplicate fetches when a mutation invalidates right before the next interval tick.
- On error, React Query keeps `data` populated with the last successful response — no UI overlay, no toast, no flicker. Surface the error in dev only.

## Write hook (no `useMutation`)

Follow the exact shape of `src/globals/hooks/useUpdateCurrentUserInfo.js`. It works for create and update.

```js
// src/modules/<name>/hooks/useUpdate<X>.js
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { update<X>Service } from "../services/update<X>Service";

export function useUpdate<X>(original) {
  const [formData, setFormData] = useState({ /* seed from `original` */ });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { validate, getChanges } = useFormValidation();

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();
    const triggerButton = getModalTrigger(e);

    if (!validate(formData)) {
      openInnerModal("error", triggerButton);
      return;
    }

    const changes = getChanges(original, formData);
    if (Object.keys(changes).length === 0) {
      openInnerModal("error", triggerButton);
      return;
    }

    setLoading(true);
    try {
      const response = await update<X>Service(original.id, changes);
      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["<name>"] });
        openInnerModal("success", triggerButton);
      } else {
        openInnerModal("error", triggerButton);
      }
    } catch (error) {
      openInnerModal("error", triggerButton);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { handleSubmit, handleChange, formData, loading, error };
}
```

For **create** hooks, drop `getChanges` and send `formData` as the full payload.

## Why no `useMutation`?

The rest of the app (`useLogin`, `useRecoverPassword`, `useUpdateCurrentUserInfo`, `useUpdateCurrentUserPassword`) uses plain `useState` + the service. Adding `useMutation` only for home introduces two patterns for the same job and forces the call site to handle `mutateAsync` vs the simpler `await service()`. Stay consistent — add `useMutation` only if a future feature genuinely needs its onMutate / onError ergonomics.

## Cache invalidation

- After a successful create/update, call `queryClient.invalidateQueries({ queryKey: ["<name>"] })`. The next refetch (manual or interval) re-reads from the server.
- Don't optimistically patch the cache. The polling interval + invalidate is fast enough, and avoiding optimistic updates keeps the hook uniform with the rest of the codebase.
