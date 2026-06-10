import EntriesKpi from "./EntriesKpi";

export default function EntriesKpis() {
  return (
    <section className="w-full flex items-center gap-4">
      <EntriesKpi title={"Hoy"} value={"50"} />
      <EntriesKpi title={"Esta semana"} value={"50"} />
      <EntriesKpi title={"Este mes"} value={"50"} />
      <EntriesKpi title={"Total"} value={"50"} />
    </section>
  );
}
