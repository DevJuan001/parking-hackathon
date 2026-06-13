export function formatDateTime(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();

  const month = date.toLocaleDateString("es-AR", {
    month: "long",
  });

  const year = date.getFullYear();

  return `${day} de ${month} del ${year}`;
}

export function formatTimeDate(dateString) {
  const date = new Date(dateString);

  const time = date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return time;
}
