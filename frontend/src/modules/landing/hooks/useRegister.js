import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { registerService } from "../services/registerService";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { useNavigate } from "react-router-dom";
import { getCurrentUserService } from "../../../globals/services/getCurrentUserService";

export function useRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    repeat_password: "",
  });
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { fieldError, clearError, validate } = useFormValidation();

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
        await queryClient.fetchQuery({
          queryKey: ["currentUser"],
          queryFn: getCurrentUserService,
        });

        navigate("/home");
      } else {
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
