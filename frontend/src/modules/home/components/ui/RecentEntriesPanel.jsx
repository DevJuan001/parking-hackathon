import RecentEntriesList from "./RecentEntriesListItem";
import { useRecentEntries } from "../../hooks/useRecentEntries";
import Skeleton from "../../../../globals/components/ui/Skeleton";
import Icon from "../../../../globals/components/ui/Icon";

export default function RecentEntriesPanel() {
  const { entries, loading } = useRecentEntries();
  const noEntries = entries.length === 0 && !loading;
  const isFirstLoad = entries.length === 0 && loading;

  return (
    <div
      className="h-full w-full flex flex-col px-7 py-6 rounded-[50px] border-3 border-[#EBE6E7]
      dark:text-white"
    >
      <span className="font-semibold">Entradas recientes</span>

      <div className="h-full w-full flex flex-col gap-2 pt-2 overflow-y-auto">
        {noEntries && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-[#75777E]">
            <Icon name={"border_clear"} size={90} />

            <span className="text-xl font-semibold">
              Aún no hay entradas registradas
            </span>
          </div>
        )}

        {isFirstLoad && (
          <Skeleton
            count={5}
            marginBottom={0}
            height="70px"
            backgroundColor={"#F3EEF5"}
            darkModeBackgroundColor={"#101012"}
            shineColor="#C5C1C7"
            darkModeShineColor="#1e1e1e"
            borderRadius={"16px"}
          />
        )}

        <ul className="w-full h-full flex flex-col gap-2">
          {entries.map((entry) => (
            <RecentEntriesList key={entry.id} entry={entry} />
          ))}
        </ul>
      </div>
    </div>
  );
}
