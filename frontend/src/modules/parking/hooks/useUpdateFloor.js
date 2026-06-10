import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { updateFloorService } from "../services/updateFloorService";

export function useUpdateFloor(floor) {
  const [floorData, setFloorData] = useState({
    name: floor.name || "",
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

    const changes = getChanges(floor, floorData);

    if (Object.keys(changes).length === 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await updateFloorService(floor.id, changes);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["floors"] });
        await queryClient.invalidateQueries({ queryKey: ["spots"] });
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
