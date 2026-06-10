import { useUserStats } from "../../hooks/useUserStats";
import UsersKpi from "./UsersKpi";

export default function UsersKpis() {
  const { stats } = useUserStats();

  return (
    <section className="w-full flex items-center gap-4">
      <UsersKpi title={"Recientes"} value={stats.created_this_week} />
      <UsersKpi title={"Activos"} value={stats.active} />
      <UsersKpi title={"Deshabilitados"} value={stats.disabled} />
      <UsersKpi title={"Total"} value={stats.total} />
    </section>
  );
}
