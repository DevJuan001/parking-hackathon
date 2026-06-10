import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { updateSpotService } from "../../home/services/updateSpotService";
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

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    const triggerButton = getModalTrigger(e);

    const isValid = validate(spotData);

    if (!isValid) {
      openInnerModal("error", triggerButton);
      return;
    }

    const changes = getChanges(
      { spot: spot.spot, spot_status: spot.spot_status },
      spotData,
    );

    if (Object.keys(changes).length === 0) {
      openInnerModal("error", triggerButton);
      return;
    }

    setLoading(true);

    try {
      const response = await updateSpotService(spot.spot_id, changes);
      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["parkingSpots"] });
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

  return { handleSubmit, handleChange, spotData, loading, error };
}
