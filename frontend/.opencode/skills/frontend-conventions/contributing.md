# Contributing

> Pull requests, commits, lint, manual testing checklist.
> Read alongside `SKILL.md` (the Requirement → Design → Implementation workflow).

---

## 1. Commits — Conventional Commits

Format: `<type>(<optional scope>): <subject>`

| Type       | Use for                                                       |
| ---------- | ------------------------------------------------------------- |
| `feat`     | A new user-visible feature                                    |
| `fix`      | A bug fix                                                     |
| `refactor` | A change that neither fixes a bug nor adds a feature          |
| `chore`    | Tooling, deps, config, housekeeping                           |
| `docs`     | Documentation only                                            |
| `style`    | Formatting, whitespace, missing semicolons (no logic change)  |
| `test`     | Adding or fixing tests                                        |
| `perf`     | Performance improvement                                       |

Rules:

- Subject is **imperative present tense** ("add", not "added" / "adds").
- Subject is **lowercase** after the colon.
- No trailing period.
- **No emojis.**
- One logical change per commit. Squash local WIP commits before pushing.
- Keep the subject under ~72 chars; use the body for context if needed.

Examples that match the existing history:

```
feat: add UsersPage component with basic structure
feat: implement useFlipModal and useModal hooks for enhanced modal animations and state management
fix: update favicon link to use parking logo with Tailwind CSS classes
chore: update frontend dependencies and add pnpm workspace configuration
refactor: restructure App component to use React Router and remove unused elements
```

---

## 2. Branching

- Feature work: `feat/<area>` (e.g. `feat/frontend`, `feat/users-api`, `feat/auth-api`).
- Database-only changes: `database`.
- One concern per branch. Branch off `main` and rebase / merge `main` before opening the PR to keep history clean.

---

## 3. Pull requests

Use the template at `.github/PULL_REQUEST_TEMPLATE.md`. Title follows Conventional Commits; body uses the categorized `## Changes` sections (Project setup, Layout, Routing, Auth, UI kit, Modals, Hooks, Services, Pages, Styles & animations).

The full template with a filled-in example lives at `.opencode/templates/pr-template.md`.

Before opening a PR:

1. All work is committed (no untracked files left in `git status`).
2. `pnpm lint` passes.
3. You have manually verified the changes (see §5).
4. The PR body is complete — every changed area has a bullet.

---

## 4. Linting and quality gates

- `pnpm lint` (runs `eslint .`) is the only scripted check. Fix every warning it produces; do not add `// eslint-disable` comments.
- The flat config in `eslint.config.js` enables:
  - `@eslint/js` recommended
  - `eslint-plugin-react-hooks` recommended
  - `eslint-plugin-react-refresh` (Vite)
- No formatter is configured. If you add Prettier later, document the decision in this skill.

---

## 5. Manual testing checklist

Run through this **every** time before finishing a change, not only before opening a PR:

- [ ] `pnpm install` from `frontend/` if `package.json` changed.
- [ ] `pnpm dev` boots without console errors.
- [ ] The feature works in **light mode**.
- [ ] The feature works in **dark mode** (toggle via the theme hook — there is no UI toggle yet, so toggle the `.dark` class on `<html>` in devtools).
- [ ] The feature is reachable by the right **role(s)** and blocked for others (`routesConfig` + `asideMenuItems`).
- [ ] The feature handles **loading** (no broken layout, no flash of empty state).
- [ ] The feature handles **errors** (network down, 401, 403, 404, 500) — at minimum, the error is surfaced, not swallowed.
- [ ] Empty states render an explicit message (not just a blank box).
- [ ] Modals: open via trigger, close via overlay click, close via the X, restore body scroll on close.
- [ ] Animations: nothing is janky at 60fps; the close animation mirrors the open (no snap).
- [ ] Responsive: at least verify the `md` breakpoint if the change touches layout.
- [ ] `pnpm lint` is clean.

---

## 6. Things to avoid in reviews (and PRs)

- Drive-by formatting churn unrelated to the change.
- Mixing refactors with feature changes (split them).
- Adding dependencies without justification in the PR body.
- Bypassing the modal/hook/service layers with raw `fetch` or inline portals.
- Forgetting the `dark:` variant on a new color.
- Adding a new keyframe without registering the `--animate-*` token in `@theme`.
- Forgetting to add the matching entry in `routesConfig.js` and `asideMenuItems.js` for a new page.
