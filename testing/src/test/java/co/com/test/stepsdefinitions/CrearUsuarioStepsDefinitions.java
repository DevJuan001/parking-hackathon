package co.com.test.stepsdefinitions;

import co.com.test.models.DatosUsuario;
import co.com.test.tasks.CrearNuevoUsuario;
import cucumber.api.java.es.Cuando;

import java.util.ArrayList;
import java.util.List;

import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class CrearUsuarioStepsDefinitions {

    @Cuando("^crea un nuevo usuario$")
    public void creaUnNuevoUsuario() {
        String random = String.valueOf(System.currentTimeMillis());
        DatosUsuario datos = new DatosUsuario();
        datos.setNombre("Carlos_" + random);
        datos.setApellido("Perez_" + random);
        datos.setSegundoApellido("Lopez_" + random);
        datos.setEmail("carlos_" + random + "@test.com");
        datos.setRoleId("1");
        List<DatosUsuario> datosUsuario = new ArrayList<>();
        datosUsuario.add(datos);
        theActorInTheSpotlight().attemptsTo(CrearNuevoUsuario.conLosDatos(datosUsuario));
    }
}
