package co.com.test.tasks;

import co.com.test.models.DatosEntrada;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Enter;
import org.openqa.selenium.WebElement;

import java.util.List;

import static co.com.test.userinterfaces.ModalConfirmacion.BTN_CONFIRMAR;
import static co.com.test.userinterfaces.EntriesPage.*;

public class CrearNuevaEntrada implements Task {

    private List<DatosEntrada> datosEntrada;

    public CrearNuevaEntrada(List<DatosEntrada> datosEntrada) {
        this.datosEntrada = datosEntrada;
    }

    public static CrearNuevaEntrada conLosDatos(List<DatosEntrada> datosEntrada) {
        return Instrumented.instanceOf(CrearNuevaEntrada.class)
                .withProperties(datosEntrada);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        WebElement crearBoton = BTN_CREAR_ENTRADA.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", crearBoton);
        actor.attemptsTo(
                Enter.theValue(datosEntrada.get(0).getPlaca()).into(INPUT_PLACA)
        );
        WebElement botonConfirmar = BTN_CONFIRMAR.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", botonConfirmar);
    }
}
