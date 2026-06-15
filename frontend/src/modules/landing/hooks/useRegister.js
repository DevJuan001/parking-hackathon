import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { registerService } from "../services/registerService";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { useNavigate } from "react-router-dom";
import { getCurrentUserService } from "../../../globals/services/getCurrentUserService";

export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    email: "",
    password: "",
    repeat_password: "",
  });
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

    const triggerButton = e.currentTarget;

    setLoading(true);

    try {
      const response = await registerService(form);

      if (response.success === true) {
        const freshData = await queryClient.fetchQuery({
          queryKey: ["currentUser"],
          queryFn: getCurrentUserService,
        });
        const user = freshData?.data?.[0];

        if (user?.onboarding_completed === false) {
          navigate("/on-boarding");
        } else {
          navigate("/home");
        }
      } else {
        setError(
          response.error ??
            "No pudimos crear tu cuenta. Verifica los datos e intentalo de nuevo.",
        );
        openInnerModal("error", { currentTarget: triggerButton });
      }
    } catch {
      setError(
        "Lo sentimos por el momento no podemos crear tu cuenta, por favor intentalo nuevamente más tarde",
      );
      openInnerModal("error", { currentTarget: triggerButton });
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
