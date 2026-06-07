import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../services/loginService";
import { useLogout } from "../../../globals/hooks/useLogout";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";

export function useLogin(openModal) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { logout } = useLogout();
  const { validate, fieldError, clearError } = useFormValidation();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const currentTarget = e.currentTarget;

    const isValid = validate(form);

    if (!isValid) return;

    setLoading(true);

    try {
      await logout();

      const response = await loginService(form);

      if (response.success === true) {
        navigate("/home");
      } else {
        openModal(null, "error", null, currentTarget);
      }
    } catch (error) {
      setError(error);
      openModal(null, "error", null, currentTarget);
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
