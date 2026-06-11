package co.com.test.tasks;

import co.com.test.models.DatosPiso;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Enter;
import org.openqa.selenium.WebElement;

import java.util.List;

import static co.com.test.userinterfaces.ModalConfirmacion.BTN_CONFIRMAR;
import static co.com.test.userinterfaces.ParkingPage.*;

public class CrearNuevoPiso implements Task {

    private List<DatosPiso> datosPiso;

    public CrearNuevoPiso(List<DatosPiso> datosPiso) {
        this.datosPiso = datosPiso;
    }

    public static CrearNuevoPiso conLosDatos(List<DatosPiso> datosPiso) {
        return Instrumented.instanceOf(CrearNuevoPiso.class)
                .withProperties(datosPiso);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        WebElement crearBoton = BTN_CREAR_PISO.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", crearBoton);
        actor.attemptsTo(
                Enter.theValue(datosPiso.get(0).getNombrePiso()).into(INPUT_NOMBRE_PISO)
        );
        WebElement botonConfirmar = BTN_CONFIRMAR.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", botonConfirmar);
    }
}
