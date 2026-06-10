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

  if (!response.ok) {
    throw new Error("Error al intentar editar la plaza");
  }

  return await response.json();
}
