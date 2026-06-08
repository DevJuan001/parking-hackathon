# Code Conventions

Style rules for React + Vite + JavaScript (no TypeScript). See `architecture.md` for *where* code lives; this file is *how* it is written.

## Language

- **JavaScript** — no TypeScript. Ever.
- Use `const` and `let`; never `var`.
- ES6+ features: arrow functions, destructuring, template literals, async/await.
- Component files: PascalCase (`LoginPage.jsx`, `ActionButtons.jsx`).
- Hook files: camelCase, prefixed with `use` (`useAuth.js`, `useParking.js`).
- Service files: camelCase (`authService.js`, `parkingService.js`).

## Components

- Functional components with hooks only (no class components).
- One component per file.
- Props are destructured at the top of the function.
- Default export for pages, named export for shared components.
- No inline styles; use CSS classes or CSS modules.

## Hooks

- Custom hooks live in `src/modules/<name>/hooks/`.
- Name must start with `use`.
- Return object with named properties, not raw arrays (unless it's a pair like `[state, setState]`).
- Keep hooks focused; extract logic that spans 2+ components into a shared hook.

## State management

- Local state: `useState`.
- Side effects: `useEffect`. Always include dependency array.
- Shared state across siblings: lift to parent or use context.
- Avoid prop drilling more than 2 levels deep; use context or composition.

## API calls

- All API calls go in `src/modules/<name>/services/`.
- Use `axios` or native `fetch`.
- Base URL from env var or `src/globals/config.js`; never hardcode.
- Auth token read from cookies via `document.cookie` or auth utility.
- Handle loading, error, and success states in the caller.
- Never call APIs directly inside components; use the service layer.

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