import { useState } from "react";
import { recoverPasswordService } from "../services/recoverPasswordService";

export default function useRecoverPassword(email) {
  const [form, setForm] = useState(email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e, setInnerModal) {
    e.preventDefault();

    setLoading(true);

    try {
      await recoverPasswordService(form);
      setInnerModal("sentEmail");
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, handleChange, handleSubmit };
}
