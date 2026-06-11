package co.com.test.stepsdefinitions;

import co.com.test.models.DatosPiso;
import co.com.test.tasks.CrearNuevoPiso;
import cucumber.api.java.es.Cuando;

import java.util.ArrayList;
import java.util.List;

import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class CrearPisoStepsDefinitions {

    @Cuando("^crea un nuevo piso$")
    public void creaUnNuevoPiso() {
        String nombrePiso = "P" + (System.currentTimeMillis() % 10000);
        DatosPiso datos = new DatosPiso();
        datos.setNombrePiso(nombrePiso);
        List<DatosPiso> datosPiso = new ArrayList<>();
        datosPiso.add(datos);
        theActorInTheSpotlight().remember("nombrePiso", nombrePiso);
        theActorInTheSpotlight().attemptsTo(CrearNuevoPiso.conLosDatos(datosPiso));
    }
}
