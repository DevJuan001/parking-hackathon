import { useQuery } from "@tanstack/react-query";
import { getAllVehicleTypesService } from "../services/getAllVehicleTypesService";

export function useVehicleTypes() {
  const query = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: getAllVehicleTypesService,
    staleTime: 60_000,
  });

  const vehicleTypes = query.data?.data ?? [];

  return {
    vehicleTypes,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
