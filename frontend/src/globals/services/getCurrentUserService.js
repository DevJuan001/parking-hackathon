import { apiRoutes } from "../../config/apiRoutes";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

export async function getCurrentUserService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.users}/me`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener tu información");
  }

  const data = await response.json();

  return data;
}
