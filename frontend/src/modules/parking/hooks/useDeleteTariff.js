import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteTariffService } from "../services/deleteTariffService";
import { getModalTrigger } from "../../../utils/getModalTrigger";

export function useDeleteTariff(tariff) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  async function handleDelete(e, openInnerModal, onClose) {
    setLoading(true);

    const triggerButton = getModalTrigger(e);

    try {
      const response = await deleteTariffService(tariff.id);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["tariffs"] });
        await queryClient.invalidateQueries({
          queryKey: ["availableVehicleTypes"],
        });
        onClose();
      } else {
        setError(response.error);
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError(
        "No se pudo eliminar la tarifa, intentalo nuevamente mas tarde.",
      );
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleDelete, loading, error };
}
