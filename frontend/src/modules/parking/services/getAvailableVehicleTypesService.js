import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAvailableVehicleTypesService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.tariffs}/available-vehicle-types`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener los tipos de vehiculo disponibles");
  }

  return await response.json();
}
