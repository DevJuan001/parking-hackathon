import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { createSpotService } from "../services/createSpotService";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";

export function useCreateSpot(floor) {
  const [spotData, setSpotData] = useState({
    floor_id: floor,
    spot: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { validate } = useFormValidation();

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

    setLoading(true);

    try {
      const response = await createSpotService(spotData);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["spots"] });
        onClose();
      } else {
        setError("No se pudo crear la plaza, intentalo nuevamente mas tarde.");
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError("No se pudo crear la plaza, intentalo nuevamente mas tarde.");
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleSubmit, handleChange, spotData, loading, error };
}
