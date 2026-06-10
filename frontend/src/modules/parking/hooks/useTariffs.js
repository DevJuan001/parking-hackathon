import { useQuery } from "@tanstack/react-query";
import { getAllTariffsService } from "../services/getAlltariffsService";

export function useTariffs() {
  const query = useQuery({
    queryKey: ["tariffs"],
    queryFn: getAllTariffsService,
    refetchInterval: 25_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });

  const tariffs = query.data?.data ?? [];

  return {
    tariffs,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
