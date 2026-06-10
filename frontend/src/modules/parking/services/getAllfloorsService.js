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

