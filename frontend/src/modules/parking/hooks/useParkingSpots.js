import { useQuery } from "@tanstack/react-query";
import { getAllSpotsService } from "../services/getAllSpotsService";
import { useState } from "react";

export function useParkingSpots() {
  const [filters, setFilters] = useState({
    floor_id: 1,
    spot_status: "",
  });

  const query = useQuery({
    queryKey: ["parkingSpots", filters],
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
    filters,
    setFilters,
  };
}
