import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSpotsService } from "../services/getAllSpotsService";

export function useParkingSpots() {
  const [filters, setFilters] = useState({
    floor_id: "",
    spot_status: "",
  });

  const query = useQuery({
    queryKey: ["spots", filters],
    queryFn: () => getAllSpotsService(filters),
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
