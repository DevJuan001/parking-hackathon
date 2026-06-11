package co.com.test.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.test.userinterfaces.NavigationPage.LINK_PARKING;

public class NavegarAParking implements Task {

    public static NavegarAParking navegar() {
        return Tasks.instrumented(NavegarAParking.class);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Click.on(LINK_PARKING));
    }
}
