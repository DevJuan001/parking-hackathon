import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllSurnamesService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.users}/surnames`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener los apellidos de los usuarios");
  }

  return await response.json();
}
