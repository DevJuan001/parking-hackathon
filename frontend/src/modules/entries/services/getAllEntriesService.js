import { apiRoutes } from "../../../config/apiRoutes";
import { buildQueryParams } from "../../../utils/buildQueryParams";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllEntriesService(filters) {
  const params = buildQueryParams(filters);

  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.entries}/?${params}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener los ingresos");
  }

  return await response.json();
}
