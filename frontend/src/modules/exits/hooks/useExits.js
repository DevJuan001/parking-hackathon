import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllExitsService } from "../services/getAllExitsService";

export function useExits() {
  const [filters, setFilters] = useState({
    plate_id: "",
    start_date: "",
    end_date: "",
  });

  const query = useQuery({
    queryKey: ["exits", filters],
    queryFn: () => getAllExitsService(filters),
    refetchInterval: 25_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  const exits = query.data?.data ?? [];

  return {
    exits,
    loading: query.isLoading,
    error: query.error,
    filters,
    setFilters,
  };
}
