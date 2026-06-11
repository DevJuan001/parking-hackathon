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

## Read with filters (filterable list page)

When a list page needs date / status / foreign-key filters, the read hook owns the filter state, bakes it into the `queryKey`, and passes the object to the service. The service serializes the object into a query string. The page passes `filters` + `setFilters` down to the FilterModal so the modal is a controlled view over the same state — no local copy.

```js
// src/modules/<name>/hooks/use<X>.js
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAll<X>Service } from "../services/getAll<X>Service";

export function use<X>() {
  const [filters, setFilters] = useState({
    // seed with the filterable fields the backend accepts, all as strings
    plate_id: "",
    start_date: "",
    end_date: "",
  });

  const query = useQuery({
    queryKey: ["<name>", filters],
    queryFn: () => getAll<X>Service(filters),
    refetchInterval: 25_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });

  return {
    items: query.data?.data ?? [],
    loading: query.isLoading,
    error: query.error,
    filters,
    setFilters,
  };
}
```

```js
// src/modules/<name>/services/getAll<X>Service.js
import { apiRoutes } from "../../../config/apiRoutes";
import { buildQueryParams } from "../../../utils/buildQueryParams";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAll<X>Service(filters) {
  const params = buildQueryParams(filters);

  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.<name>}/?${params}`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener los <items>");
  }

  return await response.json();
}
```

Three rules:

1. **Filters live in the read hook**, not in the FilterModal. The modal is a controlled view — it reads `filters` and calls `setFilters`. No `useState` inside the modal.
2. **`queryKey: ["<name>", filters]`** — putting `filters` in the key is what triggers the refetch. `useQuery` deep-compares, so editing a single field changes the key and forces a re-fetch.
3. **`buildQueryParams(filters)` drops empty values**, so an all-empty filter object produces `?...` with no params (equivalent to no filter at all). Don't pre-filter the object in the hook.

### FilterModal contract (shared global)

`src/globals/components/modals/FilterModal.jsx` is the shared shell for filterable list pages. It always renders the date range (`start_date` / `end_date` via `DateField`), accepts a `children` slot for module-specific selects, and exposes apply + clean actions. Each feature module wraps it with its own selects and wires the apply/clean callbacks.

| Prop | Type | Notes |
|---|---|---|
| `orderByStartDateValue` | `string` | `filters.start_date`, or empty / placeholder |
| `orderByStartDateOnChange` | `(e) => void` | Receives the event from the `DateField` named `start_date`; the hook's `handleChange` works because the field's `name` matches the filter key |
| `orderByFinishDateValue` | `string` | `filters.end_date` |
| `orderByFinishDateOnChange` | `(e) => void` | Same, named `end_date` |
| `fieldName` | `string` | Label for the date section ("Creación" by default, could be "Ingreso", "Movimiento", etc.) |
| `children` | `ReactNode` | Module-specific selects (plate, role, status, etc.). Each select uses the shared `handleChange` from `useFilter<X>` so the `name` prop on the select matches the filter key |
| `seeCleanFiltersButton` | `boolean` | Show the "Limpiar filtros" button. Set to `Object.keys(filters).length > 0` (i.e. only when at least one filter is active) |
| `cleanFiltersOnClick` | `() => void` | Resets `filters` to `{}` and closes the modal |
| `applyButtonOnClick` | `() => void` | Triggers a refetch by re-setting `filters` to a fresh object (React Query compares by reference) and closes the modal |

The `applyButtonOnClick` is the key bit: just `setFilters({ ...filters })` is enough to force a re-render and trigger React Query to re-run the queryFn, because the new object reference changes the `queryKey`. The `cleanFiltersOnClick` calls `setFilters({})` to clear.

### The `useFilter<X>` wrapper hook

Tiny hook that just wraps `setFilters` in a stable `handleChange`. The page calls it once and passes the result to the FilterModal children.

```js
// src/modules/<name>/hooks/useFilter<X>.js
export function useFilter<X>(setFilters) {
  function handleChange(e) {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  return { handleChange };
}
```

The `useFilter<X>` hook is **not** the same as the read hook. The read hook (`use<X>`) owns the state; `useFilter<X>` just produces a stable `handleChange` for the FilterModal children to use. Pass the **read hook's** `setFilters` into `useFilter<X>` so they share state.

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
        await queryClient.invalidateQueries({ queryKey: ["<relatedQueries>"] });
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

For **create** hooks, drop `getChanges` and send `formData` as the full payload (no `Number(...)` coercion — see "Raw form data, no coercion" below).

For **delete** hooks (e.g. `useDeleteSpot`), there is no form to validate. The hook receives `(e, openInnerModal, onClose)`, calls the service, and either calls `onClose()` on success or opens the inner error modal. The caller passes `onClose` as a prop that closes the outer modal.

### Raw form data, no coercion

The hook sends the form **as the user typed it** — every `value` is a string (because `FormField` and `SelectMenu` are uncontrolled HTML inputs). The hook does **not** call `Number(form.role_id)` or `parseInt(...)` to "fix" the shape before sending. The backend accepts the strings (or coerces them itself) and returns the real error if anything is off. If you find yourself reaching for `Number(...)` in a write hook, stop — the value is fine as a string.

### Invalidate all related queries, not just the obvious one

A single write can change the shape of more than one cached query. After a successful create / update / delete, invalidate **every** query whose result the write could have touched. Two rules:

- The main list query (e.g. `["users"]`) — always.
- Any aggregate / detail / count query that depends on the same records (e.g. `["userStats"]` for totals, `["userById", id]` for the detail view).

Example for `useCreateUser` / `useUpdateUser`:

```js
await queryClient.invalidateQueries({ queryKey: ["users"] });
await queryClient.invalidateQueries({ queryKey: ["userStats"] });
```

Do not try to be clever with partial invalidation by mutating the cache — the polling interval + invalidate is fast enough, and full invalidation is uniform across the codebase.

### Two paths, every time

Every write hook follows the same shape. The hook does not read `response.error` to populate the message — it uses the hardcoded Spanish fallback for both the `success !== true` branch and the `catch` block. If you need the real backend message in the inner modal, the hook can `setError(response.error)` instead (see `useDeleteSpot` for the one place this is done today); the canonical example above keeps the fallback string for consistency with the other write hooks.

| Path | When | What the hook does |
|---|---|---|
| **Success** | `response.success === true` | Invalidate all related queries + `openInnerModal("success", triggerButton)` (or `onClose()` for delete) |
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
