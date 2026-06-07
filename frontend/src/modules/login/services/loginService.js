import { apiRoutes } from "../../../config/apiRoutes";

export async function loginService(form) {
  const res = await fetch(`${apiRoutes.apiUrl}${apiRoutes.auth}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    throw new Error("Credenciales Invalidas");
  }

  return await res.json();
}
