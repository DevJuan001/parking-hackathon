import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { createExitService } from "../services/createExitService";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";

export function useCreateExit() {
  const [form, setForm] = useState({ plate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { validate } = useFormValidation();

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    const triggerButton = getModalTrigger(e);

    const isValid = validate(form);

    if (!isValid) {
      openInnerModal("error", triggerButton);
      return;
    }

    setLoading(true);

    try {
      const response = await createExitService(form);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["exits"] });
        await queryClient.invalidateQueries({ queryKey: ["exitsStats"] });
        openInnerModal("success", triggerButton);
      } else {
        setError("No se pudo registrar la salida, intentalo nuevamente mas tarde.");
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError("No se pudo registrar la salida, intentalo nuevamente mas tarde.");
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleSubmit, handleChange, form, loading, error };
}
