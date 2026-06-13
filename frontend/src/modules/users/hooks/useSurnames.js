import { useQuery } from "@tanstack/react-query";
import { getAllSurnamesService } from "../services/getAllSurnamesService";

export function useSurnames() {
  const query = useQuery({
    queryKey: ["surnames"],
    queryFn: getAllSurnamesService,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  const surnames = query.data?.data ?? [];

  return {
    surnames,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
