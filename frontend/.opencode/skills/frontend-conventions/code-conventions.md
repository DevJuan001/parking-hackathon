# Code conventions

> Naming, component/hook/service patterns, imports, accessibility, and what to avoid.
> Read alongside `SKILL.md` (workflow), `architecture.md` (layout + modal system), and `design-system.md` (visual tokens).

---

## 1. Naming

| Thing              | Convention                                              | Example                                  |
| ------------------ | ------------------------------------------------------- | ---------------------------------------- |
| Components         | `PascalCase.jsx`, **default export**                    | `NavItem.jsx`, `ConfirmCancelButtons.jsx`|
| Hooks              | `useCamelCase.js`, **named export** (`export function`) | `useCurrentUser.js`, `useFlipModal.js`   |
| Services           | `camelCaseService.js`, **named export async function**  | `loginService.js`, `logoutService.js`    |
| Constants files    | `camelCase.js`, **named exports**                       | `asideMenuItems.js`, `modalStyles.js`    |
| Utilities          | `camelCase.js`, **named export**                        | `fetchWithAuth.js`                       |
| Pages              | `PascalCasePage.jsx`, default export                    | `HomePage.jsx`, `LoginPage.jsx`          |
| Modal root wrapper | `<ComponentName />` (e.g. `SuccessModal`, `ErrorModal`) | —                                        |
| Inner modal `type` | lowercase string                                        | `"calendar"`, `"menu"`, `"error"`        |
| Roles              | `PascalCase` strings                                    | `"Admin"`, `"Operator"`                  |

Avoid barrel `index.js` files. Always import from the concrete file.

---

## 2. Components

### 2.1 Shape

- **Function components** with **default export**. No `React.FC`.
- Props are **destructured** with sensible defaults.
- Wrap the JSX in a **single top-level element** with the component's primary className.
- Use the `className` prop pattern: append `${className ?? "<default classes>"}` to let callers extend.

```jsx
export default function FormField({
  value,
  labelText,
  id,
  type = "text",
  className,
}) {
  return (
    <div className={`relative flex w-full ... ${className ?? "shadow-sm"}`}>
      ...
    </div>
  );
}
```

### 2.2 Buttons

- Native `<button>` (no custom `<Button>` wrapper).
- Always include `id` when the element is referenced by tests or by the Flip animation.
- The global rule `button { cursor: pointer; }` lives in `index.css` — do not re-declare `cursor-pointer` unless customizing the cursor.

### 2.3 Icons

Use the shared `<Icon />` component from `globals/components/ui/Icon.jsx`. **Never** inline a `<span class="material-symbols-rounded">` somewhere else — the central component sets `fontVariationSettings` and `--icon-weight`.

```jsx
<Icon name="add" size={22} fill={false} weight={500} className="dark:text-white" />
```

### 2.4 Loaders

- `<Loader invert />` for inline spinners (uses `animate-rotation`).
- `<Skeleton count height width ... />` for placeholder blocks.
- **Do not read `document` in render.** The current `Skeleton` does; if extending, prefer a `useTheme` hook reading from `document.documentElement` inside an `useEffect`.

### 2.5 Lists and keys

- `.map((item) => <Item key={item.id} ... />)` — always use a stable, unique key.

### 2.6 Form fields

Combine `FormField` / `DateField` / `SelectMenu` with `useFormValidation` (§5). The `fieldError(name)` helper returns a className string (red glow + `animate-shake` when invalid, `"shadow-sm"` otherwise). Always apply it.

---

## 3. Hooks

All hooks live in `globals/hooks/` (cross-module) or `<module>/hooks/` (module-specific).

```js
import { useState, useEffect, useCallback } from "react";

export function useSomething(initial = null) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    // side effects
  }, [value]);

  const doThing = useCallback(() => { ... }, []);

  return { value, setValue, doThing };
}
```

Rules:

- **Named export**, never default.
- File name and hook name share the `useXxx` prefix.
- Always **return an object** with explicit keys (not a positional tuple) so consumers destructure by name.
- Wrap event-driven callbacks in `useCallback` when passed to memoized children or used in `useEffect` deps.
- Side-effect hooks (`useEffect`) must list every reactive dep. If linting complains, fix the dep list — do not silence it.

### Existing hooks and their contracts

- `useTheme()` → `{ theme, setTheme }`. Persists in `localStorage` under `"theme"`, toggles `dark` class on `<html>`. Call once at the top of `App.jsx`.
- `useCurrentUser()` → `{ user, hasRole(roles), loading, error }`. Wraps `useQuery` with `queryKey: ["currentUser"]`, `staleTime: 1h`.
- `useLogout()` → `{ loading, error, logout() }`. Calls `logoutService`, clears the query cache, navigates to `/login` on success.
- `useModal()` → `{ modalType, isOpen, modalData, triggerRef, openModal(data, type, ref), closeModal() }`.
- `useInnerModal()` → `{ innerType, innerTrigger, openInnerModal(type, e), closeInnerModal() }`. Use for nested modals whose trigger lives inside a parent modal.
- `useFlipModal(...)` → internal to `<Modal />`. Do not call from page code.
- `useFormValidation(rules, optionalFields)` → `{ errors, validate(data), getChanges(orig, upd), clearError(name), clearErrors(), fieldError(name) }`. `fieldError` returns the Tailwind className string for the input.

