import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function completeOnBoardingService(on_boarding_data) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.auth}/complete-on-boarding`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(on_boarding_data),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    return { error: json.detail || "Error en la petición", data: null };
  }

  return json;
}
