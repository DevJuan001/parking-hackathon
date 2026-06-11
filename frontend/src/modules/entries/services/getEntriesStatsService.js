import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getEntriesStatsService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.entries}/by-stats`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener las estadisticas de usuarios");
  }

  return await response.json();
}
