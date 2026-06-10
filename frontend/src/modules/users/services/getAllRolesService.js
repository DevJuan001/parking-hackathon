import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllRolesService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.users}/roles`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener los roles");
  }

  return await response.json();
}
