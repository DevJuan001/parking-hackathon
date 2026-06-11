import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllEntriesService } from "../services/getAllEntriesService";

export function useEntries() {
  const [filters, setFilters] = useState({
    plate_id: "",
    start_date: "",
    end_date: "",
  });

  const query = useQuery({
    queryKey: ["entries", filters],
    queryFn: () => getAllEntriesService(filters),
    refetchInterval: 25_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  const entries = query.data?.data ?? [];

  return {
    entries,
    loading: query.isLoading,
    error: query.error,
    filters,
    setFilters,
  };
}
