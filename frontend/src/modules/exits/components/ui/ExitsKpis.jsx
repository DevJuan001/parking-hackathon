import { useExitsStats } from "../../hooks/useExitsStats";
import ExitsKpi from "./ExitsKpi";

export default function ExitsKpis() {
  const { stats } = useExitsStats();

  return (
    <section className="w-full flex items-center gap-4">
      <ExitsKpi title={"Hoy"} value={stats.today_exits} />
      <ExitsKpi title={"Esta semana"} value={stats.this_week_exits} />
      <ExitsKpi title={"Este mes"} value={stats.this_month_exits} />
      <ExitsKpi title={"Total"} value={stats.total_exits} />
    </section>
  );
}
