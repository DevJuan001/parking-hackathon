package co.com.test.stepsdefinitions;

import co.com.test.models.CredencialesInicioSesion;
import co.com.test.questions.ValidarMensajeExito;
import co.com.test.tasks.AbrirPagina;
import co.com.test.tasks.Autenticarse;
import co.com.test.tasks.EditarUsuario;
import co.com.test.tasks.NavegarAEntradas;
import co.com.test.tasks.NavegarAParking;
import co.com.test.tasks.NavegarAUsuarios;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import java.util.ArrayList;
import java.util.List;

import static co.com.test.userinterfaces.ModalConfirmacion.BTN_CONFIRMAR;
import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;
import static org.hamcrest.Matchers.containsString;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import org.openqa.selenium.WebElement;

public class SharedStepsDefinitions {

    @Cuando("^el usuario ha iniciado sesion$")
    public void elUsuarioHaIniciadoSesion() {
        CredencialesInicioSesion credencial = new CredencialesInicioSesion();
        credencial.setUsuario("juanesyt7@gmail.com");
        credencial.setClave("J%a2tojIk4NR");
        List<CredencialesInicioSesion> credenciales = new ArrayList<>();
        credenciales.add(credencial);
        theActorInTheSpotlight().attemptsTo(AbrirPagina.laPagina());
        theActorInTheSpotlight().attemptsTo(Autenticarse.aute(credenciales));
    }

    @Cuando("^navega a la seccion (.*)$")
    public void navegaALaSeccion(String seccion) {
        switch (seccion) {
            case "Usuarios":
                theActorInTheSpotlight().attemptsTo(NavegarAUsuarios.navegar());
                break;
            case "Parking":
                theActorInTheSpotlight().attemptsTo(NavegarAParking.navegar());
                break;
            case "Entradas":
                theActorInTheSpotlight().attemptsTo(NavegarAEntradas.navegar());
                break;
        }
    }

    @Cuando("^edita un usuario$")
    public void editaUnUsuario() {
        theActorInTheSpotlight().attemptsTo(EditarUsuario.conElEmail());
    }

    @Entonces("^deberia ver el mensaje de exito$")
    public void deberiaVerElMensajeDeExito() {
        theActorInTheSpotlight().should(
                seeThat(ValidarMensajeExito.validar(), containsString("éxito"))
        );
    }

    @Cuando("^cierra el modal de confirmacion$")
    public void cierraElModalDeConfirmacion() {
        WebElement botonConfirmar = BTN_CONFIRMAR.resolveFor(theActorInTheSpotlight());
        BrowseTheWeb.as(theActorInTheSpotlight()).evaluateJavascript("arguments[0].click();", botonConfirmar);
    }
}
