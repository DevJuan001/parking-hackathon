package co.com.test.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class UsersPage {
    public static final Target BTN_CREAR_USUARIO = Target.the("boton crear usuario")
            .located(By.xpath("//button[.//span[text()='Crear Usuario']]"));
    public static final Target BTN_EDITAR_USUARIO = Target.the("boton editar usuario")
            .located(By.xpath("//button[contains(@id,'edit-user-')]"));
    public static final Target BTN_CAMBIAR_ESTADO = Target.the("boton cambiar estado usuario")
            .located(By.xpath("//button[contains(@id,'delete-user-')]"));
    public static final Target BTN_CONFIRMAR_EXITO = Target.the("boton confirmar modal exito")
            .located(By.id("confirm-button"));
    public static final Target INPUT_NOMBRE = Target.the("input nombre")
            .located(By.name("name"));
    public static final Target INPUT_APELLIDO = Target.the("input primer apellido")
            .located(By.name("first_surname"));
    public static final Target INPUT_SEGUNDO_APELLIDO = Target.the("input segundo apellido")
            .located(By.name("second_surname"));
    public static final Target INPUT_EMAIL = Target.the("input email")
            .located(By.name("email"));
    public static final Target INPUT_EMAIL_EDITAR = Target.the("input email en edicion")
            .located(By.name("email"));
    public static final Target BTN_SELECT_ROL = Target.the("selector de rol")
            .located(By.id("role-menu"));
    public static final Target OPTION_ADMIN = Target.the("opcion admin")
            .located(By.id("role-menu-1-option"));
}
