import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteSpotService } from "../services/deleteSpotService";

export function useDeleteSpot(spot) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  async function handleDelete(onDeleted, onError) {
    setLoading(true);

    try {
      const response = await deleteSpotService(spot.spot_id);
      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["parkingSpots"] });
        onDeleted();
      } else {
        onError();
      }
    } catch (error) {
      onError();
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { handleDelete, loading, error };
}
