package co.com.test.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import net.thucydides.core.pages.PageObject;
import org.openqa.selenium.By;

public class autenticacion extends PageObject {

    public static final Target INPUT_USUARIO =
            Target.the("campo usuario")
                    .located(By.id("email"));

    public static final Target INPUT_CLAVE =
            Target.the("campo clave")
                    .located(By.id("password"));

    public static final Target BTN_INICIOSESION =
            Target.the("botón iniciar sesión")
                    .located(By.id("login-button"));

    public static final Target MENSAJE_LOGIN =
            Target.the("mensaje bienvenida Plazas")
                    .located(By.xpath("//span[@class='font-semibold' and text()='Plazas']"));

}

