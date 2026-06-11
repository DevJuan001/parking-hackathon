import { useState } from "react";
import { getModalTrigger } from "../../../utils/getModalTrigger";
import { createPaymentService } from "../services/createPaymentService";
import { useFormValidation } from "../../../globals/hooks/useFormValidation";

export function useCreatePayment(setActiveSection, paymentDetails) {
  const [activePaymentMethod, setActivePaymentMethod] = useState("");
  const paymentData = {
    plate: paymentDetails.plate,
    exit_time: paymentDetails.exit_time,
    payment_method: activePaymentMethod,
  };
  const { validate } = useFormValidation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e, openInnerModal) {
    e.preventDefault();

    const triggerButton = getModalTrigger(e);

    const isValid = validate(paymentData);

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await createPaymentService(paymentData);

      if (response.success === true) {
        setActiveSection("successPayment");
      } else {
        setError(
          "No se pudo completar el pago, intentalo nuevamente mas tarde.",
        );
        openInnerModal("error", triggerButton);
      }
    } catch {
      setError("No se pudo completar el pago, intentalo nuevamente mas tarde.");
      openInnerModal("error", triggerButton);
    } finally {
      setLoading(false);
    }

    setLoading(false);
  }

  return {
    paymentData,
    loading,
    error,
    activePaymentMethod,
    setActivePaymentMethod,
    handleSubmit,
  };
}
