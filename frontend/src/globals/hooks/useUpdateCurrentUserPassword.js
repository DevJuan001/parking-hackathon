import { useState } from "react";
import { updateCurrentUserPasswordService } from "../services/updateCurrentUserPasswordService";
import { useFormValidation } from "./useFormValidation";
import { getModalTrigger } from "../../utils/getModalTrigger";

export function useUpdateCurrentUserPassword() {
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    repeat_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    repeat: false,
  });
  const { validate, clearError, fieldError } = useFormValidation();

  function togglePassword(field) {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  const passwordsMatch =
    passwordData.new_password === passwordData.repeat_password;

  function handleChange(e) {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  }

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    if (!passwordsMatch) return;

    const triggerButton = getModalTrigger(e);

    const isValid = validate(passwordData);

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await updateCurrentUserPasswordService(passwordData);
      if (response.success === true) {
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

  return {
    handleSubmit,
    handleChange,
    passwordData,
    loading,
    error,
    passwordsMatch,
    showPasswords,
    togglePassword,
    fieldError,
  };
}
