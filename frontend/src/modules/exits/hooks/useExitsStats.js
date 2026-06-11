import { useQuery } from "@tanstack/react-query";
import { getExitsStatsService } from "../services/getExitsStatsService";

export function useExitsStats() {
  const query = useQuery({
    queryKey: ["exitsStats"],
    queryFn: getExitsStatsService,
    refetchInterval: 20_000,
    staleTime: 60_000,
  });

  const stats = query.data?.data ?? {
    total_exits: 0,
    today_exits: 0,
    this_week_exits: 0,
    this_month_exits: 0,
    total_revenue: 0,
    today_revenue: 0,
    this_week_revenue: 0,
    this_month_revenue: 0,
  };

  return {
    stats,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
