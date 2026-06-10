import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function updateUserService(user_id, changes) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.users}/update/${user_id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    return { error: json.detail || "Error en la petición", data: null };
  }

  return json;
}
