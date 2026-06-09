# Feature Workflow

Step-by-step procedure to add a new page or component end to end. Follow the **Requirement -> Design -> Implementation** flow from `SKILL.md`; this file is the operational checklist for that flow.

## 0. Pre-flight

- [ ] Confirm no existing module is already doing this (`src/modules/`).
- [ ] Check `src/globals/components/ui/` — maybe a shared component already exists.
- [ ] Confirm the API endpoints you need exist in the backend.
- [ ] Check `src/config/apiRoutes.js` for existing keys; build new URLs from existing keys via template strings instead of adding new keys.

## 1. Branch

```bash
git checkout main
git pull
git checkout -b feat/<name>-page
```

Naming: `feat/<name>-page` for new pages, `fix/<name>-<short-desc>` for bug fixes.

## 2. Requirement

- What does the user see on this screen?
- Which API endpoints are called?
- What states exist? (loading, error, empty, success)
- Auth required? Public or protected?
- Does any data need periodic refresh? See `data-fetching.md` for the polling pattern.

## 3. Design

- Module: new or existing? If new -> create `src/modules/<name>/`.
- Shared component? -> goes in `src/globals/components/ui/`.
- API service? -> goes in `src/modules/<name>/services/<name>Service.js`.
- Hook? -> goes in `src/modules/<name>/hooks/use<Name>.js`.
- Route: protected or public?
- Modal flow: see `modals.md` — there are two patterns (page-owns-outer vs self-contained). Most list/grid pages use Pattern A.
- When a page triggers modal actions from a list/grid, pass a single `openModal` prop down (not separate `onEdit` / `onCreate` callbacks). The leaf component decides the `modalType`.
- The page's outer `<Modal>` carries the `title` (computed inline from `modalType`) and the `growDirection`. Don't pass these to child modals.

## 4. Build in this order

Use Conventional Commits (see `commits-and-prs.md`).

1. **Constants** (status maps, catalogs, validators) — colocated in `src/modules/<name>/constants/`.
   - Commit: `feat(frontend): add <name> constants`
2. **Service** — `services/<name>Service.js`. API calls here.
   - Commit: `feat(frontend): add <name> service`
3. **Read hook** — `hooks/use<Name>.js` (with polling when needed).
   - Commit: `feat(frontend): add use<Name> hook`
4. **Write hooks** — one hook per mutation (create, update, etc.) using `useState` + `loading`/`error` flags + `queryClient.invalidateQueries`. See `data-fetching.md`.
   - Commit: `feat(frontend): add use<Name> mutation hook(s)`
5. **Components** — feature-specific components in `components/`.
   - Commit: `feat(frontend): add <name> components`
6. **Page** — `<name>Page.jsx`. Composes everything.
   - Commit: `feat(frontend): add <name> page`
7. **Routing** — add route in `src/App.jsx` or module's `routes/`.
   - Commit: `chore(frontend): add <name> route`

## 5. Verify locally

```bash
npm install
npm run dev
```

- Open `http://localhost:5173/<route>` and exercise the page.
- Confirm auth guard works.
- Check browser console for errors.
- If polling is involved, wait one full interval and confirm a refetch fires (visible in DevTools Network tab).

## 6. Open the PR

See `commits-and-prs.md` for the template and the pre-PR checklist.
