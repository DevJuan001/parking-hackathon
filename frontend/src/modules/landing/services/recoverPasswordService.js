import { apiRoutes } from "../../../config/apiRoutes";

export async function recoverPasswordService(email) {
  const response = await fetch(
    `${apiRoutes.apiUrl}${apiRoutes.auth}/recover-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    return { error: json.detail || "Error en la petición", data: null };
  }

  return json;
}
