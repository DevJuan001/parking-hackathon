package co.com.test.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class ModalConfirmacion {
    public static final Target TITULO_CONFIRMACION = Target.the("titulo confirmacion")
            .located(By.id("confirm-title"));
    public static final Target BTN_CONFIRMAR = Target.the("boton confirmar modal")
            .located(By.id("confirm-button"));
}
