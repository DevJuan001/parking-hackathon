import { apiRoutes } from "../../../config/apiRoutes";

export async function loginService(form) {
  const response = await fetch(`${apiRoutes.apiUrl}${apiRoutes.auth}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    throw new Error("Credenciales Invalidas");
  }

  const json = await response.json();

  if (!response.ok) {
    return { error: json.detail || "Error en la petición", data: null };
  }

  return json;
}
