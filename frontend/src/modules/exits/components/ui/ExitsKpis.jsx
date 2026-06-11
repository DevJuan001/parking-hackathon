import Skeleton from "../../../../globals/components/ui/Skeleton";
import { useExitsStats } from "../../hooks/useExitsStats";
import ExitsKpi from "./ExitsKpi";

export default function ExitsKpis() {
  const { stats, loading } = useExitsStats();

  return (
    <section>
      {loading ? (
        <div className="flex items-center gap-4">
          <Skeleton
            count={4}
            width="460px"
            height={"92px"}
            borderRadius={"20px"}
            backgroundColor={"#F3EEF5"}
            darkModeBackgroundColor={"#101012"}
            shineColor="#C5C1C7"
            darkModeShineColor="#1e1e1e"
          />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <ExitsKpi
            title={"Ganancia de hoy"}
            value={`$${stats.today_revenue}`}
          />
          <ExitsKpi title={"Salidas de hoy"} value={stats.today_exits} />
          <ExitsKpi
            title={"Salidas de este mes"}
            value={stats.this_month_exits}
          />
          <ExitsKpi title={"Salidas Totales"} value={stats.total_exits} />
        </div>
      )}
    </section>
  );
}
