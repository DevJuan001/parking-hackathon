# Testing — Commits & PRs

## Commit format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
test(<scope>): <imperative description>
```

Where `<scope>` is the feature or layer being modified (e.g. `login`, `runner`, `tasks`, `pageobjects`).

Examples:

```
test(login): add autenticacion exitosa scenario
test(runners): add crear-garantia runner
test(tasks): add Autenticarse task with data table support
test(questions): add ValidacionLogin question
test(pageobjects): add autenticacion page with email/password locators
test(config): bump serenity to 2.1.1
```

For non-test changes inside the `testing/` directory:

```
chore(testing): update gradle wrapper to 8.14
fix(testing): correct login button locator id
```

## Pre-PR checklist

Before opening a PR for test changes, verify:

- [ ] Feature file compiles (no syntax errors in Gherkin)
- [ ] Runner `@CucumberOptions.features` points to the correct `.feature` file
- [ ] Runner `@CucumberOptions.glue` includes both `stepsdefinitions` and `utils.hooks`
- [ ] Step definition regexes match the Gherkin step text exactly
- [ ] Model field names match feature file data table column headers
- [ ] All `Target` locators use the correct `By` strategy (`By.id` preferred)
- [ ] No `console.log`, `Thread.sleep()`, or commented-out code
- [ ] No hardcoded credentials (use environment variables for production-like data)
- [ ] SLF4J logger present in all Questions
- [ ] Static factory methods follow the `Tasks.instrumented` / `Instrumented.instanceOf` pattern
- [ ] Tests pass: `gradlew test --tests "co.com.test.runners.<feature>"` returns green
- [ ] Serenity reports generate correctly in `target/site/serenity/`
- [ ] Screenshots are captured for each step

## PR creation

Create directly on GitHub. Do not ask. Do not wait.

```bash
gh pr create --base main --head <branch> --title "test(<scope>): <title>" --body "<description>"
gh pr edit <num> --add-label "testing"
```

**Labels:** `testing` is always required. Add additional labels as needed: `bug`, `enhancement`, `frontend`.

## Branch naming

```
test/<feature-name>
```

Examples:

```
test/login
test/crear-garantia
test/editar-usuario
test/pageobjects-refactor
```

## PR description template

```markdown
## Requirement
<!-- What functionality is being tested? Which screen/page? -->

## Design
<!-- Which layers were touched? (feature / runner / steps / tasks / questions / pageobjects / models / hooks) -->

## Implementation
<!-- Brief summary of the test structure and any notable decisions -->

## Verification
- [ ] Tests pass locally
- [ ] Serenity reports generated
- [ ] Screenshots verified
```
