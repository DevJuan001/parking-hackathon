package co.com.test.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

public class NavigationPage {
    public static final Target LINK_USUARIOS = Target.the("link usuarios")
            .located(By.xpath("//a[contains(.,'Usuarios')]"));
    public static final Target LINK_PARKING = Target.the("link parking")
            .located(By.xpath("//a[contains(.,'Parking')]"));
    public static final Target LINK_ENTRADAS = Target.the("link entradas")
            .located(By.xpath("//a[contains(.,'Entradas')]"));
}
