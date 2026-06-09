import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllSpotsService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.parking}/spots`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener las plazas");
  }

  return await response.json();
}