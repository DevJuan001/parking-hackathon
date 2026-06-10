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

Write hooks call write services inside a `try` / `catch`. The service returns the backend body on success (shape `{ success: true, message: "..." }`) or an envelope `{ error, data: null }` on HTTP failure. The hook inspects `response.success` and falls back to a hardcoded Spanish message for both the `success !== true` branch and the `catch` block. The hook exposes `error` (the last set value) so the modal can render it.

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
        setError(
          "No se pudo completar la acción, intentalo nuevamente mas tarde.",
        );
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError("No se pudo completar la acción, intentalo nuevamente mas tarde.");
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleSubmit, handleChange, formData, loading, error };
}
```

For **create** hooks, drop `getChanges` and send `formData` as the full payload.

For **delete** hooks (e.g. `useDeleteSpot`), there is no form to validate. The hook receives `(e, openInnerModal, onClose)`, calls the service, and either calls `onClose()` on success or opens the inner error modal. The caller passes `onClose` as a prop that closes the outer modal.

### Two paths, every time

Every write hook follows the same shape. The hook does not read `response.error` to populate the message — it uses the hardcoded Spanish fallback for both the `success !== true` branch and the `catch` block. If you need the real backend message in the inner modal, the hook can `setError(response.error)` instead (see `useDeleteSpot` for the one place this is done today); the canonical example above keeps the fallback string for consistency with the other write hooks.

| Path | When | What the hook does |
|---|---|---|
| **Success** | `response.success === true` | Invalidate query + `openInnerModal("success", triggerButton)` (or `onClose()` for delete) |
| **Failure** | `response.success !== true` or `await` threw | `setError(<fallback en español>)` + `openInnerModal("error", triggerButton)` |

### Showing the error in the modal

The hook exposes `error` (the last set value). The modal threads it into the inner `ErrorModal`:

```jsx
{innerType === "error" && (
  <ErrorModal
    triggerRef={innerTrigger}
    isOpen={true}
    errorTitle="¡No se pudo editar la plaza!"
    errorText={error}
    confirmButtonText="Volver a intentarlo"
    onClose={() => openInnerModal(null)}
  />
)}
```

## Why no `useMutation`?

The rest of the app (`useLogin`, `useRecoverPassword`, `useUpdateCurrentUserInfo`, `useUpdateCurrentUserPassword`) uses plain `useState` + the service. Adding `useMutation` only for home introduces two patterns for the same job and forces the call site to handle `mutateAsync` vs the simpler `await service()`. Stay consistent — add `useMutation` only if a future feature genuinely needs its onMutate / onError ergonomics.

## Write services

Write services (`create<X>Service`, `update<X>Service`, `delete<X>Service`) read the response body first and then check `response.ok`. On HTTP failure they return `{ error, data: null }` so the hook never has to deal with a thrown `fetch` rejection. On success they return the raw backend body (typically `{ success: true, message: "..." }`).

```js
// src/modules/<name>/services/<action><Name>Service.js
import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function deleteSpotService(spot_id) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.spots}/delete/${spot_id}`,
    { method: "DELETE" },
  );

  const json = await response.json();

  if (!response.ok) {
    return { error: json.detail || "Error en la petición", data: null };
  }

  return json;
}
```

Rules:

- Always `await response.json()` first, then check `response.ok` — the body has the real error message.
- Fall back to a generic `"Error en la petición"` when the body is empty or has no `detail`.
- Return `{ error: ..., data: null }` on failure; return the raw `json` on success.
- The hook calls the service inside a `try` / `catch` and inspects `response.success === true`. See "Write hook" above.
- One file per action. Do not group multiple actions in a single barrel file.

## Cache invalidation

- After a successful create/update, call `queryClient.invalidateQueries({ queryKey: ["<name>"] })`. The next refetch (manual or interval) re-reads from the server.
- Don't optimistically patch the cache. The polling interval + invalidate is fast enough, and avoiding optimistic updates keeps the hook uniform with the rest of the codebase.
