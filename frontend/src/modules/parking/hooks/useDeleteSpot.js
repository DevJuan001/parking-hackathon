import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteSpotService } from "../services/deleteSpotService";
import { getModalTrigger } from "../../../utils/getModalTrigger";

export function useDeleteSpot(spot) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  async function handleDelete(e, openInnerModal, onClose) {
    setLoading(true);

    const triggerButton = getModalTrigger(e);

    try {
      const response = await deleteSpotService(spot.spot_id);
      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["parkingSpots"] });
        onClose();
      } else {
        setError(response.error);
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError(
        "No se pudo eliminar la plaza, intentalo nuevamente mas tarde..",
      );
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleDelete, loading, error };
}
