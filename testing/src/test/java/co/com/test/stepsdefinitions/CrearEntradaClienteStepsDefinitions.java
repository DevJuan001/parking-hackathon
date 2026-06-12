package co.com.test.stepsdefinitions;

import co.com.test.models.DatosEntrada;
import co.com.test.questions.ValidarAgradecimiento;
import co.com.test.tasks.IngresarPlacaCliente;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;
import static org.hamcrest.Matchers.is;

public class CrearEntradaClienteStepsDefinitions {

    private static final String LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String DIGITOS = "0123456789";

    @Cuando("^ingresa su placa en el check-in$")
    public void ingresaSuPlacaEnElCheckIn() {
        Random random = new Random();
        StringBuilder placa = new StringBuilder(6);
        for (int i = 0; i < 3; i++) {
            placa.append(LETRAS.charAt(random.nextInt(LETRAS.length())));
        }
        for (int i = 0; i < 3; i++) {
            placa.append(DIGITOS.charAt(random.nextInt(DIGITOS.length())));
        }

        DatosEntrada datos = new DatosEntrada();
        datos.setPlaca(placa.toString());
        List<DatosEntrada> datosEntrada = new ArrayList<>();
        datosEntrada.add(datos);
        theActorInTheSpotlight().remember("nombrePlaca", placa.toString());
        theActorInTheSpotlight().attemptsTo(IngresarPlacaCliente.conLosDatos(datosEntrada));
    }

    @Entonces("^deberia ver el mensaje de agradecimiento$")
    public void deberiaVerElMensajeDeAgradecimiento() {
        theActorInTheSpotlight().should(seeThat(ValidarAgradecimiento.validar(), is(true)));
    }
}
