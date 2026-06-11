package co.com.test.stepsdefinitions;

import co.com.test.questions.ValidacionLogin;
import co.com.test.tasks.AbrirPagina;
import co.com.test.tasks.Autenticarse;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Dado;
import cucumber.api.java.es.Entonces;
import co.com.test.models.CredencialesInicioSesion;

import java.util.List;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class LoginStepsDefinitions {

    @Dado("^que el usuario está en la página de inicio de sesión$")
    public void queElUsuarioEstáEnLaPáginaDeInicioDeSesión() {
        theActorInTheSpotlight().attemptsTo(AbrirPagina.laPagina());
    }

    @Cuando("^el usuario ingresa credenciales válidas$")
    public void elUsuarioIngresaCredencialesVálidas(List<CredencialesInicioSesion> credenciales) {
        theActorInTheSpotlight().attemptsTo(Autenticarse.aute(credenciales));
    }

    @Entonces("^el usuario debería estar en la pagina de bienvenida$")
    public void elUsuarioDeberíaEstarEnLaPaginaDeBienvenida() {
        theActorInTheSpotlight().should(seeThat(ValidacionLogin.validacionLogin()));
    }

}