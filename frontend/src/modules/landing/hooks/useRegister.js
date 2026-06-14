import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { registerService } from "../services/registerService";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";

export function useRegister() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    repeat_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { fieldError, clearError, validate } = useFormValidation();
  const queryClient = useQueryClient();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  }

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    const isValid = validate(form);

    if (!isValid) return;

    setLoading(true);

    try {
      const response = await registerService(form);
      
      if (response.success === true) {
        console.log("a");
      } else {
        setError(response.error);
        openInnerModal("error", e);
      }
    } catch {
      setError(
        "Lo sentimos por el momento no podemos crear tu cuenta, por favor intentalo nuevamente más tarde",
      );
      openInnerModal("error", e);
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    error,
    fieldError,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
  };
}
