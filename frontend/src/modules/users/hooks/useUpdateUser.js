import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { updateUserService } from "../services/updateUserService";

export function useUpdateUser(user) {
  const [form, setForm] = useState({
    role_id: user?.role_id?.toString() ?? "",
    name: user?.name ?? "",
    first_surname: user?.first_surname ?? "",
    second_surname: user?.second_surname ?? "",
    email: user?.email ?? "",
    status: user?.status?.toString() ?? "2",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { validate, getChanges } = useFormValidation();

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    const triggerButton = getModalTrigger(e);

    const isValid = validate(form);

    if (!isValid) {
      openInnerModal("error", triggerButton);
      return;
    }

    const changes = getChanges(user, form);

    if (Object.keys(changes).length === 0) {
      openInnerModal("error", triggerButton);
      return;
    }

    setLoading(true);

    try {
      const response = await updateUserService(user.id, changes);

      if (response.success === true) {
        await queryClient.invalidateQueries({ queryKey: ["userStats"] });
        await queryClient.invalidateQueries({ queryKey: ["users"] });
        openInnerModal("success", triggerButton);
      } else {
        setError(
          "No se pudo editar el usuario, intentalo nuevamente mas tarde.",
        );
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError("No se pudo editar el usuario, intentalo nuevamente mas tarde.");
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return { handleSubmit, handleChange, form, loading, error };
}
