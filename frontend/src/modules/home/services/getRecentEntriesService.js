import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getRecentEntriesService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.entries}/recent-entries`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener las entradas recientes");
  }

  return await response.json();
}
