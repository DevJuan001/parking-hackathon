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
  const { stats } = useExitsStats();

  const data = [
    { name: "Hoy", value: stats.today_revenue, color: "#a5acfa" },
    { name: "Esta semana", value: stats.this_week_revenue, color: "#5769ff" },
    { name: "Este mes", value: stats.this_month_revenue, color: "#4f5ff1" },
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart width="100%" height="100%">
        <Tooltip />
        <Pie
          data={data}
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
          {data.map((item, index) => (
            <Cell key={index} fill={item.color} stroke={item.color} />
          ))}
        </Pie>
        <Legend layout="vertical" />
      </PieChart>
    </ResponsiveContainer>
  );
}
