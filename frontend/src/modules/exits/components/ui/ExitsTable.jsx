// Componentes
import Icon from "../../../../globals/components/ui/Icon";
import Skeleton from "../../../../globals/components/ui/Skeleton";
// Utils
import { formatDateTime } from "../../../../utils/formatDateTime";

export default function ExitsTable({ exits, loading }) {
  const noExits = exits.length === 0 && !loading;
  const isFirstLoad = exits.length === 0 && loading;

  return (
    <div
      className="w-full h-full border rounded-2xl
      dark:border-[#17171a]"
    >
      {noExits && (
        <div
          className="h-[700px] flex flex-col items-center justify-center gap-1 rounded-2xl text-[#7E8088] bg-[#f5f3f6]
          dark:text-[#E4E2E5] dark:bg-black"
        >
          <div className="flex items-center justify-center w-24 h-24 rounded-full">
            <Icon name={"border_clear"} size={60} />
          </div>

          <span
            className="text-xl font-medium text-center
            dark:text-[#E4E2E5]"
          >
            No hay salidas registradas
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
        !noExits && (
          <table className="h-full w-full dark:bg-black">
            <thead
              className="sticky h-12 border-b
              hover:bg-[#f5f3f6]
              dark:border-[#17171a] dark:text-[#E4E2E5] dark:hover:bg-[#101012]"
            >
              <tr>
                <th className="font-medium text-sm pl-4 text-start">
                  <div className="flex gap-1">
                    <Icon name={"emoji_transportation"} size={20} fill />

                    <span>Placa</span>
                  </div>
                </th>

                <th className="font-medium text-sm pl-4 text-start">
                  <div className="flex gap-1">
                    <Icon name={"attach_money"} size={20} fill />

                    <span>Monto pagado</span>
                  </div>
                </th>

                <th className="font-medium text-sm pl-4 text-start">
                  <div className="flex gap-1">
                    <Icon name={"wallet"} size={20} />

                    <span>Metodo de pago</span>
                  </div>
                </th>

                <th className="font-medium text-sm pl-4 text-start">
                  <div className="flex gap-1">
                    <Icon name={"calendar_today"} size={20} fill />

                    <span>Fecha de salida</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="dark:text-white">
              {exits.map((exit) => (
                <tr
                  key={exit.id}
                  className="h-12 transition-colors duration-200
                  hover:bg-[#f5f3f6]
                  dark:hover:bg-[#101012]
                  "
                >
                  <th className="font-medium text-sm pl-4 text-start">
                    {exit.plate}
                  </th>

                  <th className="font-semibold text-sm pl-4 text-start">
                    {`$${exit.value}`}
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    {exit.payment_method}
                  </th>

                  <th className="font-medium text-sm pl-4 text-start">
                    {formatDateTime(exit.created_at)}
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
