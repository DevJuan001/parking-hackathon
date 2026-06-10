import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function deleteSpotService(spot_id) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.spots}/delete/${spot_id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar eliminar la plaza");
  }

  return await response.json();
}
