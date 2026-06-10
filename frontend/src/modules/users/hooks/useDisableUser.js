import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { disableUserService } from "../services/disableUserService";
import { getModalTrigger } from "../../../utils/getModalTrigger";

export function useDisableUser(user) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  async function handleDisable(e, openInnerModal, onDeleted) {
    setLoading(true);

    const triggerButton = getModalTrigger(e);

    try {
      const response = await disableUserService(user.id);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["users"] });
        await queryClient.invalidateQueries({ queryKey: ["userStats"] });
        onDeleted();
      } else {
        setError(response.error);
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError(
        "No se pudo deshabilitar el usuario, intentalo nuevamente mas tarde.",
      );
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleDisable, loading, error };
}
