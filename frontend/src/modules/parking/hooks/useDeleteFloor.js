import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteFloorService } from "../services/deleteFloorService";
import { getModalTrigger } from "../../../utils/getModalTrigger";

export function useDeleteFloor(floor) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  async function handleDelete(e, openInnerModal, onDeleted) {
    setLoading(true);

    const triggerButton = getModalTrigger(e);

    try {
      const response = await deleteFloorService(floor.id);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["floors"] });
        await queryClient.invalidateQueries({ queryKey: ["spots"] });
        onDeleted();
      } else {
        setError(response.error);
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError("No se pudo eliminar el piso, intentalo nuevamente mas tarde.");
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleDelete, loading, error };
}
