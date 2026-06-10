import { apiRoutes } from "../../../config/apiRoutes";
import { buildQueryParams } from "../../../utils/buildQueryParams";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllSpotsService(filters) {
  const params = buildQueryParams(filters);

  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.spots}/?${params}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener las plazas");
  }

  return await response.json();
}
