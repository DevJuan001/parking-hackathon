import { useParkingSpots } from "./useParkingSpots";

export function useFilterSpots() {
  const { filters, setFilters } = useParkingSpots();

  function handleChange(e) {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return { filters, handleChange };
}
