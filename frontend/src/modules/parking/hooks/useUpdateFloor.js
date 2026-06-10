import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { updateFloorService } from "../services/updateFloorService";

export function useUpdateFloor(floor) {
  const [floorData, setFloorData] = useState({
    floor_number: floor?.floor_number?.toString() ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { validate, getChanges } = useFormValidation();

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

    const updated = { floor_number: Number(floorData.floor_number) };
    const changes = getChanges({ floor_number: floor.floor_number }, updated);

    if (Object.keys(changes).length === 0) {
      openInnerModal("error", triggerButton);
      return;
    }

    setLoading(true);

    try {
      const response = await updateFloorService(floor.id, changes);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["floors"] });
        openInnerModal("success", triggerButton);
      } else {
        setError("No se pudo editar el piso, intentalo nuevamente mas tarde.");
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError("No se pudo editar el piso, intentalo nuevamente mas tarde.");
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleSubmit, handleChange, floorData, loading, error };
}
