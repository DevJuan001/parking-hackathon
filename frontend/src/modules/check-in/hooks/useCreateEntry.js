import { useState } from "react";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { createEntryService } from "../services/createEntryService";

export function useCreateEntry(setActiveSection) {
  const [entryData, setEntryData] = useState({ plate: "" });
  const { validate } = useFormValidation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setEntryData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    const triggerButton = getModalTrigger(e);

    const isValid = validate(entryData);

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await createEntryService(entryData);

      if (response.success === true) {
        setActiveSection("successEntry");
        setMessage(response.message);
      } else {
        setError(response.error);
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError(
        "No se pudo permitir el ingreso, intentalo nuevamente mas tarde.",
      );
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }

    setLoading(false);
  }

  return {
    entryData,
    setEntryData,
    message,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
}