---

## 4. Services

```js
import { apiRoutes } from "../../config/apiRoutes";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

export async function loginService(form) {
  const res = await fetch(`${apiRoutes.apiUrl}${apiRoutes.auth}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  if (!res.ok) throw new Error("Credenciales Invalidas");

  return await res.json();
}
```

Rules:

- **Named export**, `async function` named `<thing>Service`.
- Always build the URL as `` `${apiRoutes.apiUrl}${apiRoutes.<area>}/<endpoint>` ``. Never hardcode `localhost` or absolute paths.
- `credentials: "include"` on every call so httpOnly cookies travel.
- For **authenticated** requests, use `fetchWithAuth(url, options)` (handles 401 → refresh → retry automatically).
- For **public** requests (login, refresh), use raw `fetch` (refresh is intentionally outside `fetchWithAuth` to avoid recursion).
- Throw a **Spanish, user-readable** `Error` message on non-2xx. Callers surface it via `openModal(null, "error", ...)`.
- Return the parsed JSON directly (or the backend's `{ success, data, ... }` wrapper).

### `apiRoutes` shape

```js
export const apiRoutes = {
  apiUrl: import.meta.env.VITE_API_URL,
  auth: "/auth",
  users: "/users",
  // ...
};
```

When adding a new endpoint area, **add the path constant here** first, then write the service.

---

## 5. Forms with `useFormValidation`

```jsx
const { validate, fieldError, clearError } = useFormValidation({
  email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Email inválido"),
  password: (v) => (v.length >= 6 ? null : "Mínimo 6 caracteres"),
}, ["optionalField"]);

function handleSubmit(e) {
  e.preventDefault();
  if (!validate(form)) return;
  // ...
}

<input className={fieldError("email")} ... />
```

- `validate(data)` returns `true` if there are no errors, `false` otherwise. Always check the return value before submitting.
- `getChanges(original, updated)` returns a diff object — use it for PATCH endpoints.
- `clearError(name)` and `clearErrors()` are imperative helpers; call them on input change / successful submit.
- Validation messages are user-facing: write them in Spanish.

---

## 6. Imports and module conventions

- **Relative imports only.** No `@/`, no aliases.
- Order: external → `@tanstack`, `gsap`, `react`, `react-router-dom` → internal `../../globals/...` → relative. Group with blank lines; no linter-enforced order yet.
- No `React.` namespace imports — use the named hooks (`useState`, `useEffect`, `useCallback`, `useId`, `useRef`).
- A component used in a single module lives in `modules/<area>/components/`. A component reused across modules lives in `globals/components/`.
- Page-level components import from `globals/` only; they do not import from sibling modules.

---

## 7. Accessibility and UX defaults

- Always provide `htmlFor` on labels and `id` on the matching input/button.
- Modals: include a visible close affordance. The `Modal` header does this automatically unless the `type` is in `["calendar", "select", "menu", "editStatus"]` — in that case, supply your own.
- Trapping focus inside modals is **not** implemented yet. When you add it, do it inside `<Modal />` so all modal types benefit.
- Empty states: when a list is empty, render an inline message with an icon (see `SelectMenu`'s "No se encontraron resultados" pattern).
- For destructive actions (delete, logout), prefer a confirmation modal (`AddInnerModal` + `ConfirmCancelButtons`).

---

## 8. Things to avoid

- **No barrel `index.js` files** — import from concrete paths.
- **No class components.**
- **No inline `style={{...}}` for things Tailwind can express** (color, padding, etc.). Inline `style` is OK for **dynamic numeric values** (e.g. `width` from a prop, Flip-set transforms, computed pixel positions).
- **No hardcoded API URLs** — use `apiRoutes`.
- **No new `fetch` calls outside `services/` or `utils/fetchWithAuth.js`.** Page code calls services; services call fetch.
- **No duplicate dark-mode logic** — rely on `useTheme()` + the `dark:` variant.
- **No bespoke modal portals** — always go through `<Modal />`.
- **No emojis in code, comments, or commit messages** unless the user explicitly asks for them.
- **No comments in code** unless the user explicitly asks for them. The block comments inside `useFlipModal.js` are an inherited exception (they document tricky GSAP timing).
- **No `any`-like escape hatches in TS** (n/a today, but if you add TypeScript later).
- **Do not silence ESLint rules** to make code pass — fix the underlying issue.
