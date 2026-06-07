import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../modules/login/LoginPage";
import ProtectedRoutes from "./ProtectedRoutes";
import { routesConfig } from "./constants/routesConfig";

export default function AppRouter() {
  return (
    <Routes>
      {/* Ruta no existente lo que hace es enviarlo al login */}
      <Route path="*" element={<Navigate to="/login" />} />

      {/* Página Login o de Inicio de Sesión */}
      <Route path="/login" element={<LoginPage />} />

      {routesConfig.map(({ path, component: Component, roles }) => (
        <Route key={path} element={<ProtectedRoutes roles={roles} />}>
          <Route path={path} element={<Component />} />
        </Route>
      ))}
    </Routes>
  );
}
