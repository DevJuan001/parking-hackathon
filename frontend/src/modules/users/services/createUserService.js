import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function createUserService(user_data) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.users}/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user_data),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    return { error: json.detail || "Error en la petición", data: null };
  }

  return json;
}
