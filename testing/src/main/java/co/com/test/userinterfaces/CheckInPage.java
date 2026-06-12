package co.com.test.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class CheckInPage {
    public static final Target INPUT_PLACA = Target.the("input placa cliente")
            .located(By.name("plate"));
    public static final Target BTN_ENVIAR = Target.the("boton enviar placa")
            .located(By.xpath("//button[text()='Enviar']"));
    public static final Target MENSAJE_AGRADECIMIENTO = Target.the("mensaje de agradecimiento")
            .located(By.xpath("//span[normalize-space(text())='\u00a1Gracias por elegirnos!']"));
}
