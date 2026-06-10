import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function enableUserService(user_id) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.users}/enable/${user_id}`,
    {
      method: "PUT",
    },
  );

  const json = await response.json();

  if (!response.ok) {
    return { error: json.detail || "Error en la petición", data: null };
  }

  return json;
}
