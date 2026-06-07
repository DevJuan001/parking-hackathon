import { useQuery } from "@tanstack/react-query";
import { getCurrentUserService } from "../services/getCurrentUserService";

export function useCurrentUser() {
  const currentUser = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserService,
    staleTime: 1000 * 60 * 60,
  });

  const userData = currentUser.data?.data?.[0] || null;

  function hasRole(roles) {
    if (!userData?.role) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(userData.role);
  }

  return {
    user: userData,
    hasRole,
    loading: currentUser.isLoading,
    error: currentUser.error,
  };
}
