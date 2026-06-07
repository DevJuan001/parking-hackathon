---
name: frontend-conventions
description: Frontend conventions for the parking hackathon React + Vite + Tailwind v4 app. Use when creating, editing, or reviewing files under `frontend/src/` to enforce folder layout, component/hook/service patterns, the Modal + GSAP Flip animation system, dark mode tokens, role-based routing, the apiRoutes + fetchWithAuth auth flow, commit/PR format, and the Requirement → Design → Implementation workflow.
---

# Frontend conventions

> Scope: everything under `frontend/src/`. Backend (`backend/`, `database/`, `feat/*-api` branches) is out of scope — there is a separate skill for that.

When a user asks to add, change, or review frontend code, follow the **Requirement → Design → Implementation** workflow below before touching files, and read the linked reference files for the area you are touching.

---

## 1. Reference map

| File                                  | When to read                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `architecture.md`                     | Stack, folder layout, routing, modal system, auth flow, where to add new files                        |
| `code-conventions.md`                 | Naming, component/hook/service patterns, imports, forms, accessibility, things to avoid               |
| `design-system.md`                    | Colors, dark mode, typography, spacing, transitions, animations/keyframes                              |
| `contributing.md`                     | Commit format, branching, PR template, lint, manual testing checklist                                 |

Read the file that matches the area you are about to touch. Do not skip straight to editing.

---

## 2. Quick rules (cheat sheet)

- React 19 + Vite 8 + React Router 7 + Tailwind v4 + TanStack Query v5 + GSAP Flip.
- **Default export** for components, **named export** for hooks/services/utils/constants.
- **No barrel files, no aliases.** Relative imports only.
- Raw hex colors inline; promote to a `--color-*` token only when used in 3+ places.
- Every color needs a `dark:` variant. Audit visually.
- Modals always go through `<Modal />` (which portals to `#modal-root` and uses GSAP Flip). Use `useModal` for page-level, `useInnerModal` for nested.
- API calls only inside `services/` (or `utils/fetchWithAuth.js`). Use `apiRoutes` for every URL.
- New keyframes: write `@keyframes` in `transitions.css` + register `--animate-*` in `@theme`.
- Conventional Commits. No emojis. `pnpm lint` must pass.

---

## 3. Workflow: Requirement → Design → Implementation

Run through these three phases **before** writing or modifying any frontend file. Do not skip to implementation, even for "trivial" changes.

### Phase 1 — Requirement

Restate the request in your own words and resolve ambiguity before touching code.

- What is the user-visible behavior?
- Which roles can see/use it? (Cross-check `routesConfig.js` + `asideMenuItems.js`.)
- What are the inputs and outputs? (Form fields, API payloads, success/error states.)
- Edge cases: empty list, loading, error, permission denied, very long text, dark mode.
- Ask the user **only** the questions that block the next phase. Do not ask things you can decide from the codebase.

### Phase 2 — Design

Lay out the change on paper (in chat) before writing code.

- **Where do the new files live?** Apply §2 of `architecture.md`. If the code is reused, it goes in `globals/`; otherwise, in the relevant `modules/<area>/`.
- **What existing components can be reused?** Grep first (`rg "FormField"`, `rg "useModal"`, `rg "useQuery"`). Reuse beats duplication.
- **API contract.** Is there an endpoint in `apiRoutes`? If not, propose the new constant. Does it need auth (`fetchWithAuth`) or is it public (raw `fetch`)?
- **State and data flow.** Local `useState` vs `useQuery`? Do you need a new hook? If yes, follow `code-conventions.md` §3. Does the data feed multiple components (lift to a hook) or stay local?
- **Modal flow.** Will the feature need a modal? Plan: trigger → `useModal` / `useInnerModal` → `<Modal type=...>` → specialized wrapper or inline body. Never invent a new portal.
- **Design tokens.** Pick from `design-system.md` §1. Promote to a token only if used in 3+ places.
- **Animations.** Need a new keyframe? If yes, add it to `transitions.css` and register the `--animate-*` token in `@theme`. Otherwise reuse `animate-blur-up`, `animate-rotation`, `animate-shake`, `animate-grow-in`, `animate-grow-out`.
- **Accessibility.** Labels, ids, focus, dark mode parity, keyboard close on the modal.
- **Testing/lint.** Plan to run `pnpm lint` after the change. Manually verify the dark variant.

### Phase 3 — Implementation

Execute the design in this order:

1. **Create / update files** following the naming in `code-conventions.md` §1 and the folder layout from `architecture.md` §2.
2. **Wire imports** as relative paths (no aliases).
3. **Reuse** existing components, hooks, services, and tokens before adding new ones.
4. **Style** with Tailwind v4 utilities + `dark:` variants; fall back to inline `style` only for dynamic numeric values.
5. **Register new animations** in `transitions.css` + `@theme` before using the class.
6. **Add the API path** to `apiRoutes.js` before writing the service.
7. **Run `pnpm lint`** and fix everything it reports (do not silence rules).
8. **Manually verify** against the checklist in `contributing.md` §5: light mode, dark mode, role gating, loading, error, empty state, modal open/close, animation smoothness.
9. **Summarize** the changes briefly to the user, citing file paths as `path/to/file.jsx:line`.

If during implementation you discover the design was wrong (e.g. an existing component does not support the use case), **stop**, return to Phase 2, and revise before continuing. Do not paper over the gap with a one-off hack.

---

## 4. Stack at a glance

| Concern              | Choice                                                                 |
| -------------------- | ---------------------------------------------------------------------- |
| Framework            | React 19 + Vite 8                                                      |
| Routing              | React Router 7                                                         |
| Styling              | Tailwind CSS v4 (CSS-first via `@theme` in `index.css`)                |
| Server state         | TanStack Query v5                                                      |
| Modal animations     | GSAP 3 + Flip plugin (only inside `<Modal />`)                         |
| Icons                | `material-symbols/rounded.css` via the shared `<Icon />`               |
| Lint                 | ESLint flat config (`@eslint/js` + `react-hooks` + `react-refresh`)    |
| Package manager      | pnpm workspace                                                         |
| Import alias         | None. Relative paths only.                                             |

See `architecture.md` §1 for details.
