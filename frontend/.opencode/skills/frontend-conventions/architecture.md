# Architecture

> Stack, folder layout, routing, modal system, auth flow, and cross-module patterns.
> Read alongside `SKILL.md` (workflow) and `code-conventions.md` (naming + component rules).

---

## 1. Stack

| Concern              | Choice                                                                 |
| -------------------- | ---------------------------------------------------------------------- |
| Framework            | **React 19** + **Vite 8**                                             |
| Routing              | **React Router 7**                                                    |
| Styling              | **Tailwind CSS v4** (CSS-first config via `@theme` in `index.css`)     |
| Server state         | **TanStack Query v5**                                                 |
| Animations (modals)  | **GSAP 3** + **Flip** plugin (only inside `<Modal />`)                 |
| Icons                | `material-symbols/rounded.css` via the shared `<Icon />` component    |
| Lint                 | ESLint flat config (`@eslint/js` + `react-hooks` + `react-refresh`)    |
| Package manager      | **pnpm** workspace, install from `frontend/`                          |
| Import alias         | **None.** Always relative paths.                                      |

---

## 2. Folder layout

```
src/
├── main.jsx                       # React root; mounts <App/>; wraps QueryClientProvider
├── App.jsx                        # BrowserRouter; useTheme(); <div id="modal-root"/>
│
├── config/
│   └── apiRoutes.js               # API base URL + endpoint path constants
│
├── utils/
│   └── fetchWithAuth.js           # fetch wrapper: 401 → refresh → retry (singleton refresh)
│
├── globals/                       # Cross-module code (used by 2+ modules)
│   ├── components/
│   │   ├── Layout/                # App shell: Layout, aside/{Aside, Navbar, NavItem, AvatarButton, NavbarMenuModal}
│   │   ├── modals/                # Modal + specialized wrappers
│   │   └── ui/                    # Generic presentational: Icon, Loader, Skeleton, FormField, ...
│   ├── constants/                 # asideMenuItems, modalStyles, ...
│   ├── hooks/                     # Cross-module hooks (useTheme, useCurrentUser, useModal, ...)
│   ├── services/                  # Cross-module API callers
│   └── styles/
│       ├── index.css              # @imports, Tailwind @theme, dark variant
│       └── transitions.css        # @keyframes
│
├── modules/                       # One folder per route/domain
│   ├── home/                      # HomePage.jsx (+ optional components/, hooks/, services/)
│   ├── login/                     # LoginPage.jsx, components/{modals,ui}/, hooks/, services/
│   ├── users/, parking/, tariffs/, entries/, exits/
│
└── router/
    ├── AppRouter.jsx
    ├── ProtectedRoutes.jsx
    └── constants/routesConfig.js
```

**Placement rules:**

- Used by **2+ modules** → `globals/`. Used by 1 → keep inside the module.
- A module that owns its own sub-files mirrors the layout: `components/{modals,ui}`, `hooks`, `services`.
- `config/` is build-time constants (env vars). `globals/constants/` is runtime constants.
- `utils/` = pure functions, no React. `globals/hooks/` = React hooks.

**No barrel `index.js` files.** Import from the concrete file.

---

## 3. Entry points

### `main.jsx`

Mounts the root, wraps with `QueryClientProvider`, imports the global stylesheet once.

### `App.jsx`

- Calls `useTheme()` once at the top so the `<html>` class is in sync on first render.
- Provides `<BrowserRouter>`.
- Reserves `<div id="modal-root" />` for `createPortal` from `<Modal />`.
- Wraps the page background: `w-screen h-screen bg-[#FBF9FC] dark:bg-[#0a0a0a]`.

### Adding a new page

1. Create `src/modules/<area>/<Area>Page.jsx` (default export).
2. Register it in `src/router/constants/routesConfig.js` with its `roles`.
3. Add a matching nav item in `src/globals/constants/asideMenuItems.js` with the same `roles`.

---

## 4. Routing and permissions

`src/router/constants/routesConfig.js` is the **single source of truth** for protected routes:

```js
export const routesConfig = [
  { path: "/home",    component: HomePage,    roles: ["Admin"] },
  { path: "/users",   component: UsersPage,   roles: ["Admin"] },
  // ...
];
```

`<AppRouter />` maps the array to nested routes under `<ProtectedRoutes roles={roles} />`. `ProtectedRoutes`:

1. Calls `useCurrentUser()`.
2. While `loading`, returns `null` (intentional — no spinner, avoids layout shift).
3. On `error` or `!hasRole(roles)` → `<Navigate to="/login" replace />`.
4. Otherwise renders `<Outlet />`.

`hasRole(roles)` accepts a string or an array. Keep `routesConfig.roles` and `asideMenuItems[].roles` aligned for the same area.

Wildcard route: `<Route path="*" element={<Navigate to="/login" />} />` — any unknown path sends the user to login.

---

## 5. Auth flow

### `utils/fetchWithAuth.js`

- Wraps `fetch` with `credentials: "include"` so httpOnly cookies travel.
- On `401`, calls `${apiRoutes.apiUrl}${apiRoutes.auth}/refresh` **once** (singleton via module-scoped `isRefreshing` + `refreshPromise`).
- On successful refresh, retries the original request once and returns its response.
- On refresh failure, redirects to `/login` via `window.location.href` (full reload to clear in-memory state).

