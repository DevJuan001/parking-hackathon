import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { updateTariffService } from "../services/updateTariffService";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";

export function useUpdateTariff(tariff) {
  const [tariffData, setTariffData] = useState({
    vehicle_type: tariff?.vehicle_type?.toString() ?? "",
    value: tariff?.value?.toString() ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { validate, getChanges } = useFormValidation();

  function handleChange(e) {
    setTariffData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    const triggerButton = getModalTrigger(e);

    const isValid = validate(tariffData);

    if (!isValid) {
      openInnerModal("error", triggerButton);
      return;
    }

    const updated = {
      vehicle_type: Number(tariffData.vehicle_type),
      value: Number(tariffData.value),
    };
    const changes = getChanges(
      { vehicle_type: tariff.vehicle_type, value: tariff.value },
      updated,
    );

    if (Object.keys(changes).length === 0) {
      openInnerModal("error", triggerButton);
      return;
    }

    setLoading(true);

    try {
      const response = await updateTariffService(tariff.id, changes);
      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["tariffs"] });
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

  return { handleSubmit, handleChange, tariffData, loading, error };
}
