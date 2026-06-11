// Hooks
import { useCreatePayment } from "../../hooks/useCreatePayment";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Componentes
import PaymentMethodCard from "./PaymentMethodCard";
import Loader from "../../../../globals/components/ui/Loader";
import ErrorModal from "../../../../globals/components/modals/ErrorModal";

export default function CreatePaymentSection({
  setActiveSection,
  paymentDetails,
}) {
  const { paymentMethods } = usePaymentMethods();
  const { innerType, innerTrigger, openInnerModal, closeInnerModal } =
    useInnerModal();
  const {
    activePaymentMethod,
    setActivePaymentMethod,
    loading,
    error,
    handleSubmit,
  } = useCreatePayment(setActiveSection, paymentDetails);

  return (
    <section className="w-full h-full flex flex-col">
      <div className="self-center justify-self-center h-full flex flex-col items-center justify-center gap-7 animate-blur-down">
        <div className="w-full flex flex-col gap-2">
          <span className="text-5xl text-start text-[#7E777E]">
            Valor a pagar
          </span>

          <span className="text-7xl font-semibold">
            ${paymentDetails?.total} COP
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-4xl text-[#7E777E]">
            Elige el metodo de pago
          </span>

          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((paymentMethod) => (
              <PaymentMethodCard
                key={paymentMethod.id}
                id={paymentMethod.id}
                icon={paymentMethod.icon}
                text={paymentMethod.name}
                activePaymentMethod={activePaymentMethod}
                onClick={() => setActivePaymentMethod(paymentMethod.id)}
              />
            ))}
          </div>
        </div>

        <button
          onClick={(e) => handleSubmit(e, openInnerModal)}
          className="w-full py-5 rounded-3xl bg-black text-white font-semibold
            hover:bg-black/90"
        >
          {loading ? <Loader /> : "Enviar"}
        </button>
      </div>

      {innerType === "error" && (
        <ErrorModal
          isOpen={true}
          location="center"
          triggerRef={innerTrigger}
          onClose={closeInnerModal}
          errorTitle={"No se pudo calcular el pago"}
          errorText={error}
        />
      )}
    </section>
  );
}
