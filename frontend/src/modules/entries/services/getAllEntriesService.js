import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllEntriesService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.entries}/`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener los ingresos");
  }

  return await response.json();
}
