# Code Conventions

Style rules for React + Vite + JavaScript (no TypeScript). See `architecture.md` for *where* code lives; this file is *how* it is written.

## Language

- **JavaScript** — no TypeScript. Ever.
- Use `const` and `let`; never `var`.
- ES6+ features: arrow functions, destructuring, template literals, async/await.
- Component files: PascalCase (`LoginPage.jsx`, `ActionButtons.jsx`).
- Hook files: camelCase, prefixed with `use` (`useAuth.js`, `useParking.js`).
- Service files: camelCase, one per action (`getAllSpotsService.js`, `createSpotService.js`, `updateSpotService.js`). Never group multiple actions in a single barrel file — see `architecture.md`.

## Components

- Functional components with hooks only (no class components).
- One component per file.
- Props are destructured at the top of the function.
- Default export for pages, named export for shared components.
- No inline styles; use CSS classes or CSS modules.
- Modal bodies follow the nested-modal pattern in `modals.md`.

## Hooks

- Custom hooks live in `src/modules/<name>/hooks/`.
- Name must start with `use`.
- Return object with named properties, not raw arrays (unless it's a pair like `[state, setState]`).
- Keep hooks focused; extract logic that spans 2+ components into a shared hook.
- **Read hooks** use `useQuery` from `@tanstack/react-query`.
- **Write hooks** (mutations) use plain `useState` for form data and `loading`/`error` flags. They do **not** use `useMutation`; instead they call the service directly, then call `queryClient.invalidateQueries(...)` on success. This keeps the call sites identical to existing globals like `useUpdateCurrentUserInfo`. See `data-fetching.md` for the canonical shape.

## State management

- Local state: `useState`.
- Side effects: `useEffect`. Always include dependency array.
- Shared state across siblings: lift to parent or use context.
- Avoid prop drilling more than 2 levels deep; use context or composition.
- Server state: `@tanstack/react-query`. Never duplicate server data in `useState`.

## API calls

- All API calls go in `src/modules/<name>/services/`.
- Use `fetchWithAuth` from `src/utils/fetchWithAuth.js` for any authenticated endpoint; use plain `fetch` for public endpoints (e.g. login).
- Base URL from `apiRoutes.apiUrl`; never hardcode.
- Build URLs from the keys in `src/config/apiRoutes.js` via template strings. Do not add new keys unless the route prefix is genuinely new across the codebase. Each feature module typically needs only one or two keys (e.g. `parking` for `/parking`, `spots` for `/spots`).
- Auth token is read from httpOnly cookies via `fetchWithAuth`; do not read `document.cookie` directly.
- Handle loading, error, and success states in the caller.
- Throw `new Error("Mensaje legible en español")` on `!response.ok` so the caller's inner `ErrorModal` can render a friendly message.
- Never call APIs directly inside components; use the service layer.

## Polling

- Use `useQuery` with `refetchInterval` (ms) when the screen must auto-refresh.
- Always set `refetchIntervalInBackground: false` to avoid hammering the API in hidden tabs.
- Pair with `staleTime` slightly lower than the interval (e.g. 10s for a 25s interval) to avoid redundant refetches on manual invalidations.
- React Query keeps the last successful `data` populated on failure — use that for "show last cached data silently" UX.
- See `data-fetching.md` for the canonical hook shape.

## No TypeScript

- No `.tsx` / `.ts` files. Use `.jsx` / `.js`.
- PropTypes are optional; prefer clear prop names and default values.
- Document complex data shapes in comments above the component.

## What "done" looks like for a code change

- Component uses hooks correctly, no `var`, no `console.log`.
- API calls go through the service layer.
- Shared components live in `src/globals/components/ui/`.
- No hardcoded URLs; no `localhost:8000` in production code.
- No `console.log`, no commented-out code, no dead imports.
- New patterns are documented back in the relevant skill file.
