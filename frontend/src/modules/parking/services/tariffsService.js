import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllTariffsService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.tariffs}/`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener las tarifas");
  }

  return await response.json();
}

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

export async function updateTariffService(tariff_id, changes) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.tariffs}/update/${tariff_id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar editar la tarifa");
  }

  return await response.json();
}
