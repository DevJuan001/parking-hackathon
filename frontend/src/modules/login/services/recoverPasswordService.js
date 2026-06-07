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

  return await response.json();
}
