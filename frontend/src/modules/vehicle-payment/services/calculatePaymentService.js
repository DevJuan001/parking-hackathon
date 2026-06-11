import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function calculatePaymentService(payment_data) {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.payments}/calculate/?plate=${payment_data.plate}`,
    {
      method: "GET",
    },
  );

  const json = await response.json();

  if (!response.ok) {
    return { error: json.detail || "Error en la petición", data: null };
  }

  return json;
}
