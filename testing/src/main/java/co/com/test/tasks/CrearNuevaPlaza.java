package co.com.test.tasks;

import co.com.test.models.DatosPlaza;
import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Enter;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.Random;

import static co.com.test.userinterfaces.ModalConfirmacion.BTN_CONFIRMAR;
import static co.com.test.userinterfaces.ParkingPage.*;

public class CrearNuevaPlaza implements Task {

    private List<DatosPlaza> datosPlaza;

    public CrearNuevaPlaza(List<DatosPlaza> datosPlaza) {
        this.datosPlaza = datosPlaza;
    }

    public static CrearNuevaPlaza conLosDatos(List<DatosPlaza> datosPlaza) {
        return Instrumented.instanceOf(CrearNuevaPlaza.class)
                .withProperties(datosPlaza);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        seleccionarPisoAleatorio(actor);

        WebElement crearBoton = BTN_CREAR_PLAZA.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", crearBoton);
        actor.attemptsTo(
                Enter.theValue(datosPlaza.get(0).getNombrePlaza()).into(INPUT_NOMBRE_PLAZA)
        );
        WebElement botonConfirmar = BTN_CONFIRMAR.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", botonConfirmar);
    }

    private <T extends Actor> void seleccionarPisoAleatorio(T actor) {
        WebElement floorsMenu = SELECT_FLOOR_MENU.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", floorsMenu);

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        List<WebElement> floorOptions = BrowseTheWeb.as(actor).getDriver()
                .findElements(By.cssSelector("button[id^='floors-menu-'][id$='-option']"));

        if (!floorOptions.isEmpty()) {
            int randomIndex = new Random().nextInt(floorOptions.size());
            BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", floorOptions.get(randomIndex));
        }

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
