package co.com.test.utils.hooks;

import cucumber.api.java.Before;
import net.serenitybdd.screenplay.actors.OnlineCast;

import static net.serenitybdd.screenplay.actors.OnStage.setTheStage;
import static net.serenitybdd.screenplay.actors.OnStage.theActorCalled;

public class PrepararEscenario {

    @Before
    public void preparar() {
        setTheStage(new OnlineCast());
        theActorCalled("usuario");
    }

}
