import { apiRoutes } from "../../config/apiRoutes";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

export async function logoutService() {
  const res = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.auth}/logout`,
    {
      method: "POST",
    },
  );

  if (!res.ok) {
    throw new Error("No se pudo cerrar la sesión");
  }

  return await res.json();
}
