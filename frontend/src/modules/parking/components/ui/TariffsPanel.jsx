// Hooks
import { useTariffs } from "../../hooks/useTariffs";
// Components
import TariffItem from "./TariffItem";
import Icon from "../../../../globals/components/ui/Icon";
import Skeleton from "../../../../globals/components/ui/Skeleton";

export default function TariffsPanel({ openModal }) {
  const { tariffs, loading } = useTariffs();
  const noTariffs = tariffs.length === 0 && !loading;
  const isFirstLoad = tariffs.length === 0 && loading;

  return (
    <div
      className="h-full w-full flex flex-col gap-2 px-7 py-6 rounded-[50px] border-3 border-[#EBE6E7] 
      dark:text-white"
    >
      <div className="flex items-center">
        <span className="font-semibold">Tarifas</span>
      </div>

      {noTariffs && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-[#75777E]">
          <Icon name={"border_clear"} size={90} />

          <span className="text-xl font-semibold">
            Aún no hay tarifas registradas
          </span>
        </div>
      )}

      {isFirstLoad ? (
        <div className="h-full w-full flex flex-wrap pt-4 gap-2">
          <Skeleton
            count={12}
            width="128px"
            height="128px"
            borderRadius={"16px"}
            backgroundColor={"#F3EEF5"}
            darkModeBackgroundColor={"#101012"}
            shineColor="#C5C1C7"
            darkModeShineColor="#1e1e1e"
          />
        </div>
      ) : (
        !noTariffs && (
          <div className="h-full w-full flex flex-wrap gap-2 overflow-y-auto">
            {tariffs.map((tariff) => (
              <TariffItem openModal={openModal} tariff={tariff} />
            ))}

            <button
              onClick={(e) => openModal(null, "createTariff", e.currentTarget)}
              className="h-32 w-32 flex flex-col items-center justify-center rounded-3xl transition-colors border-2 
                hover:bg-[#efedf0] 
                dark:hover:bg-[#ffffff15]"
            >
              <Icon name="add" size={20} fill />
            </button>
          </div>
        )
      )}
    </div>
  );
}
