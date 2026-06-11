import { months } from "../../../utils/months";
import { useCalendar } from "../../hooks/useCalendar";
import Icon from "./Icon";
import Modal from "../modals/Modal";

export default function Calendar({
  onClose,
  value,
  onChange,
  triggerRef,
  growDirection,
}) {
  const {
    year,
    month,
    firstDow,
    daysInMonth,
    prevMonth,
    nextMonth,
    handleSelect,
    isToday,
    isSelected,
  } = useCalendar(value, onChange, onClose);

  return (
    <Modal
      triggerRef={triggerRef}
      isOpen={true}
      onClose={onClose}
      type="calendar"
      z_index="250"
      growDirection={growDirection}
    >
      <div
        className="w-full min-h-96 p-2 bg-white border border-[#a1a1a131] rounded-[32px] cursor-default overflow-hidden z-[600]
        dark:border-[#ffffff15] dark:bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-[#a1a1a13f] dark:border-[#ffffff15]">
          <span className="text-base font-medium dark:text-white">
            {months[month]} {year}
          </span>
          <div className="flex">
            <button
              onClick={prevMonth}
              className="w-10 h-10 flex items-center pr-0.5 justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-[#ffffff15] rounded-full"
            >
              <Icon name={"arrow_back_ios_new"} size={18} />
            </button>
            <button
              onClick={nextMonth}
              className="w-10 h-10 flex items-center pl-1 justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-[#ffffff15] rounded-full"
            >
              <Icon name={"arrow_forward_ios"} size={18} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-0.5 text-center text-sm dark:text-white">
          <div>Do</div>
          <div>Lu</div>
          <div>Ma</div>
          <div>Mi</div>
          <div>Ju</div>
          <div>Vi</div>
          <div>Sa</div>
          {/* Mes anterior */}
          {Array.from({ length: firstDow }).map((_, i) => {
            const prevMonthDays = new Date(year, month, 0).getDate();
            const day = prevMonthDays - firstDow + i;
            return (
              <button
                key={`prev-${i}`}
                type="button"
                disabled
                style={{ aspectRatio: 1 }}
                className="flex items-center justify-center text-[13px] rounded-full text-gray-300 dark:text-[#ffffff25]"
              >
                {day}
              </button>
            );
          })}

          {/* Mes actual */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => handleSelect(day)}
              style={{ aspectRatio: 1 }}
              className={`flex items-center justify-center text-base rounded-2xl transition-colors hover:text-black
                ${
                  isSelected(day)
                    ? "bg-black text-white font-bold text-lg dark:bg-white dark:text-black hover:bg-gray-200"
                    : isToday(day)
                      ? "bg-gray-100 dark:bg-[#75777e60] font-medium dark:text-white hover:bg-gray-200 hover:font-bold"
                      : "text-[#44474e] hover:bg-gray-200 dark:hover:bg-[#ffffff15] dark:text-white hover:font-bold"
                }`}
            >
              {day}
            </button>
          ))}

          {/* Mes siguiente */}
          {(() => {
            const totalCells = firstDow + daysInMonth;
            const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
            return Array.from({ length: remaining }).map((_, i) => (
              <button
                key={`next-${i}`}
                type="button"
                disabled
                style={{ aspectRatio: 1 }}
                className="flex items-center justify-center text-[13px] rounded-full text-gray-300 dark:text-[#ffffff25]"
              >
                {i + 1}
              </button>
            ));
          })()}
        </div>
      </div>
    </Modal>
  );
}
