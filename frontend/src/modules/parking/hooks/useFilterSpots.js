export function useFilterSpots(filters, setFilters) {
  function handleChange(e) {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return { handleChange };
}
