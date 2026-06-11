# Testing Code Conventions — `parking-hackathon/testing`

## Language

- **Feature files:** Spanish (`# language: es`)
- **Java code:** English (classes, methods, variables)
- **Cucumber annotations in step definitions:** Spanish (`@Dado`, `@Cuando`, `@Entonces`)
- **Naming:** descriptive, business-oriented, in the language that matches the context

---

## Feature Files (`*.feature`)

```gherkin
# language: es
# author: <name>

Característica: <Nombre de la funcionalidad>
  Como <rol>
  quiero <objetivo>
  para <beneficio>

  @<tag>
  Escenario: <Descripción del escenario>
    Dado <precondición>
    Cuando <acción>
      | columna1 | columna2 |
      | valor1   | valor2   |
    Entonces <resultado esperado>
```

Rules:
- Always start with `# language: es`
- Use Spanish for all Gherkin text (feature name, scenario name, steps)
- Feature narrative follows the standard template: `Como... quiero... para...`
- Tags are lowercase, no spaces (e.g. `@autenticacion`, `@regresion`)
- One `|` data table per step if parameters needed
- Step text: lowercase, descriptive, using `que el usuario...`, `el usuario...`, `el sistema...`

---

## Runners

```java
@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
        features = "src/test/resources/features/<feature>.feature",
        glue = {"co.com.test.stepsdefinitions", "co.com.test.utils.hooks"},
        plugin = {"pretty", "html:target/cucumber-reports"},
        snippets = SnippetType.CAMELCASE
)
public class <feature> {
}
```

Rules:
- Class name matches the feature file name (lowercase)
- `glue` always includes both `stepsdefinitions` and `utils.hooks`
- `snippets` always `SnippetType.CAMELCASE`
- Class body is empty (no methods)

---

## Step Definitions

```java
@Dado("^...$")
public void metodo() {
    theActorInTheSpotlight().attemptsTo(Task.metodo());
}

@Cuando("^...$")
public void metodo(List<ModelClass> datos) {
    theActorInTheSpotlight().attemptsTo(Task.metodo(datos));
}

@Entonces("^...$")
public void metodo() {
    theActorInTheSpotlight().should(seeThat(Question.metodo()));
}
```

Rules:
- Regex in step strings: use `^...$` delimiters
- Always import `static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight`
- Always import `static net.serenitybdd.screenplay.GivenWhenThen.seeThat` for Then steps
- `@Dado` → open pages, prepare state
- `@Cuando` → perform business actions via Tasks
- `@Entonces` → assert via Questions + `seeThat`
- Data tables arrive as `List<ModelClass>` automatically via Cucumber

---

## Tasks

```java
public class NombreTarea implements Task {

    private List<ModelClass> datos;

    public NombreTarea(List<ModelClass> datos) {
        this.datos = datos;
    }

    public static NombreTarea metodo(List<ModelClass> datos) {
        return Instrumented.instanceOf(NombreTarea.class)
                .withProperties(datos);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(TARGET),
                Enter.theValue(datos.get(0).getCampo()).into(TARGET)
        );
    }
}
```

Rules:
- Implement `net.serenitybdd.screenplay.Task`
- Static factory method: use `Tasks.instrumented()` for no-arg tasks, `Instrumented.instanceOf()` for tasks with parameters
- `performAs` receives the actor; compose actions via `actor.attemptsTo(...)`
- Use Serenity's built-in interactions: `Open`, `Click`, `Enter`, `SelectFromDropdown`, `Scroll`, `WaitUntil`, etc.
- Avoid raw Selenium WebDriver calls — use Screenplay interactions
- Session data: `theActorInTheSpotlight().remember(SesionVariable.clave.toString(), value)`

---

## Questions

```java
public class ValidacionNombre implements Question<Boolean> {
    private static final Logger logger = LoggerFactory.getLogger(ValidacionNombre.class);

    public static ValidacionNombre metodo() {
        return new ValidacionNombre();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        try {
            String texto = Text.of(TARGET).viewedBy(actor).asString().trim();
            logger.info("Texto obtenido: {}", texto);
            return "VALOR_ESPERADO".equalsIgnoreCase(texto);
        } catch (Exception e) {
            logger.error("Elemento no encontrado: {}", e.getMessage());
            return false;
        }
    }
}
```

Rules:
- Implement `net.serenitybdd.screenplay.Question<Boolean>`
- Keep the expected value as a `private static final String` constant
- Use `Text.of(TARGET).viewedBy(actor).asString().trim()` to read page text
- Wrap in try/catch: log the error, return `false` (soft fail)
- Log both the obtained text and any errors via SLF4J

---

## PageObjects (User Interfaces)

```java
public class nombrePagina extends PageObject {

    public static final Target INPUT_NOMBRE =
            Target.the("descripción en español")
                    .located(By.id("element-id"));

    public static final Target BOTON_ACCION =
            Target.the("descripción")
                    .located(By.xpath("//button[@id='accion']"));
}
```

Rules:
- Extend `net.thucydides.core.pages.PageObject`
- Fields: `public static final Target`
- `Target.the("descripción")` — description in Spanish, lowercase
- Use `By.id()` as the **preferred** locator strategy
- Fallback: `By.xpath()`, `By.cssSelector()`, `By.name()` only when no stable ID
- Landmark pages (entry points): add `@DefaultUrl("http://localhost:5173")`
- One file per page/screen

---

## Models

```java
public class NombreModelo {
    private String campo;

    public String getCampo() { return campo; }
    public void setCampo(String campo) { this.campo = campo; }
}
```

Rules:
- Field names must **exactly match** the data table column headers in the `.feature` file
- One field per data column
- Provide getters and setters for each field
- Keep it simple: no validation, no business logic, no annotations

---

## Hooks

```java
public class PrepararEscenario {

    @Before
    public void preparar() {
        setTheStage(new OnlineCast());
        theActorCalled("usuario");
    }
}
```

Rules:
- `@Before` — sets up the stage and actor before each scenario
- Use `OnlineCast` (manages WebDriver lifecycle automatically)
- Actor name is descriptive (e.g. `"usuario"`, `"admin"`, `"cliente"`)
- Do not add additional `@Before` methods unless truly global

---

## Session Variables

```java
public enum SesionVariable {
    usuario,
    clave,
    token,
    idProducto
}
```

Rules:
- Use an enum for all session keys (type-safe, discoverable)
- Access via `SesionVariable.nombre.toString()`
- Add new entries as the test suite grows

---

## General conventions

- **No hardcoded credentials in feature files.** Use environment variables or externalised config for production-like environments. For development, keep them in data tables.
- **No `console.log`.** Use SLF4J (`LoggerFactory.getLogger`) for all logging.
- **No `Thread.sleep()`.** Use Serenity's `WaitUntil.` or implicit waits configured in `serenity.properties`.
- **No commented-out code.** Remove dead steps, locators, and classes.
- **One assertion per `@Entonces` step.** If multiple checks needed, write separate Then steps.
- **Keep scenarios independent.** Each scenario sets up its own state via `@Dado`.
- **Screenshots are automatic** via `serenity.take.screenshots=AFTER_EACH_STEP` — no manual screenshot code.
