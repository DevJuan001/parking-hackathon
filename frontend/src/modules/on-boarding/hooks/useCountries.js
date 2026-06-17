import { useQuery } from "@tanstack/react-query";
import { getAllCountriesService } from "../service/getAllCountriesService";

export function useCountries() {
  const query = useQuery({
    queryKey: ["countries"],
    queryFn: getAllCountriesService,
    staleTime: 1000 * 60 * 60,
  });

  const countries = query.data?.data ?? [];

  return {
    countries,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
