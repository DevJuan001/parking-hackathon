# Feature Test Workflow — `parking-hackathon/testing`

Step-by-step procedure to add a new feature test end to end.

---

## Step 1: Feature File

Create `src/test/resources/features/<feature_name>.feature`:

```gherkin
# language: es
# author: <your-name>

Característica: <Nombre de la funcionalidad>
  Como <rol>
  quiero <objetivo>
  para <beneficio>

  @<tag>
  Escenario: <Descripción>
    Dado <precondición>
    Cuando <acción>
      | columna1 | columna2 |
      | valor1   | valor2   |
    Entonces <resultado esperado>
```

- Name the file in snake_case (e.g. `crear_garantia.feature`)
- Add the `# language: es` header
- Write the narrative (Como / quiero / para)
- Add a unique tag per feature/scenario
- Write Given/When/Then steps in Spanish
- Use data tables for test parameters

---

## Step 2: Runner

Create `src/test/java/co/com/test/runners/<feature_name>.java`:

```java
package co.com.test.runners;

import cucumber.api.CucumberOptions;
import cucumber.api.SnippetType;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;

@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
        features = "src/test/resources/features/<feature_name>.feature",
        glue = {"co.com.test.stepsdefinitions", "co.com.test.utils.hooks"},
        plugin = {"pretty", "html:target/cucumber-reports"},
        snippets = SnippetType.CAMELCASE
)
public class <feature_name> {
}
```

- Class name matches the feature file name
- Update `features` path to point to your `.feature` file
- Keep `glue` package the same

---

## Step 3: Data Model (if needed)

If the feature file uses data tables, create `src/main/java/co/com/test/models/<NombreModelo>.java`:

```java
package co.com.test.models;

public class NombreModelo {
    private String campo;

    public String getCampo() { return campo; }
    public void setCampo(String campo) { this.campo = campo; }
}
```

- Field names must match the data table column headers exactly
- One field per column

---

## Step 4: PageObject

If the feature interacts with a new page/screen, create `src/main/java/co/com/test/userinterfaces/<nombrePagina>.java`:

```java
package co.com.test.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import net.thucydides.core.pages.PageObject;
import org.openqa.selenium.By;

public class nombrePagina extends PageObject {

    public static final Target INPUT_CAMPO =
            Target.the("descripción en español")
                    .located(By.id("element-id"));

    // Add more Target constants as needed
}
```

- Use `By.id()` as the preferred locator
- Add `@DefaultUrl("http://localhost:5173")` if this is a landing page
- If the page already exists, add new `Target` constants to the existing class

---

## Step 5: Tasks

For each business action in the feature, create `src/main/java/co/com/test/tasks/<NombreTarea>.java`:

```java
package co.com.test.tasks;

import co.com.test.models.NombreModelo;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;

import java.util.List;

import static co.com.test.userinterfaces.nombrePagina.*;

public class NombreTarea implements Task {

    private List<NombreModelo> datos;

    public NombreTarea(List<NombreModelo> datos) {
        this.datos = datos;
    }

    public static NombreTarea metodo(List<NombreModelo> datos) {
        return Instrumented.instanceOf(NombreTarea.class)
                .withProperties(datos);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(INPUT_CAMPO),
                Enter.theValue(datos.get(0).getCampo()).into(INPUT_CAMPO)
        );
    }
}
```

---

## Step 6: Questions

For each assertion in the feature, create `src/main/java/co/com/test/questions/<NombrePregunta>.java`:

```java
package co.com.test.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static co.com.test.userinterfaces.nombrePagina.TARGET_ESPERADO;

public class NombrePregunta implements Question<Boolean> {
    private static final Logger logger = LoggerFactory.getLogger(NombrePregunta.class);

    public static NombrePregunta metodo() {
        return new NombrePregunta();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        try {
            String texto = Text.of(TARGET_ESPERADO).viewedBy(actor).asString().trim();
            logger.info("Texto obtenido: {}", texto);
            return "VALOR_ESPERADO".equalsIgnoreCase(texto);
        } catch (Exception e) {
            logger.error("Elemento no encontrado: {}", e.getMessage());
            return false;
        }
    }
}
```

---

## Step 7: Step Definitions

Create `src/test/java/co/com/test/stepsdefinitions/<NombreFeature>StepsDefinitions.java`:

```java
package co.com.test.stepsdefinitions;

import co.com.test.models.NombreModelo;
import co.com.test.questions.NombrePregunta;
import co.com.test.tasks.NombreTarea;
import co.com.test.tasks.AbrirPagina;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Dado;
import cucumber.api.java.es.Entonces;

import java.util.List;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class NombreFeatureStepsDefinitions {

    @Dado("^que el usuario está en la página de ...$")
    public void precondicion() {
        theActorInTheSpotlight().attemptsTo(AbrirPagina.laPagina());
    }

    @Cuando("^el usuario realiza acción$")
    public void accion(List<NombreModelo> datos) {
        theActorInTheSpotlight().attemptsTo(NombreTarea.metodo(datos));
    }

    @Entonces("^el usuario debería ver el resultado esperado$")
    public void resultado() {
        theActorInTheSpotlight().should(seeThat(NombrePregunta.metodo()));
    }
}
```

- Map step regexes to the feature file Gherkin
- Use `theActorInTheSpotlight()` for all interactions
- `@Dado` → open page / prepare state
- `@Cuando` → perform business action
- `@Entonces` → assert

---

## Step 8: Verify & Run

```bash
# Run just the new feature
gradlew test --tests "co.com.test.runners.<feature_name>"

# Run all tests
gradlew test
```

- Check that Serenity reports generate in `target/site/serenity/`
- Verify screenshots are captured for each step
- Check `build/reports/tests/test/index.html` for JUnit results

---

## Adding to an existing feature

If you're adding a scenario to an existing feature:

1. Add the new `Escenario` block to the existing `.feature` file
2. Add missing steps to the existing step definitions class
3. Add new Tasks and Questions as needed
4. Add new `Target` locators to existing PageObjects if needed
5. Add new fields to existing models if the data table expands

Do **not** create a new feature file, runner, or step definitions class for the same feature.
