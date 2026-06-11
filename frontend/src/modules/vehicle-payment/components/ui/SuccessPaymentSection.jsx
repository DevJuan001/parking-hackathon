import Icon from "../../../../globals/components/ui/Icon";

export default function SuccessPaymentSection({ setActiveSection }) {
  setTimeout(() => setActiveSection("calculatePayment"), 5000);

  return (
    <div className="self-center h-full flex flex-col justify-center gap-2">
      <div className="w-20 h-20 flex items-center justify-center bg-green-200 rounded-full">
        <Icon name={"check"} size={50} color={"#008236"} />
      </div>
      <span className="text-3xl text-[#75777E]">¡Gracias por elegirnos!</span>

      <span className="text-6xl font-semibold">
        Pago registrado correctamente
      </span>

      <span className="text-3xl text-[#75777E]">
        Esperamos tenerte de vuelta
      </span>
    </div>
  );
}
