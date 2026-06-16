// Componentes
import Icon from "../../../../globals/components/ui/Icon";
import Skeleton from "../../../../globals/components/ui/Skeleton";
// Constants
import { vehicleTypesConstant } from "../../../../globals/constants/vehicleTypes";
// Utils
import {
  formatDateTime,
  formatTimeDate,
} from "../../../../utils/formatDateTime";

export default function EntriesTable({ entries, loading }) {
  const noEntries = entries.length === 0 && !loading;
  const isFirstLoad = entries.length === 0 && loading;

  return (
    <div className="w-full h-auto max-h-[700px] border rounded-2xl overflow-y-auto">
      {noEntries && (
        <div
          className="h-[700px] flex flex-col items-center justify-center gap-1 rounded-2xl text-[#7E8088] bg-[#f5f3f6]
          dark:text-[#E4E2E5]"
        >
          <div className="flex items-center justify-center w-24 h-24 rounded-full">
            <Icon name={"border_clear"} size={60} />
          </div>

          <span className="text-xl font-medium text-center">
            No hay ingresos registrados
          </span>
        </div>
      )}

      {isFirstLoad ? (
        <Skeleton
          width="100%"
          height="700px"
          borderRadius={"15px"}
          backgroundColor={"#F3EEF5"}
          darkModeBackgroundColor={"#101012"}
          shineColor="#C5C1C7"
          darkModeShineColor="#1e1e1e"
        />
      ) : (
        !noEntries && (
          <table className="h-full w-full">
            <thead className="sticky top-0 z-10 h-12 border-b bg-[#FBF9FC]">
              <tr>
                <th className="font-medium text-sm pl-4 text-start">
                  <div className="flex gap-1">
                    <Icon name={"emoji_transportation"} size={20} fill />

                    <span>Placa</span>
                  </div>
                </th>

                <th className="font-medium text-sm pl-4 text-start">
                  <div className="flex gap-1">
                    <Icon name={"traffic_jam"} size={20} fill />

                    <span>Tipo de vehículo</span>
                  </div>
                </th>

                <th className="font-medium text-sm pl-4 text-start">
                  <div className="flex gap-1">
                    <Icon name={"pin_drop"} size={20} fill />

                    <span>Plaza</span>
                  </div>
                </th>

                <th className="font-medium text-sm pl-4 text-start">
                  <div className="flex gap-1">
                    <Icon name={"nest_clock_farsight_analog"} size={20} />

                    <span>Hora de ingreso</span>
                  </div>
                </th>

                <th className="font-medium text-sm pl-4 text-start">
                  <div className="flex gap-1">
                    <Icon name={"calendar_today"} size={20} fill />

                    <span>Fecha de ingreso</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="h-12 transition-colors duration-200 hover:bg-[#f5f3f6]"
                >
                  <th className="font-medium text-sm pl-4 text-start">
                    {entry.plate}
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    <div className="flex gap-1">
                      <Icon
                        name={vehicleTypesConstant[entry.vehicle_type].icon}
                        size={18}
                        fill
                      />

                      <span>{vehicleTypesConstant[entry.vehicle_type].text}</span>
                    </div>
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    {entry.spot}
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    {formatTimeDate(entry.created_at)}
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    {formatDateTime(entry.created_at)}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
