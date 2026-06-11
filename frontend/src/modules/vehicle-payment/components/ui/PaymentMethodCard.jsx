import Icon from "../../../../globals/components/ui/Icon";
import { paymentMethodStyles } from "../../constants/paymentMethodStyles";

export default function PaymentMethodCard({
  id,
  icon,
  text,
  onClick,
  activePaymentMethod,
}) {
  return (
    <button
      id={`payment-method-${id}`}
      onClick={onClick}
      className={`h-32 w-44 flex flex-col items-center justify-center rounded-2xl p-5 gap-1 border border-[#ffffff99] shadow outline-0
      hover:scale-[1.02]
      ${activePaymentMethod === id ? "bg-[#00000015]" : "bg-[#ffffff3d] hover:bg-[#00000006]"}
      `}
    >
      <Icon
        name={icon}
        size={40}
        fill
        className={paymentMethodStyles[text]?.styles}
      />

      <span className="font-medium">{text}</span>
    </button>
  );
}
