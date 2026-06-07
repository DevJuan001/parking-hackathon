import { apiRoutes } from "../config/apiRoutes";

let isRefreshing = false;
let refreshPromise = null;

export async function fetchWithAuth(url, options = {}) {
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // Si el access_token venció, intenta refrescar
  if (response.status === 401) {
    if (isRefreshing) {
      try {
        await refreshPromise;
      } catch {
        window.location.href = "/login";
        return;
      }
    } else {
      isRefreshing = true;

      refreshPromise = fetch(`${apiRoutes.apiUrl}${apiRoutes.auth}/refresh`, {
        method: "POST",
        credentials: "include",
      })
        .then((res) => {
          isRefreshing = false;
          if (!res.ok) {
            refreshPromise = null;
            window.location.href = "/login";
            throw new Error("Refresh token expirado");
          }
          refreshPromise = null;
          return res;
        })
        .catch((err) => {
          isRefreshing = false;
          refreshPromise = null;
          throw err;
        });

      try {
        await refreshPromise;
      } catch {
        return;
      }
    }

    // Token refrescado exitosamente, reintentamos la request original
    response = await fetch(url, {
      ...options,
      credentials: "include",
    });
  }

  return response;
}
