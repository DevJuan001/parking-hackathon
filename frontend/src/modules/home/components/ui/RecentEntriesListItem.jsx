// Utils
import { formatTime } from "../../../../utils/formatTime";
// Components
import Icon from "../../../../globals/components/ui/Icon";

export default function RecentEntriesList({ entry }) {
  return (
    <div
      key={entry.id}
      className="flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-[#efedf0] transition-colors dark:hover:bg-[#ffffff15]"
    >
      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#EAE8EB] dark:bg-[#1e1e20cb]">
        <Icon name="directions_car" size={20} fill />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold truncate">{entry.plate}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
            {entry.spot}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {entry.vehicle_type}
        </span>
      </div>

      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
        {formatTime(entry.created_at)}
      </span>
    </div>
  );
}
