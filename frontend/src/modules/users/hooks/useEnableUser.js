import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { enableUserService } from "../services/enableUserService";
import { getModalTrigger } from "../../../utils/getModalTrigger";

export function useEnableUser(user) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  async function handleEnable(e, openInnerModal, onDeleted) {
    setLoading(true);

    const triggerButton = getModalTrigger(e);

    try {
      const response = await enableUserService(user.id);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["users"] });
        onDeleted();
      } else {
        setError(response.error);
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError(
        "No se pudo habilitar el usuario, intentalo nuevamente mas tarde.",
      );
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleEnable, loading, error };
}
