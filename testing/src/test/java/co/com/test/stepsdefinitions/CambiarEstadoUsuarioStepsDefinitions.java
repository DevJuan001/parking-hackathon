package co.com.test.stepsdefinitions;

import co.com.test.questions.ValidarCambioEstadoUsuario;
import co.com.test.tasks.CambiarEstadoUsuario;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class CambiarEstadoUsuarioStepsDefinitions {

    @Cuando("^cambia el estado de un usuario$")
    public void cambiaElEstadoDeUnUsuario() {
        theActorInTheSpotlight().attemptsTo(CambiarEstadoUsuario.deUnUsuario());
    }

    @Entonces("^deberia ver el cambio de estado en la tabla$")
    public void deberiaVerElCambioDeEstadoEnLaTabla() {
        theActorInTheSpotlight().should(seeThat(ValidarCambioEstadoUsuario.haCambiado()));
    }
}
