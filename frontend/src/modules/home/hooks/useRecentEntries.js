import { useQuery } from "@tanstack/react-query";
import { getRecentEntriesService } from "../services/getRecentEntriesService";

export function useRecentEntries() {
  const query = useQuery({
    queryKey: ["recentEntries"],
    queryFn: getRecentEntriesService,
    refetchInterval: 25_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });

  const entries = query.data?.data ?? [];

  return {
    entries,
    loading: query.isLoading,
    error: query.error,
  };
}
