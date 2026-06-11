package co.com.test.stepsdefinitions;

import co.com.test.models.DatosEntrada;
import co.com.test.tasks.CrearNuevaEntrada;
import cucumber.api.java.es.Cuando;

import java.util.ArrayList;
import java.util.List;

import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class CrearEntradaStepsDefinitions {

    @Cuando("^crea una nueva entrada$")
    public void creaUnaNuevaEntrada() {
        String nombrePlaca = "PLACA" + (System.currentTimeMillis() % 10000);
        DatosEntrada datos = new DatosEntrada();
        datos.setPlaca(nombrePlaca);
        List<DatosEntrada> datosEntrada = new ArrayList<>();
        datosEntrada.add(datos);
        theActorInTheSpotlight().remember("nombrePlaca", nombrePlaca);
        theActorInTheSpotlight().attemptsTo(CrearNuevaEntrada.conLosDatos(datosEntrada));
    }
}
