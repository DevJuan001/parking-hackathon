package co.com.test.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static co.com.test.userinterfaces.ModalConfirmacion.TITULO_CONFIRMACION;

public class ValidarMensajeExito implements Question<String> {
    private static final Logger logger = LoggerFactory.getLogger(ValidarMensajeExito.class);

    public static ValidarMensajeExito validar() {
        return new ValidarMensajeExito();
    }

    @Override
    public String answeredBy(Actor actor) {
        int maxRetries = 10;
        for (int i = 0; i < maxRetries; i++) {
            try {
                String texto = Text.of(TITULO_CONFIRMACION).viewedBy(actor).asString().trim();
                logger.info("Intento {} - Texto obtenido del modal: '{}'", i + 1, texto);
                if (!texto.isEmpty()) {
                    return texto;
                }
                logger.warn("Intento {} - El texto del modal esta vacio", i + 1);
            } catch (Exception e) {
                logger.info("Intento {} de {} - Modal no encontrado: {}", i + 1, maxRetries, e.getMessage());
            }
            try {
                Thread.sleep(1000);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                return "";
            }
        }
        logger.error("Modal de exito no encontrado después de {} intentos", maxRetries);
        return "";
    }
}
