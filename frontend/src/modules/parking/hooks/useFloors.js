import { useQuery } from "@tanstack/react-query";
import { getAllFloorsService } from "../services/getAllfloorsService";

export function useFloors() {
  const query = useQuery({
    queryKey: ["floors"],
    queryFn: getAllFloorsService,
    refetchInterval: 25_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });

  const floors = query.data?.data ?? [];

  return {
    floors,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
