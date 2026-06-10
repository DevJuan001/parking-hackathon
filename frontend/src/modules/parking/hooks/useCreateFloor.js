import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { createFloorService } from "../services/createFloorService";

export function useCreateFloor() {
  const [floorData, setFloorData] = useState({ floor_number: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { validate } = useFormValidation();

  function handleChange(e) {
    setFloorData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    const triggerButton = getModalTrigger(e);

    const isValid = validate(floorData);

    if (!isValid) {
      openInnerModal("error", triggerButton);
      return;
    }

    setLoading(true);

    try {
      const response = await createFloorService(floorData);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["floors"] });
        openInnerModal("success", triggerButton);
      } else {
        setError("No se pudo crear el piso, intentalo nuevamente mas tarde.");
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError("No se pudo crear el piso, intentalo nuevamente mas tarde.");
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }

    setLoading(false);
  }

  return { handleSubmit, handleChange, floorData, loading, error };
}
