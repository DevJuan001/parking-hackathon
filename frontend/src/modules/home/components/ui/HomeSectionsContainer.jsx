import ParkingPlace from "./ParkingPlace";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";

export default function HomeSectionsContainer() {
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

        <div className="h-full w-full grid grid-cols-8 grid-rows-7 pt-2">
          <ParkingPlace name={"123"} status={"Disponible"} />
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
