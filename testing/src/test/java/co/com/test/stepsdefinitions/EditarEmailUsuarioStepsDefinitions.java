package co.com.test.stepsdefinitions;

import co.com.test.models.DatosEmailNuevo;
import co.com.test.tasks.EditarEmailUsuario;
import cucumber.api.java.es.Cuando;

import java.util.ArrayList;
import java.util.List;

import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class EditarEmailUsuarioStepsDefinitions {

    @Cuando("^edita el email del usuario$")
    public void editaElEmailDelUsuario() {
        String random = String.valueOf(System.currentTimeMillis());
        DatosEmailNuevo datos = new DatosEmailNuevo();
        datos.setEmailNuevo("nuevo_email_" + random + "@test.com");
        List<DatosEmailNuevo> datosEmailNuevo = new ArrayList<>();
        datosEmailNuevo.add(datos);
        theActorInTheSpotlight().attemptsTo(EditarEmailUsuario.conElNuevoEmail(datosEmailNuevo));
    }
}
