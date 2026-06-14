import ProtectedRoutes from "./ProtectedRoutes";
import { routesConfig } from "./constants/routesConfig";
import LandingPage from "../modules/landing/LandingPage";
import { Routes, Route, Navigate } from "react-router-dom";

export default function AppRouter() {
  return (
    <Routes>
      {/* Ruta no existente lo que hace es enviarlo al login */}
      <Route path="*" element={<Navigate to="/" />} />

      {/* Página Login o de Inicio de Sesión */}
      <Route path="/" element={<LandingPage />} />

      {routesConfig.map(({ path, component: Component, roles }) => (
        <Route key={path} element={<ProtectedRoutes roles={roles} />}>
          <Route path={path} element={<Component />} />
        </Route>
      ))}
    </Routes>
  );
}
