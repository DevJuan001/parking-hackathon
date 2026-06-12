package co.com.test.tasks;

import co.com.test.models.DatosEntrada;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Enter;
import org.openqa.selenium.WebElement;

import java.util.List;

import static co.com.test.userinterfaces.CheckInPage.BTN_ENVIAR;
import static co.com.test.userinterfaces.CheckInPage.INPUT_PLACA;

public class IngresarPlacaCliente implements Task {

    private List<DatosEntrada> datosEntrada;

    public IngresarPlacaCliente(List<DatosEntrada> datosEntrada) {
        this.datosEntrada = datosEntrada;
    }

    public static IngresarPlacaCliente conLosDatos(List<DatosEntrada> datosEntrada) {
        return Instrumented.instanceOf(IngresarPlacaCliente.class)
                .withProperties(datosEntrada);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Enter.theValue(datosEntrada.get(0).getPlaca()).into(INPUT_PLACA)
        );
        WebElement botonEnviar = BTN_ENVIAR.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", botonEnviar);
    }
}
