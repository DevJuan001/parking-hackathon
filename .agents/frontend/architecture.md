# Architecture

The frontend follows a **module-first structure** with shared UI components. Everything lives under `src/`.

## Folder layout

```
src/
├── globals/
│   ├── components/
│   │   └── ui/          # Shared UI kit (Button, Input, Modal, etc.)
│   ├── styles/          # Global CSS, variables, reset
│   └── utils/           # Shared helpers (formatters, validators)
│
├── modules/              # Feature-based modules
│   └── <name>/
│       ├── components/  # Feature-specific components (not shared)
│       ├── hooks/       # Feature-specific hooks (useAuth, useParking, etc.)
│       ├── services/    # API calls for this feature (axios calls)
│       ├── routes/      # Route definitions for this module
│       └── <name>Page.jsx  # Main page component
│
├── App.jsx               # Root component with router
├── main.jsx              # Entry point
└── index.css             # Global styles
```

### Global vs Feature components

- **`src/globals/components/ui/`** — Shared, reusable across modules. Use when 2+ modules need the same component (Button, CreateButton, ActionButtons, TopSection, Modal, Input, Select, etc.). Follow naming: PascalCase, one component per file.
- **`src/modules/<name>/components/`** — Feature-specific. Only used within that module. Private to the feature.
- **Never** put a feature-specific component in `globals/`.

### Services

- **`src/modules/<name>/services/`** — API calls for the feature. Use `axios` or `fetch`. Store base URL in an env var or centralized config; never hardcode URLs.
- API responses are handled here; data shaping happens here, not in components.
- Auth token is read from cookies (handled by the login module's auth utility).

### Auth

- Auth state lives in `src/modules/login/` — the auth module owns token management, login/logout, cookie read/write.
- Other modules import from the auth module's hooks/services to check auth status.
- Tokens are httpOnly cookies (backend sets them); frontend reads via `document.cookie` or a utility.

### Routing

- Use React Router v6.
- Routes defined per module in `src/modules/<name>/routes/`, then composed in `App.jsx`.
- Public routes: `/login`, `/recover-password`.
- Protected routes: check auth before rendering the component.

## Entry point structure

- `main.jsx` — mounts `App.jsx` with `<BrowserRouter>`.
- `App.jsx` — top-level router, auth guard, layout wrapper.
- `index.css` — global variables, resets, font imports.

## When something does not fit

- Global utility/helper -> `src/globals/utils/`
- Global context (auth, theme) -> `src/globals/context/` (create the folder if missing; add to this doc when you do)
- Shared config (API base URL, env vars) -> `src/globals/config.js` (create if missing)