import { useState } from "react";

export function useCalendar(value, onChange, onClose) {
  const today = new Date();

  const getInitialCurrent = () => {
    if (value) {
      const [yyyy, mm, dd] = value.split("-").map(Number);
      if (yyyy && mm && dd) {
        return { year: yyyy, month: mm - 1 };
      }
    }
    return { year: today.getFullYear(), month: today.getMonth() };
  };

  const [current, setCurrent] = useState(getInitialCurrent);

  const { year, month } = current;

  const firstDow = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () =>
    setCurrent((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { ...prev, month: prev.month - 1 },
    );
  const nextMonth = () =>
    setCurrent((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { ...prev, month: prev.month + 1 },
    );

  const handleSelect = (day) => {
    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(formatted);
    onClose();
  };

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const isSelected = (day) => {
    if (!value) return false;
    const [yyyy, mm, dd] = value.split("-").map(Number);
    return day === dd && month + 1 === mm && year === yyyy;
  };

  return {
    year,
    month,
    firstDow,
    daysInMonth,
    prevMonth,
    nextMonth,
    handleSelect,
    isToday,
    isSelected,
  };
}
