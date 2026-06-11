import { apiRoutes } from "../../../config/apiRoutes";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";

export async function getPaymentMethodsService() {
  const response = await fetchWithAuth(
    `${apiRoutes.apiUrl}${apiRoutes.payments}/payment-methods`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error("No se pudieron obtener los métodos de pago");
  }

  return await response.json();
}
