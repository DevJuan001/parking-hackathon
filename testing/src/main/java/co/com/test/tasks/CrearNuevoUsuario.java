package co.com.test.tasks;

import co.com.test.models.DatosUsuario;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import org.openqa.selenium.WebElement;

import java.util.List;

import static co.com.test.userinterfaces.ModalConfirmacion.BTN_CONFIRMAR;
import static co.com.test.userinterfaces.UsersPage.*;

public class CrearNuevoUsuario implements Task {

    private List<DatosUsuario> datosUsuario;

    public CrearNuevoUsuario(List<DatosUsuario> datosUsuario) {
        this.datosUsuario = datosUsuario;
    }

    public static CrearNuevoUsuario conLosDatos(List<DatosUsuario> datosUsuario) {
        return Instrumented.instanceOf(CrearNuevoUsuario.class)
                .withProperties(datosUsuario);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        DatosUsuario datos = datosUsuario.get(0);
        actor.attemptsTo(
                Click.on(BTN_CREAR_USUARIO),
                Enter.theValue(datos.getNombre()).into(INPUT_NOMBRE),
                Enter.theValue(datos.getApellido()).into(INPUT_APELLIDO),
                Enter.theValue(datos.getSegundoApellido()).into(INPUT_SEGUNDO_APELLIDO),
                Enter.theValue(datos.getEmail()).into(INPUT_EMAIL),
                Click.on(BTN_SELECT_ROL),
                Click.on(OPTION_ADMIN)
        );
        WebElement botonConfirmar = BTN_CONFIRMAR.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", botonConfirmar);
    }
}
