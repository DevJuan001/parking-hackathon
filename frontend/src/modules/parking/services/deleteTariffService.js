import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function deleteTariffService(tariff_id) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.tariffs}/delete/${tariff_id}`,
    {
      method: "DELETE",
    },
  );

  const json = await response.json();

  if (!response.ok) {
    return { error: json.detail || "Error en la petición", data: null };
  }

  return json;
}
