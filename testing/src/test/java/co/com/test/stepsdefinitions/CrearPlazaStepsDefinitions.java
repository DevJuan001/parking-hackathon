package co.com.test.stepsdefinitions;

import co.com.test.models.DatosPlaza;
import co.com.test.tasks.CrearNuevaPlaza;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import java.util.ArrayList;
import java.util.List;

import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

public class CrearPlazaStepsDefinitions {

    @Cuando("^crea una nueva plaza$")
    public void creaUnaNuevaPlaza() {
        String nombrePlaza = "PZA" + (System.currentTimeMillis() % 10000);
        DatosPlaza datos = new DatosPlaza();
        datos.setNombrePlaza(nombrePlaza);
        List<DatosPlaza> datosPlaza = new ArrayList<>();
        datosPlaza.add(datos);
        theActorInTheSpotlight().remember("nombrePlaza", nombrePlaza);
        theActorInTheSpotlight().attemptsTo(CrearNuevaPlaza.conLosDatos(datosPlaza));
    }

    @Entonces("^deberia ver la plaza en la tabla$")
    public void deberiaVerLaPlazaEnLaTabla() {
        String nombrePlaza = theActorInTheSpotlight().recall("nombrePlaza");
        String xpath = String.format(
                "//div[contains(@class,'grid') and contains(@class,'grid-cols-8')]" +
                "//button[.//span[contains(@class,'font-semibold') and normalize-space(text())='%s']]",
                nombrePlaza
        );

        int maxRetries = 10;
        for (int i = 0; i < maxRetries; i++) {
            try {
                WebElement spot = BrowseTheWeb.as(theActorInTheSpotlight()).getDriver()
                        .findElement(By.xpath(xpath));
                if (spot.isDisplayed()) {
                    return;
                }
            } catch (NoSuchElementException e) {
                // continue retrying
            }
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
        throw new AssertionError("No se encontro la plaza '" + nombrePlaza + "' en la tabla");
    }
}
