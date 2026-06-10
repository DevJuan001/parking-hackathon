// Hooks
import { useFloors } from "../../hooks/useFloors";
import { useFilterSpots } from "../../hooks/useFilterSpots";
import { useParkingSpots } from "../../hooks/useParkingSpots";
// Components
import Icon from "../../../../globals/components/ui/Icon";
import Skeleton from "../../../../globals/components/ui/Skeleton";
// Constants
import SpotItem from "./SpotItem";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";

export default function SpotsPanel({ openModal }) {
  const { floors } = useFloors();
  const { spots, loading, filters, setFilters } = useParkingSpots();
  const { handleChange } = useFilterSpots(filters, setFilters);
  const noSpots = spots.length === 0 && !loading;
  const isFirstLoad = spots.length === 0 && loading;

  return (
    <div className="h-full w-full px-7 py-6 flex flex-col gap-1 col-span-1 row-span-2 border-3 border-[#EBE6E7] rounded-[50px] dark:text-white">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Plazas</span>

        <SelectMenu
          id={"floors-menu"}
          name={"floor_id"}
          value={filters.floor_id}
          onChange={handleChange}
          miniVersion={true}
          options={floors.map((floor) => ({
            value: floor.id,
            label: floor.name,
          }))}
        />
      </div>

      {noSpots && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-[#75777E]">
          <Icon name={"border_clear"} size={90} />

          <span className="text-xl font-semibold">
            Aún no hay plazas registradas
          </span>
        </div>
      )}

      {isFirstLoad ? (
        <Skeleton
          height="95%"
          backgroundColor={"#F3EEF5"}
          darkModeBackgroundColor={"#101012"}
          shineColor="#C5C1C7"
          darkModeShineColor="#1e1e1e"
          borderRadius={"16px"}
        />
      ) : (
        !noSpots && (
          <div
            className="h-full w-full grid grid-cols-8 grid-rows-7 pt-2 gap-2
            lg:gap-x-2 lg:gap-y-4
            2xl:gap-2.5"
          >
            {spots.map((spot) => (
              <SpotItem
                key={spot.spot_id}
                name={spot.spot}
                status={spot.spot_status}
                onClick={(e) => openModal(spot, "editSpot", e.currentTarget)}
              />
            ))}

            <button
              onClick={(e) => openModal(null, "createSpot", e.currentTarget)}
              className="h-full w-full flex flex-col items-center justify-center gap-2 border-2 rounded-3xl transition-colors 
            hover:bg-[#efedf0] 
            dark:hover:bg-[#ffffff15]"
            >
              <Icon name={"add"} size={35} />
            </button>
          </div>
        )
      )}
    </div>
  );
}
