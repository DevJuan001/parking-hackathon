# Testing Architecture — `parking-hackathon/testing`

## 8-Layer Architecture (bottom to top)

```
src/test/resources/features/          # 1. Gherkin Feature Files
src/test/java/co/com/test/runners/    # 2. Test Runners (JUnit 4 + Serenity)
src/test/java/co/com/test/stepsdefinitions/  # 3. Step Definitions
src/main/java/co/com/test/tasks/      # 4. Screenplay Tasks
src/main/java/co/com/test/questions/  # 5. Screenplay Questions
src/main/java/co/com/test/userinterfaces/  # 6. PageObjects + Target locators
src/main/java/co/com/test/models/     # 7. Data Models (POJOs)
src/main/java/co/com/test/utils/hooks/  # 8. Cucumber Hooks
```

### Layer 1 — Feature Files
- **Location:** `src/test/resources/features/<feature_name>.feature`
- **Format:** Gherkin with `# language: es` (Spanish)
- **One feature file per feature**, named in snake_case (e.g. `login.feature`, `crear_garantia.feature`)
- Contains `Característica` (Feature) with narrative and one or more `Escenario` (Scenario) blocks
- Tags (`@tag`) for grouping and selective execution
- Data tables for parameterised test data

### Layer 2 — Runners
- **Location:** `src/test/java/co/com/test/runners/<feature_name>.java`
- **Pattern:** Empty class annotated with `@RunWith(CucumberWithSerenity.class)` + `@CucumberOptions`
- `features` points to the feature file path
- `glue` includes step definitions + hooks packages
- `snippets = SnippetType.CAMELCASE` for auto-generated snippets
- **One runner per feature**, named after the feature (lowercase)

### Layer 3 — Step Definitions
- **Location:** `src/test/java/co/com/test/stepsdefinitions/<FeatureName>StepsDefinitions.java`
- Maps Gherkin steps to Screenplay actions
- Uses Spanish Cucumber annotations: `@Dado`, `@Cuando`, `@Entonces`
- Imports and delegates to Tasks and Questions via `theActorInTheSpotlight()`
- Receives data tables as `List<ModelClass>` via Cucumber's automatic conversion

### Layer 4 — Tasks
- **Location:** `src/main/java/co/com/test/tasks/<TaskName>.java`
- Implements `net.serenitybdd.screenplay.Task`
- Static factory method returning `Tasks.instrumented()` or `Instrumented.instanceOf()`
- `performAs(T actor)` executes actions via `actor.attemptsTo(Open, Enter, Click, ...)`
- **One class per business action** (e.g. `Autenticarse`, `AbrirPagina`)

### Layer 5 — Questions
- **Location:** `src/main/java/co/com/test/questions/<QuestionName>.java`
- Implements `net.serenitybdd.screenplay.Question<Boolean>`
- Static factory method returning a new instance
- `answeredBy(Actor actor)` reads UI state and returns assertion result
- Uses `Text.of(TARGET).viewedBy(actor).asString()` to extract page text
- Includes try/catch with SLF4J logging for resilience

### Layer 6 — PageObjects / User Interfaces
- **Location:** `src/main/java/co/com/test/userinterfaces/<PageName>.java`
- Extends `net.thucydides.core.pages.PageObject`
- Defines `Target` constants: `Target.the("description").located(By.id("..."))`
- One class per page/screen of the application
- `@DefaultUrl` annotation on the "landing" page class for `Open.browserOn()`

### Layer 7 — Models
- **Location:** `src/main/java/co/com/test/models/<ModelName>.java`
- Simple POJO with private fields, getters and setters
- Fields match feature file data table column names (case-sensitive)
- **One model per data table structure**

### Layer 8 — Hooks
- **Location:** `src/main/java/co/com/test/utils/hooks/<HookName>.java`
- Cucumber `@Before` / `@After` annotated methods
- `PrepararEscenario`: Sets up `OnlineCast` and creates the actor via `setTheStage(new OnlineCast())` + `theActorCalled("usuario")`
- `SesionVariable`: Enum for shared session keys (`actor.remember()` / `actor.recall()`)
- **Do not put business logic here** — only global setup/teardown

---

## Data Flow

```
Feature File (Gherkin)
    ↓
Runner (JUnit + CucumberWithSerenity)
    ↓
Step Definitions (@Dado / @Cuando / @Entonces)
    ↓
theActorInTheSpotlight().attemptsTo(Task)   ← data tables → Model
    ↓
Task.performAs() → Open, Click, Enter, etc. ← Target locators → PageObject
    ↓
theActorInTheSpotlight().should(seeThat(Question))
    ↓
Question.answeredBy() → Text.of(TARGET) → reads UI → returns boolean
```

---

## Build & Configuration

- **Build tool:** Gradle 8.14 via wrapper (`gradlew` / `gradlew.bat`)
- **Serenity version:** 2.1.1
- **Cucumber version:** 1.9.51 (via `serenity-cucumber`)
- **Java source compatibility:** 1.8
- **Encoding:** UTF-8
- **Test framework:** JUnit 4 (declared via `test { useJUnit() }`)
- **Report aggregation:** `test.finalizedBy 'aggregate'` — generates Serenity reports automatically after tests

### serenity.properties key settings:

| Property | Value | Purpose |
|----------|-------|---------|
| `webdriver.driver` | chrome | Browser for UI tests |
| `webdriver.chrome.driver` | `src/test/resources/Drivers/chromedriver.exe` | ChromeDriver binary path |
| `serenity.take.screenshots` | AFTER_EACH_STEP | Screenshot on every step |
| `webdriver.timeouts.implicitlywait` | 20000 | Implicit wait in ms |
| `serenity.browser.width/height` | 1600x800 | Viewport size |

### Running tests:

```bash
# All tests
gradlew test

# Specific runner
gradlew test --tests "co.com.test.runners.login"
```

---

## Layer rules

- **Never shortcut a layer.** Step definitions must not contain business logic — delegate to Tasks.
- **Tasks must not contain assertions** — that is the Question layer's job.
- **Questions must not contain locators** — reference `Target` constants from PageObjects.
- **PageObjects must only contain locators and `@DefaultUrl`** — no actions, no assertions.
- **Hooks must be limited to global setup** — no per-scenario business logic.
- **One `.feature` file per testable feature**.
- **One runner class per feature file**.
- **One step definition class per runner**.
