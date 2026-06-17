import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { getCurrentUserService } from "../../../globals/services/getCurrentUserService";
import { completeOnBoardingService } from "../service/completeOnBoardingService";

const SECTION_FIELDS = {
  userInfo: ["name", "first_surname"],
  parkingName: ["parking_name"],
  parkingLocation: ["parking_address", "parking_deparment"],
};

export function useCompleteOnBoarding() {
  const [form, setForm] = useState({
    name: "",
    first_surname: "",
    second_surname: "",
    parking_name: "",
    parking_address: "",
    parking_deparment: "",
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

  function validateSection(sectionName) {
    const fields = SECTION_FIELDS[sectionName] ?? [];
    const sectionData = fields.reduce((acc, key) => {
      acc[key] = form[key];
      return acc;
    }, {});
    return validate(sectionData);
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
  }

  return {
    form,
    loading,
    error,
    fieldError,
    handleChange,
    handleSubmit,
    validateSection,
  };
}
