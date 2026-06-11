package co.com.test.tasks;

import net.serenitybdd.core.steps.Instrumented;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.core.pages.WebElementFacade;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.Random;

import static co.com.test.userinterfaces.ModalConfirmacion.BTN_CONFIRMAR;
import static co.com.test.userinterfaces.UsersPage.BTN_CAMBIAR_ESTADO;

public class CambiarEstadoUsuario implements Task {

    public CambiarEstadoUsuario() {}

    public static CambiarEstadoUsuario deUnUsuario() {
        return Instrumented.instanceOf(CambiarEstadoUsuario.class)
                .withProperties();
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        String emailLogueado = actor.recall("usuario");
        List<WebElementFacade> todosLosBotones = BTN_CAMBIAR_ESTADO.resolveAllFor(actor);
        List<WebElementFacade> botonesEstado = new java.util.ArrayList<>();
        for (WebElementFacade boton : todosLosBotones) {
            String emailFila = boton.findElement(By.xpath("ancestor::tr/th[5]")).getText().trim();
            if (!emailFila.equals(emailLogueado)) {
                botonesEstado.add(boton);
            }
        }
        if (botonesEstado.isEmpty()) {
            throw new IllegalStateException("No hay otros usuarios para cambiar estado");
        }
        int indiceAleatorio = new Random().nextInt(botonesEstado.size());
        WebElementFacade botonAleatorio = botonesEstado.get(indiceAleatorio);

        String botonId = botonAleatorio.getAttribute("id");
        actor.remember("botonEstadoId", botonId);

        String statusAnterior = botonAleatorio.findElement(By.xpath("ancestor::tr/th[7]//span")).getText().trim();
        actor.remember("statusAnterior", statusAnterior);

        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", botonAleatorio);

        WebElement botonConfirmar = BTN_CONFIRMAR.resolveFor(actor);
        BrowseTheWeb.as(actor).evaluateJavascript("arguments[0].click();", botonConfirmar);
    }
}
