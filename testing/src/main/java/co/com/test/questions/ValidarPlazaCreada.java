package co.com.test.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static co.com.test.userinterfaces.ModalConfirmacion.TITULO_CONFIRMACION;

public class ValidarPlazaCreada implements Question<Boolean> {
    private static final Logger logger = LoggerFactory.getLogger(ValidarPlazaCreada.class);

    private static final String MENSAJE_ESPERADO = "Plaza creada exitosamente";

    public static ValidarPlazaCreada validar() {
        return new ValidarPlazaCreada();
    }

    @Override
    public Boolean answeredBy(Actor actor) {
        for (int i = 0; i < 10; i++) {
            try {
                String texto = Text.of(TITULO_CONFIRMACION).viewedBy(actor).asString().trim();
                logger.info("Texto obtenido: {}", texto);
                if (MENSAJE_ESPERADO.equalsIgnoreCase(texto)) {
                    return true;
                }
            } catch (Exception e) {
                logger.error("Elemento no encontrado, intento {}: {}", i + 1, e.getMessage());
            }
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        return false;
    }
}
