import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getAllCountriesService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.countries}/`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener los paises");
  }

  return await response.json();
}
