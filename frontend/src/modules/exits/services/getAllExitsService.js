import { apiRoutes } from "../../../config/apiRoutes";
import { buildQueryParams } from "../../../utils/buildQueryParams";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllExitsService(filters) {
  const params = buildQueryParams(filters);

  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.exits}/?${params}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener las salidas");
  }

  return await response.json();
}
