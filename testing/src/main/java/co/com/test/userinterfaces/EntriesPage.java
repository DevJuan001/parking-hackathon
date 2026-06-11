package co.com.test.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class EntriesPage {
    public static final Target BTN_CREAR_ENTRADA = Target.the("boton crear entrada")
            .located(By.xpath("//button[.//span[text()='Registrar Ingreso']]"));
    public static final Target INPUT_PLACA = Target.the("input placa")
            .located(By.name("plate"));
    public static final Target BTN_CONFIRMAR_EXITO = Target.the("boton confirmar modal exito")
            .located(By.id("confirm-button"));
}
