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

  const json = await response.json();

  if (!response.ok) {
    return { error: json.detail || "Error en la petición", data: null };
  }

  return { error: null, data: json };
}
