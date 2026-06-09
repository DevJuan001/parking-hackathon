import Icon from "../../../../globals/components/ui/Icon";
import { placeStatus } from "../../constants/placeStatus";

export default function ParkingPlace({ name, status = 2, onClick }) {
  const config = placeStatus[status] || placeStatus[2];

  return (
    <button
      onClick={onClick}
      className={`h-full w-full flex flex-col items-center justify-center gap-2 rounded-3xl transition-colors duration-200
      ${config.styles}`}
    >
      <span className="font-semibold">{name}</span>

      <div className="flex flex-col items-center gap-1">
        <Icon
          name={config.icon}
          size={14}
          color={config.fill ? undefined : "#FFFFFF"}
          fill={config.fill}
        />

        <span className="text-xs">{config.text}</span>
      </div>
    </button>
  );
}
