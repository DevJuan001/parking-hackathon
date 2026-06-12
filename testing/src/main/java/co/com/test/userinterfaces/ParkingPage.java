package co.com.test.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class ParkingPage {
    public static final Target BTN_CREAR_PISO = Target.the("boton crear piso")
            .located(By.xpath("//span[text()='Pisos']/following-sibling::button"));
    public static final Target BTN_CREAR_PLAZA = Target.the("boton crear plaza")
            .located(By.xpath("//span[text()='Plazas']/ancestor::div[contains(@class,'h-full')]//button[.//span[contains(@class,'material-symbols-rounded') and text()='add']]"));
    public static final Target INPUT_NOMBRE_PISO = Target.the("input nombre piso")
            .located(By.name("name"));
    public static final Target INPUT_NOMBRE_PLAZA = Target.the("input nombre plaza")
            .located(By.name("spot"));
    public static final Target BTN_CONFIRMAR_EXITO = Target.the("boton confirmar modal exito")
            .located(By.id("confirm-button"));
    public static final Target SELECT_FLOOR_MENU = Target.the("selector de piso")
            .located(By.id("floors-menu"));
}
