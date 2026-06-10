import { useQuery } from "@tanstack/react-query";
import { getAllRolesService } from "../services/getAllRolesService";

export function useRoles() {
  const query = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRolesService,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  const roles = query.data?.data ?? [];

  return {
    roles,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
