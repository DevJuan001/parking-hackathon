import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { createTariffService } from "../services/createTariffService";

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
      return;
    }

    setLoading(true);

    try {
      const response = await createTariffService(tariffData);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["tariffs"] });
        openInnerModal("success", triggerButton);
      } else {
        setError(
          "No se pudo crear la tarifa, intentalo nuevamente mas tarde.",
        );
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError("No se pudo crear la tarifa, intentalo nuevamente mas tarde.");
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleSubmit, handleChange, tariffData, loading, error };
}
