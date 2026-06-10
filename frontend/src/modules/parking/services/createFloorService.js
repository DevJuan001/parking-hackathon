import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function createFloorService(floor_data) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.floors}/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(floor_data),
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar registrar el piso");
  }

  return await response.json();
}
