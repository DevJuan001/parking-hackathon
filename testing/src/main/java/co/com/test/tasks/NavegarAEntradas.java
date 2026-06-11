package co.com.test.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.test.userinterfaces.NavigationPage.LINK_ENTRADAS;

public class NavegarAEntradas implements Task {

    public static NavegarAEntradas navegar() {
        return Tasks.instrumented(NavegarAEntradas.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Click.on(LINK_ENTRADAS));
    }
}
