import { useQuery } from "@tanstack/react-query";
import { getEntriesStatsService } from "../services/getEntriesStatsService";

export function useEntriesStats() {
  const query = useQuery({
    queryKey: ["entriesStats"],
    queryFn: getEntriesStatsService,
    refetchInterval: 20_000,
    staleTime: 60_000,
  });

  const stats = query.data?.data ?? {
    total: 0,
    today: 0,
    this_week: 0,
    this_month: 0,
  };

  return {
    stats,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