**Critical:** `/auth/refresh` and `/auth/login` are called with raw `fetch` (not `fetchWithAuth`) to avoid recursion.

### `services/`

- One file per operation, named `<operation>Service.js`.
- `export async function <operation>Service(...args) { ... }`.
- URL: `` `${apiRoutes.apiUrl}${apiRoutes.<area>}/<endpoint>` ``.
- Throw a **Spanish, user-readable** `Error` on non-2xx.
- Return the parsed JSON (or the backend's `{ success, data, ... }` wrapper).

### Auth-adjacent hooks

- `useCurrentUser()` → `{ user, hasRole(roles), loading, error }`. Wraps `useQuery({ queryKey: ["currentUser"], staleTime: 1h })`.
- `useLogout()` → `{ loading, error, logout() }`. Calls `logoutService`, clears the query cache with `queryClient.clear()`, navigates to `/login` on success.

---

## 6. Modal system (three layers)

| Layer      | Hook                | Purpose                                                                |
| ---------- | ------------------- | ---------------------------------------------------------------------- |
| Page-level | `useModal()`        | One per page; holds `{ modalType, isOpen, modalData, triggerRef }`.    |
| Nested     | `useInnerModal()`   | Popovers/menus that depend on a trigger inside an already-open modal.  |
| Animation  | `useFlipModal()`    | **Internal to `<Modal />`.** Do not call from page code.               |

### `useModal()` contract

```js
const { modalType, isOpen, modalData, triggerRef, openModal, closeModal } = useModal();
```

- `openModal(data, type, ref)`: `data` is a payload (often `null`), `type` is a string, `ref` is the trigger DOM element. Pass `e.currentTarget` when you have an event. If you don't, pass `null` and the modal will open in `center` (the `Modal` itself forces `location: "center"` for `type === "user" || "help"`).
- `closeModal()` resets every field.

### `<Modal />` contract

`src/globals/components/modals/Modal.jsx`:

- Renders into `#modal-root` via `createPortal`.
- Locks body scroll while open (`document.body.style.overflow = "clip"`) and restores on close/unmount.
- Closes on overlay click unless `disableClose` is set.
- For `type` in `["calendar", "select", "menu", "editStatus"]` it **omits** the default header (title + close X). Supply your own header in the body.
- Wraps children and injects `onClose={closeModal}` into any direct child that does not already define its own `isOpen`.

Props: `isOpen`, `type`, `triggerRef`, `z_index` (default `"50"`), `location` (`"anchored" | "center"`), `growDirection` (default `"bottom-right"`), `title`, `children`, `onClose`, `disableClose`.

`growDirection` tells the Flip animation which corner of the trigger to morph from. Options: `"top-left" | "top-right" | "bottom-left" | "bottom-right" | "bottom-center"` (and a few more — see `useFlipModal.js`).

### Specialized modals (build on top of `<Modal />`)

- `AddInnerModal` — center, `z_index: 150`. Use for confirmation flows nested in a parent modal.
- `SuccessModal` — center, `z_index: 300`. Green check + `ConfirmCancelButtons`.
- `ErrorModal` (login module) — center. Red close icon + single "Ok" button. Uses `animate-blurUp`.
- `ConfirmCancelButtons` — two-button row with customizable confirm/cancel labels, colors, and flex direction.

### Inner modals (use `useInnerModal`)

```jsx
const { innerType, innerTrigger, openInnerModal } = useInnerModal();

<button onClick={(e) => openInnerModal("menu", e)}>...</button>

{innerType === "menu" && <MyInnerModal triggerRef={innerTrigger} ... />}
```

Use this when the trigger lives inside a parent modal (e.g. a button inside `NavbarMenuModal`) so you don't fight the parent `useModal` state.

---

## 7. Server state with TanStack Query

- `QueryClient` is created once in `main.jsx`.
- Auth-scoped data uses a single, stable `queryKey` (e.g. `["currentUser"]`).
- Use `staleTime` to avoid unnecessary refetches (`useCurrentUser` uses `1h`).
- Mutations aren't abstracted into a custom hook yet — when you add one, colocate the hook in `globals/hooks/` if cross-module, otherwise in the module.

---

## 8. Where to add what (quick lookup)

| I need to add...                | Goes in...                                                   |
| ------------------------------- | ------------------------------------------------------------ |
| A new protected page            | `src/modules/<area>/<Area>Page.jsx` + `routesConfig.js` + `asideMenuItems.js` |
| A new cross-module component    | `src/globals/components/{ui,modals}/`                        |
| A reusable input/button/pill    | `src/globals/components/ui/`                                 |
| A new modal                     | `src/globals/components/modals/` (specialized) or inline in the page (one-off) |
| A new cross-module hook         | `src/globals/hooks/useXxx.js`                                |
| A new API endpoint              | `src/config/apiRoutes.js` first, then `src/globals/services/<thing>Service.js` (or `modules/<area>/services/`) |
| A new animation keyframe        | `@keyframes` in `transitions.css` + `--animate-*` token in `@theme` |
| A new dark/light color used 3+ times | Token in `@theme` (`--color-*`) + utility class      |
| A new role                      | Add the string to `routesConfig.roles` and `asideMenuItems[].roles` for every area that should be reachable |
