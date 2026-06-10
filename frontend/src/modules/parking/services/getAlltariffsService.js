import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllTariffsService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.tariffs}/`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener las tarifas");
  }

  return await response.json();
}
