import { apiRoutes } from "../../../config/apiRoutes";
import { buildQueryParams } from "../../../utils/buildQueryParams";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllUsersService(filters = {}) {
  const params = buildQueryParams(filters);

  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.users}/?${params}`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener los usuarios");
  }

  return await response.json();
}
