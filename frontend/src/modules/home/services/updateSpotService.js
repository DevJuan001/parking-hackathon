import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function updateSpotService(spot_id, changes) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.spots}/update/${spot_id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    return { error: json.detail || "Error en la petición", data: null };
  }

  return { error: null, data: json };
}
