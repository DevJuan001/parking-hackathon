package co.com.test.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static co.com.test.userinterfaces.autenticacion.MENSAJE_LOGIN;


public class ValidacionLogin implements Question<Boolean> {
    private static final Logger logger =
            LoggerFactory.getLogger(ValidacionLogin.class);

    private static final String MENSAJE_ESPERADO = "Plazas";

    public static ValidacionLogin validacionLogin() {
        return new ValidacionLogin();
    }




    @Override
    public Boolean answeredBy(Actor actor) {
        try {
            String texto = Text.of(MENSAJE_LOGIN).viewedBy(actor).asString().trim();
            logger.info("Texto obtenido: {}", texto);
            return MENSAJE_ESPERADO.equalsIgnoreCase(texto);
        } catch (Exception e) {
            logger.error("Elemento no encontrado: {}", e.getMessage());
            return false;
        }
    }
}