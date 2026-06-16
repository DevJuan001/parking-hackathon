import Icon from "../../../../globals/components/ui/Icon";
import Skeleton from "../../../../globals/components/ui/Skeleton";
import { useExitsStats } from "../../../exits/hooks/useExitsStats";
import {
  ResponsiveContainer,
  PieChart,
  Legend,
  Pie,
  Tooltip,
  Cell,
} from "recharts";

export default function RevenueChart() {
  const { stats, loading } = useExitsStats();
  const hasRevenues = stats.some((stat) => stat.value > 0);
  const noRevenues = !hasRevenues && !loading;
  const isFirstLoad = loading;

  return (
    <div className="h-full w-full">
      {noRevenues && (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-4 text-[#75777E]
          dark:text-[#7E8088]"
        >
          <Icon name={"border_clear"} size={90} />

          <span className="text-xl font-semibold">
            Aún no hay ganancias registradas
          </span>
        </div>
      )}

      {isFirstLoad && (
        <Skeleton
          width="100%"
          height={"100%"}
          backgroundColor={"#F3EEF5"}
          darkModeBackgroundColor={"#101012"}
          shineColor="#C5C1C7"
          darkModeShineColor="#1e1e1e"
          borderRadius={"16px"}
        />
      )}

      {hasRevenues && (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart width="100%" height="100%">
            <Tooltip />

            <Pie
              data={stats}
              dataKey="value"
              nameKey="name"
              cy="85%"
              startAngle={180}
              endAngle={0}
              cornerRadius="10%"
              paddingAngle={1}
              innerRadius="100"
              outerRadius="150"
            >
              {stats.map((item, index) => (
                <Cell key={index} fill={item.color} stroke={item.color} />
              ))}
            </Pie>

            <Legend layout="vertical" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
