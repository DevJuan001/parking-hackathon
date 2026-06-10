import { useQuery } from "@tanstack/react-query";
import { getAllEntriesService } from "../services/getAllEntriesService";

export function useEntries() {
  const query = useQuery({
    queryKey: ["entries"],
    queryFn: getAllEntriesService,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  const entries = query.data?.data ?? [];

  return {
    entries,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
