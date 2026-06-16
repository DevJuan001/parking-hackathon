import { useQuery } from "@tanstack/react-query";
import { getExitsStatsService } from "../services/getExitsStatsService";

export function useExitsStats() {
  const query = useQuery({
    queryKey: ["exitsStats"],
    queryFn: getExitsStatsService,
    refetchInterval: 20_000,
    staleTime: 60_000,
  });

  const stats = [
    { name: "Hoy", value: query.data?.data?.today_revenue, color: "#a5acfa" },
    {
      name: "Esta semana",
      value: query.data?.data?.this_week_revenue,
      color: "#5769ff",
    },
    {
      name: "Este mes",
      value: query.data?.data?.this_month_revenue,
      color: "#4f5ff1",
    },
  ];

  return {
    stats,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
