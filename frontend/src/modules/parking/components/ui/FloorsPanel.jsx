// Hooks
import { useFloors } from "../../hooks/useFloors";
// Components
import Icon from "../../../../globals/components/ui/Icon";
import Skeleton from "../../../../globals/components/ui/Skeleton";
import CreateButton from "../../../../globals/components/ui/CreateButton";

export default function FloorsPanel({ openModal }) {
  const { floors, loading } = useFloors();
  const nofloors = floors.length === 0 && !loading;
  const isFirstLoad = floors.length === 0 && loading;

  return (
    <div
      className="h-full w-full flex flex-col px-7 py-5 rounded-[50px] border-3 border-[#EBE6E7]
      dark:text-white"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">Pisos</span>

        <CreateButton
          borderRadius={"20px"}
          onClick={(e) => openModal(null, "createTariff", e.currentTarget)}
        />
      </div>

      <div className="h-full w-full flex flex-col gap-2 pt-4 overflow-y-auto">
        {nofloors && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-[#75777E]">
            <Icon name={"border_clear"} size={90} />

            <span className="text-xl font-semibold">
              Aún no hay pisos registradas
            </span>
          </div>
        )}

        {isFirstLoad ? (
          <Skeleton
            count={6}
            height="60px"
            marginBottom={0}
            shineColor="#C5C1C7"
            borderRadius={"16px"}
            backgroundColor={"#F3EEF5"}
            darkModeShineColor="#1e1e1e"
            darkModeBackgroundColor={"#101012"}
          />
        ) : (
          floors.map((floor) => (
            <button
              key={floor.id}
              onClick={(e) => openModal(floor, "editFloor", e.currentTarget)}
              className="flex items-center gap-3 px-3 py-2 rounded-2xl transition-colors hover:bg-[#efedf0] dark:hover:bg-[#ffffff15]"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#EAE8EB] dark:bg-[#1e1e20cb]">
                <Icon name="stairs" size={20} fill />
              </div>

              <div className="flex-1 text-left">
                <span className="font-semibold">Piso {floor.floor_number}</span>
              </div>

              <Icon
                name="edit"
                size={18}
                className="text-gray-400 dark:text-gray-500"
              />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
