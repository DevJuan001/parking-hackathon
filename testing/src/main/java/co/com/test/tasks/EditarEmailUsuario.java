package co.com.test.tasks;

import co.com.test.models.DatosEmailNuevo;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Enter;
import org.openqa.selenium.WebElement;

import java.util.List;

import static co.com.test.userinterfaces.UsersPage.INPUT_EMAIL_EDITAR;
import static co.com.test.userinterfaces.ModalConfirmacion.BTN_CONFIRMAR;

public class EditarEmailUsuario implements Task {

    private List<DatosEmailNuevo> datosEmailNuevo;

    public EditarEmailUsuario(List<DatosEmailNuevo> datosEmailNuevo) {
        this.datosEmailNuevo = datosEmailNuevo;
    }

    public static EditarEmailUsuario conElNuevoEmail(List<DatosEmailNuevo> datosEmailNuevo) {
        return Instrumented.instanceOf(EditarEmailUsuario.class)
                .withProperties(datosEmailNuevo);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Enter.theValue(datosEmailNuevo.get(0).getEmailNuevo()).into(INPUT_EMAIL_EDITAR)
        );
        WebElement botonConfirmar = BTN_CONFIRMAR.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", botonConfirmar);
    }
}
