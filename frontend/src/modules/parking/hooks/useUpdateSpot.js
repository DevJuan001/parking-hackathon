import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { updateSpotService } from "../services/updateSpotService";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";

export function useUpdateSpot(spot) {
  const [spotData, setSpotData] = useState({
    spot: spot?.spot || "",
    spot_status: spot?.spot_status ?? 2,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { validate, getChanges } = useFormValidation();

  function handleChange(e) {
    setSpotData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e, openInnerModal, onClose) {
    e.preventDefault();

    const triggerButton = getModalTrigger(e);

    const isValid = validate(spotData);

    if (!isValid) {
      return;
    }

    const changes = getChanges(spot, spotData);

    if (Object.keys(changes).length === 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await updateSpotService(spot.spot_id, changes);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["spots"] });
        onClose();
      } else {
        setError("No se pudo editar la plaza, intentalo nuevamente mas tarde.");
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError("No se pudo editar la plaza, intentalo nuevamente mas tarde.");
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleSubmit, handleChange, spotData, loading, error };
}
