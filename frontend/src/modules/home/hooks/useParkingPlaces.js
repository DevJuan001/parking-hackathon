import { useQuery } from "@tanstack/react-query";
import { getAllSpotsService } from "../services/parkingService";

export function useParkingPlaces() {
  const query = useQuery({
    queryKey: ["parkingSpots"],
    queryFn: getAllSpotsService,
    refetchInterval: 25_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });

  const spots = query.data?.data ?? [];

  return {
    spots,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
