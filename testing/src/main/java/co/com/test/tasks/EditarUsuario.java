package co.com.test.tasks;

import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.core.pages.WebElementFacade;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static co.com.test.userinterfaces.ModalConfirmacion.BTN_CONFIRMAR;
import static co.com.test.userinterfaces.UsersPage.BTN_EDITAR_USUARIO;
import static co.com.test.userinterfaces.UsersPage.INPUT_EMAIL;

public class EditarUsuario implements Task {

    public EditarUsuario() {}

    public static EditarUsuario conElEmail() {
        return Instrumented.instanceOf(EditarUsuario.class)
                .withProperties();
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        String emailLogueado = actor.recall("usuario");
        List<WebElementFacade> todosLosBotones = BTN_EDITAR_USUARIO.resolveAllFor(actor);
        List<WebElementFacade> botonesEditar = new ArrayList<>();
        for (WebElementFacade boton : todosLosBotones) {
            String emailFila = boton.findElement(By.xpath("ancestor::tr/th[5]")).getText().trim();
            if (!emailFila.equals(emailLogueado)) {
                botonesEditar.add(boton);
            }
        }
        if (botonesEditar.isEmpty()) {
            throw new IllegalStateException("No hay otros usuarios para editar");
        }
        int indiceAleatorio = new Random().nextInt(botonesEditar.size());
        WebElementFacade botonAleatorio = botonesEditar.get(indiceAleatorio);

        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", botonAleatorio);

        String nuevoEmail = "editado_" + (System.currentTimeMillis() % 100000) + "@test.com";
        actor.attemptsTo(Enter.theValue(nuevoEmail).into(INPUT_EMAIL));

        WebElement botonConfirmar = BTN_CONFIRMAR.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", botonConfirmar);
    }
}
