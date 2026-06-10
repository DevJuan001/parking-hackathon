import { useQuery } from "@tanstack/react-query";
import { getUserStatsService } from "../services/getUserStatsService";

export function useUserStats() {
  const query = useQuery({
    queryKey: ["userStats"],
    queryFn: getUserStatsService,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });

  const stats = query.data?.data ?? {
    total: 0,
    active: 0,
    disabled: 0,
    created_this_week: 0,
  };

  return {
    stats,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
