package co.com.test.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.test.userinterfaces.NavigationPage.LINK_USUARIOS;

public class NavegarAUsuarios implements Task {

    public static NavegarAUsuarios navegar() {
        return Tasks.instrumented(NavegarAUsuarios.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Click.on(LINK_USUARIOS));
    }
}
