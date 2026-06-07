import { useCurrentUser } from "../globals/hooks/useCurrentUser";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes({ roles }) {
  const { hasRole, loading, error } = useCurrentUser();

  if (loading) return null;

  if (error || !hasRole(roles)) return <Navigate to={"/login"} replace />;

  return <Outlet />;
}
