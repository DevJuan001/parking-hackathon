// Hooks
import { useParkingPlaces } from "../../hooks/useParkingPlaces";
// Components
import ParkingPlace from "./ParkingPlace";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";
import Icon from "../../../../globals/components/ui/Icon";

export default function HomeSectionsContainer({ openModal }) {
  const { spots } = useParkingPlaces();

  return (
    <section className="h-full w-full grid grid-cols-2 grid-rows-2 gap-4 pb-2">
      <div className="h-full w-full px-7 py-6 col-span-1 row-span-2 border-3 border-[#EBE6E7] rounded-[50px] dark:text-white">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Plazas</span>

          <SelectMenu
            id={"floors-menu"}
            name={"floor"}
            miniVersion={true}
            options={[{ value: 1, label: "Piso 1" }]}
          />
        </div>

        <div
          className="h-full w-full grid grid-cols-8 grid-rows-7 pt-2 gap-2
          xl:gap-5"
        >
          {spots.map((spot) => (
            <ParkingPlace
              key={spot.spot_id}
              name={spot.spot}
              status={spot.spot_status}
              onClick={(e) => openModal(spot, "edit", e.currentTarget)}
            />
          ))}

          <button
            onClick={(e) => openModal(null, "create", e.currentTarget)}
            className="h-full w-full flex flex-col items-center justify-center gap-2 border-2 rounded-3xl hover:bg-[#efedf0] transition-colors dark:hover:bg-[#ffffff15]"
          >
            <Icon name={"add"} size={35} />
          </button>
        </div>
      </div>

      <div className="h-full w-full px-7 py-6 rounded-[50px] border-3 border-[#EBE6E7] dark:text-white">
        <span className="font-semibold">Entradas recientes</span>
      </div>

      <div className="h-full w-full px-7 py-6 rounded-[50px] border-3 border-[#EBE6E7] dark:text-white">
        <span className="font-semibold">Ganancias</span>
      </div>
    </section>
  );
}
