import { useRef, useState } from "react";

export function useSelectMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const triggerRef = useRef(null);

  function handleSelect(option, name, onChange) {
    const parsed =
      option.value !== "" && !isNaN(option.value)
        ? Number(option.value)
        : option.value;
    onChange({ target: { name, value: parsed } });
    setSearch("");
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
    setSearch("");
  }

  function handleToggle() {
    if (open) {
      setSearch("");
    }
    setOpen(!open);
  }

  return {
    open,
    setOpen,
    search,
    setSearch,
    triggerRef,
    handleSelect,
    handleClose,
    handleToggle,
  };
}
