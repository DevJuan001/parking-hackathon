import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { loginService } from "../services/loginService";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { getCurrentUserService } from "../../../globals/services/getCurrentUserService";

export function useLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const { validate, fieldError, clearError } = useFormValidation();

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
      const response = await loginService(form);

      if (response.success === true) {
        const freshData = await queryClient.fetchQuery({
          queryKey: ["currentUser"],
          queryFn: getCurrentUserService,
        });
        const userRole = freshData?.data?.[0]?.role;
        userRole === "Cliente" ? navigate("/check-in") : navigate("/home");
      } else {
        openInnerModal("error", e);
      }
    } catch (error) {
      setError(error);
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
    handleChange,
    handleSubmit,
    showPassword,
    setShowPassword,
  };
}
