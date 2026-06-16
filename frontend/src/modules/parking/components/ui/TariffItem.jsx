import Icon from "../../../../globals/components/ui/Icon";
import { vehicleTypesConstant } from "../../../../globals/constants/vehicleTypes";

export default function TariffItem({ openModal, tariff }) {
  return (
    <button
      key={tariff.id}
      onClick={(e) => openModal(tariff, "editTariff", e.currentTarget)}
      className="h-32 w-32 flex flex-col items-center gap-3 px-3 py-5 rounded-3xl bg-[#efedf0] transition-colors
      hover:bg-[#EAE8EB]
      dark:bg-[#101012] dark:hover:bg-[#ffffff15]"
    >
      <Icon name="payments" size={30} fill />

      <div className="flex flex-col items-center justify-between">
        <span className="font-semibold">
          {vehicleTypesConstant[tariff.vehicle_type]?.text}
        </span>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          ${Number(tariff.value).toLocaleString("es-AR")}
        </span>
      </div>
    </button>
  );
}
