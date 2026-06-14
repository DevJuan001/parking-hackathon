import { useState } from "react";
import { recoverPasswordService } from "../services/recoverPasswordService";

export function useRecoverPassword() {
  const [form, setForm] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    setLoading(true);

    try {
      await recoverPasswordService(form);
      openInnerModal("sentEmail");
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { form, loading, error, handleChange, handleSubmit };
}
