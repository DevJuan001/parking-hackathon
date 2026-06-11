import { useState } from "react";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";
import { calculatePaymentService } from "../services/calculatePaymentService";

export function useCalculatePayment(setActiveSection) {
  const [paymentData, setPaymentData] = useState({ plate: "" });
  const [paymentDetails, setPaymentDetails] = useState([]);
  const { validate } = useFormValidation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setPaymentData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    const triggerButton = getModalTrigger(e);

    const isValid = validate(paymentData);

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await calculatePaymentService(paymentData);

      if (response.error) {
        setError(response.error);
        openInnerModal("error", triggerButton);
      } else {
        setActiveSection("createPayment");
        setPaymentDetails(response.data);
      }
    } catch {
      setError(
        "No se pudo calcular el valor a pagar, intentalo nuevamente mas tarde.",
      );
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }
  }

  return {
    paymentData,
    setPaymentData,
    paymentDetails,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
}
