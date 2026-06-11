package co.com.test.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ValidarCambioEstadoUsuario implements Question<Boolean> {
    private static final Logger logger = LoggerFactory.getLogger(ValidarCambioEstadoUsuario.class);

    public static ValidarCambioEstadoUsuario haCambiado() {
        return new ValidarCambioEstadoUsuario();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        String botonId = actor.recall("botonEstadoId");
        String statusAnterior = actor.recall("statusAnterior");
        if (botonId == null || statusAnterior == null) {
            logger.error("No se encontraron datos de estado anterior en la memoria del actor");
            return false;
        }
        String xpath = "//tr[.//button[@id='" + botonId + "']]/th[7]//span";
        for (int i = 0; i < 10; i++) {
            try {
                WebElement span = BrowseTheWeb.as(actor).find(By.xpath(xpath));
                String textoActual = span.getText().trim();
                logger.info("Intento {} - Status actual: '{}', Status anterior: '{}'", i + 1, textoActual, statusAnterior);
                if (!textoActual.isEmpty() && !textoActual.equalsIgnoreCase(statusAnterior)) {
                    return true;
                }
            } catch (Exception e) {
                logger.info("Intento {} de 10 - Elemento no encontrado: {}", i + 1, e.getMessage());
            }
            try {
                Thread.sleep(1000);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                return false;
            }
        }
        logger.error("El estado del usuario no cambio después de 10 intentos");
        return false;
    }
}
