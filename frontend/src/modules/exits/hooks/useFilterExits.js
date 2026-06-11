export function useFilterExits(setFilters) {
  function handleChange(e) {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return {
    handleChange,
  };
}
