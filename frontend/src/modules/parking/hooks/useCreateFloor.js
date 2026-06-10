import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { createFloorService } from "../services/floorsService";

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
      const payload = { floor_number: Number(floorData.floor_number) };
      const response = await createFloorService(payload);
      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["floors"] });
        openInnerModal("success", triggerButton);
      } else {
        openInnerModal("error", triggerButton);
      }
    } catch (error) {
      openInnerModal("error", triggerButton);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { handleSubmit, handleChange, floorData, loading, error };
}
