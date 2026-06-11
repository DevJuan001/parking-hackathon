import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getExitsStatsService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.exits}/stats`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener las estadisticas de salidas");
  }

  return await response.json();
}
