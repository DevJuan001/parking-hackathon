import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFormValidation } from "./useFormValidation";
import { getModalTrigger } from "../../utils/getModalTrigger";
import { updateCurrentUserInfoService } from "../services/updateCurrentUserInfoService";

export function useUpdateCurrentUserInfo(user) {
  const [userData, setUserData] = useState({
    name: user.name || "",
    first_surname: user.first_surname || "",
    second_surname: user.second_surname || "",
    email: user.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { validate, getChanges } = useFormValidation();

  function handleChange(e) {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e, openInnerModal, onClose) {
    e.preventDefault();

    const triggerButton = getModalTrigger(e);

    const isValid = validate(userData);

    if (!isValid) {
      openInnerModal("error", triggerButton);
      return;
    }

    const changes = getChanges(user, userData);

    if (Object.keys(changes).length === 0) {
      openInnerModal("error", triggerButton);
      return;
    }

    setLoading(true);

    try {
      const response = await updateCurrentUserInfoService(changes);
      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        onClose();
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

  return { handleSubmit, handleChange, userData, loading, error };
}
