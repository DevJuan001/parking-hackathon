import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { createTariffService } from "../services/createTariffService";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";

export function useCreateTariff() {
  const [tariffData, setTariffData] = useState({
    vehicle_type: "",
    value: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { validate } = useFormValidation();

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

    setLoading(true);

    try {
      const payload = {
        vehicle_type: Number(tariffData.vehicle_type),
        value: Number(tariffData.value),
      };
      const response = await createTariffService(payload);
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
