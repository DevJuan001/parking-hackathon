import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllFloorsService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.floors}/`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener los pisos");
  }

  return await response.json();
}

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

export async function updateFloorService(floor_id, changes) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.floors}/update/${floor_id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar editar el piso");
  }

  return await response.json();
}
