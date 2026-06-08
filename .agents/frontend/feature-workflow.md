# Feature Workflow

Step-by-step procedure to add a new page or component end to end. Follow the **Requirement -> Design -> Implementation** flow from `SKILL.md`; this file is the operational checklist for that flow.

## 0. Pre-flight

- [ ] Confirm no existing module is already doing this (`src/modules/`).
- [ ] Check `src/globals/components/ui/` — maybe a shared component already exists.
- [ ] Confirm the API endpoints you need exist in the backend.

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

## 3. Design

- Module: new or existing? If new -> create `src/modules/<name>/`.
- Shared component? -> goes in `src/globals/components/ui/`.
- API service? -> goes in `src/modules/<name>/services/<name>Service.js`.
- Hook? -> goes in `src/modules/<name>/hooks/use<Name>.js`.
- Route: protected or public?

## 4. Build in this order

Use Conventional Commits (see `commits-and-prs.md`).

1. **Service** — `services/<name>Service.js`. API calls here.
   - Commit: `feat(frontend): add <name> service`
2. **Hook** — `hooks/use<Name>.js`. State and side effects.
   - Commit: `feat(frontend): add use<Name> hook`
3. **Components** — feature-specific components in `components/`.
   - Commit: `feat(frontend): add <name> components`
4. **Page** — `<name>Page.jsx`. Composes everything.
   - Commit: `feat(frontend): add <name> page`
5. **Routing** — add route in `src/App.jsx` or module's `routes/`.
   - Commit: `chore(frontend): add <name> route`

## 5. Verify locally

```bash
npm install
npm run dev
```

- Open `http://localhost:5173/<route>` and exercise the page.
- Confirm auth guard works.
- Check browser console for errors.

## 6. Open the PR

See `commits-and-prs.md` for the template and the pre-PR checklist.