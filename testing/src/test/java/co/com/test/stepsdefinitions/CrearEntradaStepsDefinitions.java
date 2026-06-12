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

        String letras = "";
        String abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (int i = 0; i < 3; i++) {
            int indice = (int) (System.currentTimeMillis() % 26) + i;
            letras += abecedario.charAt(indice % 26);
        }

        String nombrePlaca = letras + (100 + (System.currentTimeMillis() % 900));
        DatosEntrada datos = new DatosEntrada();
        datos.setPlaca(nombrePlaca);
        List<DatosEntrada> datosEntrada = new ArrayList<>();
        datosEntrada.add(datos);
        theActorInTheSpotlight().remember("nombrePlaca", nombrePlaca);
        theActorInTheSpotlight().attemptsTo(CrearNuevaEntrada.conLosDatos(datosEntrada));
    }
}