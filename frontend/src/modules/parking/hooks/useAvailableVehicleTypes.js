import { useQuery } from "@tanstack/react-query";
import { getAvailableVehicleTypesService } from "../services/getAvailableVehicleTypesService";

export function useAvailableVehicleTypes() {
  const query = useQuery({
    queryKey: ["availableVehicleTypes"],
    queryFn: getAvailableVehicleTypesService,
    staleTime: 60_000,
  });

  const availableVehicleTypes = query.data?.data ?? [];

  return {
    availableVehicleTypes,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
