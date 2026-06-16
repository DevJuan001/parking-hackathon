import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { getCurrentUserService } from "../../../globals/services/getCurrentUserService";
import { completeOnBoardingService } from "../service/completeOnBoardingService";

export function useCompleteOnBoarding() {
  const [form, setForm] = useState({
    name: "",
    first_surname: "",
    second_surname: "",
    parking_name: "",
    parking_address: "",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { validate, fieldError, clearError } = useFormValidation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  }

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    const triggerButton = getModalTrigger(e);

    const isValid = validate(form);

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await completeOnBoardingService(form);

      if (response.success === true) {
        await queryClient.fetchQuery({
          queryKey: ["currentUser"],
          queryFn: getCurrentUserService,
        });

        navigate("/home");
      } else {
        setError(
          "No se pudo completar el on-boarding, intentalo nuevamente mas tarde.",
        );
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError(
        "No se pudo completar el on-boarding, intentalo nuevamente mas tarde.",
      );
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }

    setLoading(false);
  }

  return {
    form,
    loading,
    error,
    fieldError,
    handleChange,
    handleSubmit,
    validate,
  };
}
