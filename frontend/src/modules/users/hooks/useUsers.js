import { useQuery } from "@tanstack/react-query";
import { getAllUsersService } from "../services/getAllUsersService";

export function useUsers() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersService,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  const users = query.data?.data ?? [];

  return {
    users,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
