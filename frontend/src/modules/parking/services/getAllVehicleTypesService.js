import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllVehicleTypesService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.parking}/vehicle-types`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener los tipos de vehiculo");
  }

  return await response.json();
}
