import HomePage from "../../modules/home/HomePage";
import UsersPage from "../../modules/users/UsersPage";
import ExitsPage from "../../modules/exits/ExitsPage";
import EntriesPage from "../../modules/entries/EntriesPage";
import TariffsPage from "../../modules/tariffs/TarrifsPage";
import ParkingPage from "../../modules/parking/ParkingPage";
import FinancePage from "../../modules/finance/FinancePage";
import CheckInPage from "../../modules/check-in/CheckInPage";
import VehiclePayment from "../../modules/vehicle-payment/VehiclePayment";

export const routesConfig = [
  {
    path: "/home",
    component: HomePage,
    roles: ["Admin"],
  },

  {
    path: "/users",
    component: UsersPage,
    roles: ["Admin"],
  },

  {
    path: "/entries",
    component: EntriesPage,
    roles: ["Admin"],
  },

  {
    path: "/parking",
    component: ParkingPage,
    roles: ["Admin"],
  },

  {
    path: "/exits",
    component: ExitsPage,
    roles: ["Admin"],
  },

  {
    path: "/tariffs",
    component: TariffsPage,
    roles: ["Admin"],
  },

  {
    path: "/finance",
    component: FinancePage,
    roles: ["Admin"],
  },

  {
    path: "/vehicle-payment",
    component: VehiclePayment,
    roles: ["Cliente"],
  },

  {
    path: "/check-in",
    component: CheckInPage,
    roles: ["Cliente"],
  },
];
