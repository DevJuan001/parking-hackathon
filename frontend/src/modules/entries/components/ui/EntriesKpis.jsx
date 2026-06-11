import { useEntriesStats } from "../../hooks/useEntriesStats";
import EntriesKpi from "./EntriesKpi";

export default function EntriesKpis() {
  const { stats } = useEntriesStats();

  return (
    <section className="w-full flex items-center gap-4">
      <EntriesKpi title={"Hoy"} value={stats.today} />
      <EntriesKpi title={"Esta semana"} value={stats.this_week} />
      <EntriesKpi title={"Este mes"} value={stats.this_month} />
      <EntriesKpi title={"Total"} value={stats.total} />
    </section>
  );
}
