import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function createSpotService(spot_data) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.spots}/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spot_data),
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar registrar la plaza");
  }

  return await response.json();
}
