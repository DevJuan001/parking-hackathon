import HomePage from "../../modules/home/HomePage";
import UsersPage from "../../modules/users/UsersPage";
import ExitsPage from "../../modules/exits/ExitsPage";
import EntriesPage from "../../modules/entries/EntriesPage";
import TariffsPage from "../../modules/tariffs/TarrifsPage";
import ParkingPage from "../../modules/parking/ParkingPage";

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
];
