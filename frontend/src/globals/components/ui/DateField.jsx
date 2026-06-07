import { useInnerModal } from "../../hooks/useInnerModal";
import Calendar from "./Calendar";
import Icon from "./Icon";

export default function DateField({
  id,
  spanText,
  value,
  name,
  onChange,
  growDirection = "center",
  className,
}) {
  const { innerType, innerTrigger, openInnerModal } = useInnerModal();

  return (
    <button
      id={id}
      onClick={(e) => openInnerModal("calendar", e)}
      className={`relative w-full h-[66px] flex px-4 rounded-2xl border outline-[#00000028] text-center text-sm cursor-pointer
      focus:shadow-[0_0_2px_1px_#e5e7eb]
      dark:border-[#1e1e20cb] dark:text-white
      ${className ? className : "shadow-sm"}`}
    >
      <div className="min-w-full max-w-full flex items-center pr-3">
        <div className="min-w-full max-w-28 flex flex-col items-start">
          <span className="text-xs text-[#7E7777]">{spanText}</span>
          <input
            id={id}
            className="w-full outline-none cursor-pointer bg-transparent text-base"
            readOnly
            name={name}
            value={value}
            onChange={onChange}
          />
        </div>
        <Icon
          name={"calendar_today"}
          size={14}
          fill
          className="dark:text-[#7e8088]"
        />
      </div>
      {innerType === "calendar" && (
        <Calendar
          value={value}
          growDirection={growDirection}
          triggerRef={innerTrigger}
          onChange={(formatted) => {
            onChange({ target: { name, value: formatted } });
            openInnerModal(null);
          }}
          onClose={() => openInnerModal(null)}
        />
      )}
    </button>
  );
}
