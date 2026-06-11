package co.com.test.tasks;

import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.core.pages.WebElementFacade;

import java.util.List;
import java.util.Random;

import static co.com.test.userinterfaces.UsersPage.BTN_EDITAR_USUARIO;

public class EditarUsuario implements Task {

    public EditarUsuario() {}

    public static EditarUsuario conElEmail() {
        return Instrumented.instanceOf(EditarUsuario.class)
                .withProperties();
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        List<WebElementFacade> botonesEditar = BTN_EDITAR_USUARIO.resolveAllFor(actor);
        if (botonesEditar.isEmpty()) {
            throw new IllegalStateException("No se encontraron usuarios para editar");
        }
        int indiceAleatorio = new Random().nextInt(botonesEditar.size());
        WebElementFacade botonAleatorio = botonesEditar.get(indiceAleatorio);
        botonAleatorio.click();
    }
}
