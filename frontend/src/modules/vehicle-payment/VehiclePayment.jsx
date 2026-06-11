//Hooks
import { useState } from "react";
import { useCalculatePayment } from "./hooks/useCalculatePayment";
// Componentes
import CreatePaymentSection from "./components/ui/CreatePaymentSection";
import SuccessPaymentSection from "./components/ui/SuccessPaymentSection";
import CalculatePaymentSection from "./components/ui/CalculatePaymentSection";

export default function VehiclePayment() {
  const [activeSection, setActiveSection] = useState("calculatePayment");
  const {
    paymentData,
    paymentDetails,
    loading,
    error,
    handleChange,
    handleSubmit,
  } = useCalculatePayment(setActiveSection);

  return (
    <section className="w-full h-full flex flex-col items-center justify-between p-6 font-dmsans bg-noise">
      {activeSection === "calculatePayment" && (
        <CalculatePaymentSection
          paymentData={paymentData}
          loading={loading}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}

      {activeSection === "createPayment" && (
        <CreatePaymentSection
          setActiveSection={setActiveSection}
          paymentDetails={paymentDetails}
        />
      )}
 
      {activeSection === "successPayment" && <SuccessPaymentSection setActiveSection={setActiveSection} />}
    </section>
  );
}
