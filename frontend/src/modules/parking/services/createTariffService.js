import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function createTariffService(tariff_data) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.tariffs}/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tariff_data),
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar registrar la tarifa");
  }

  return await response.json();
}
