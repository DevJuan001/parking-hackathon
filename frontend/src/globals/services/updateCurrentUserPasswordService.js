import { apiRoutes } from "../../config/apiRoutes";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

export async function updateCurrentUserPasswordService(password_data) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.users}/update-password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(password_data),
    },
  );

  if (!response.ok) {
    throw new Error("Error al intentar obtener tu información");
  }

  return await response.json();
}
