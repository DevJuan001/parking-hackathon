# Commits and PRs

## Conventional Commits

Format: `<type>(<scope>): <subject>`

- **Scope** is `frontend` for everything in this repo.
- **Subject** is imperative, lowercase, no trailing period, max ~72 chars.

Allowed types:

| Type       | When                                                   |
|------------|--------------------------------------------------------|
| `feat`     | new user-facing functionality                          |
| `fix`      | bug fix                                                |
| `refactor` | code change that neither fixes a bug nor adds a feature|
| `chore`    | tooling, deps, config, non-functional                  |
| `docs`     | documentation only                                     |
| `test`     | adding or fixing tests                                 |

Examples:

```
feat(frontend): add login page with auth flow
feat(frontend): add useParking hook for entries management
fix(frontend): handle null user in auth guard
refactor(frontend): move shared button to globals/ui
chore(frontend): update package.json
docs(frontend): add README setup instructions
```

## Branch naming

- `feat/<name>-page` — new page.
- `fix/<name>-<short-desc>` — bug fix.
- `refactor/<name>` — refactor.
- `chore/<name>` — tooling / config.

## Pre-PR checklist

### Architecture (see `architecture.md`)
- [ ] Shared components in `src/globals/components/ui/`
- [ ] Feature components in `src/modules/<name>/components/`
- [ ] Services in `src/modules/<name>/services/`

### Conventions (see `code-conventions.md`)
- [ ] No TypeScript (`.jsx` / `.js` only)
- [ ] Functional components with hooks
- [ ] No `console.log`, no hardcoded URLs, no inline styles
- [ ] API calls go through the service layer
- [ ] No `var`, use `const` / `let`

### Wiring
- [ ] Route added in `App.jsx` or module's `routes/`
- [ ] Auth guard on protected routes
- [ ] Dependencies added to `package.json` and `npm install` run

### Local verification
- [ ] `npm run dev` starts without errors
- [ ] Page loads at the correct route
- [ ] Browser console has no errors
- [ ] Auth flow works end-to-end

### Hygiene
- [ ] No secrets in diff
- [ ] Commits are atomic and follow Conventional Commits
- [ ] Correct labels applied to the PR (`gh pr edit <num> --add-label "<label1>,<label2>"`)

## PR template

```markdown
## Summary
<one-sentence description of what this PR does and why>

## Labels
<!-- Run: gh pr edit <num> --add-label "refactor,enhancement,bug,documentation,database,api,frontend" -->
- `refactor` — refactors / non-functional
- `enhancement` — new features
- `bug` — bug fixes
- `documentation` — docs-only
- `database` — DB schema/seed
- `api` — backend API
- `frontend` — frontend

## Changes
<!-- Group by relevant section. Remove empty ones. -->

### Pages
<!-- New or modified pages in src/modules/ -->

### Components
<!-- New or modified components (globally shared vs feature-specific) -->

### Services / hooks
<!-- New API services or hooks -->

### Routing
<!-- New routes added to App.jsx -->

### Styles
<!-- Global or component CSS changes -->

```

## Opening the PR

Create the PR directly on GitHub. Do not ask. Do not wait.

```bash
gh pr create --base main --head <branch> --title "<title>" --body "<body>"
gh pr edit <num> --add-label "<label1>,<label2>"
```

Pick labels from: `refactor`, `enhancement`, `bug`, `documentation`, `database`, `api`, `frontend`.

## After merge

- Delete the branch locally and remotely.