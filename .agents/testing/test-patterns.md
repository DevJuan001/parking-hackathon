# Test Patterns — `parking-hackathon/testing`

Patterns concretos para escribir tests con Serenity BDD + Cucumber + Screenplay.

---

## Login como antecedente

Todos los tests funcionales requieren autenticación. Usar el paso compartido:

```gherkin
Cuando el usuario ha iniciado sesion
  | usuario          | clave  |
  | admin@test.com   | 123456 |
```

Este paso está definido en `SharedStepsDefinitions.java` y ejecuta:
1. `AbrirPagina` — navega a la URL base
2. `Autenticarse` — completa el formulario de login

No duplicar este paso en los step definitions específicos de cada feature.

---

## Navegación como paso compartido

Para navegar a una sección después del login:

```gherkin
Cuando navega a la seccion Usuarios
```

Este paso usa un switch por nombre de sección en `SharedStepsDefinitions`. Las secciones disponibles son: `Usuarios`, `Parking`, `Entradas`.

---

## Creación de entidades con modal de éxito

Toda creación exitosa muestra un modal con `span#confirm-title`. La validación se hace en la Question correspondiente con un loop de reintentos (máximo 10 intentos, 1s de pausa).

```java
// En la Question
Target mensajeExito = Target.the("mensaje de exito")
        .located(By.id("confirm-title"));
String texto = Text.of(mensajeExito).viewedBy(actor).asString().trim();
return "Entidad creada con éxito!".equals(texto);
```

El cierre del modal se hace en un paso separado:

```gherkin
Cuando cierra el modal de confirmacion
```

---

## Datos aleatorios

Para evitar colisiones en ejecuciones repetidas, generar datos únicos usando timestamps:

```
// En el feature file se pasan datos fijos
// La lógica de generación única va en la Task si es necesario
```

---

## Sesión de actor

Usar `theActorInTheSpotlight().remember()` para compartir datos entre pasos:

```java
theActorInTheSpotlight().remember(SesionVariable.nombrePlaza.toString(), "Plaza A1");
```

Recuperar con:

```java
String plaza = theActorInTheSpotlight().recall(SesionVariable.nombrePlaza.toString());
```

---

## Localizadores dinámicos (XPath)

Cuando un elemento cambia según datos del escenario, usar XPath con variables:

```java
public static final Target PLAZA_POR_NOMBRE = Target.the("plaza por nombre")
        .located(By.xpath("//td[contains(text(), '" + nombre + "')]"));
```

---

## Interacción directa con Selenium

Si Screenplay no expone una interacción necesaria, usar `Evaluate` o raw Selenium dentro de una Task:

```java
actor.attemptsTo(JavaScriptEvaluation.of("arguments[0].click()", elemento));
```
