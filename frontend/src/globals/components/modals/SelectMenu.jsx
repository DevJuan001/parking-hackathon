import Icon from "../ui/Icon";
import Modal from "./Modal";
import { useSelectMenu } from "../../hooks/useSelectMenu";

export default function SelectMenu({
  id,
  name,
  onChange,
  value,
  spanText,
  options = [],
  addIconFunction,
  addIconRef,
  seeAddButton = false,
  searchable = false,
  growDirection = "center",
  className,
  showAllOption = false,
  miniVersion = false,
}) {
  const {
    open,
    search,
    setSearch,
    triggerRef,
    handleSelect,
    handleClose,
    handleToggle,
  } = useSelectMenu();

  const allOptions = showAllOption
    ? [{ value: "", label: "Todos" }, ...options]
    : options;

  const filteredOptions = searchable
    ? allOptions.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()),
      )
    : allOptions;

  return (
    <section
      className={`relative ${miniVersion ? "w-32" : "w-full"} flex flex-col gap-1`}
    >
      <div
        className={`${miniVersion ? "h-10" : "h-[66px]"} w-full flex items-center gap-1.5`}
      >
        <button
          type="button"
          id={id}
          ref={triggerRef}
          onClick={handleToggle}
          className={`relative w-full pr-2 flex items-center bg-[#FBF9FC] border border-[#a1a1a131]
            ${spanText ? "h-full pt-1.5 rounded-2xl" : miniVersion ? "h-9 rounded-xl" : "h-14 rounded-2xl"}
            cursor-pointer text-sm
            dark:bg-black dark:border-[#1e1e20cb]
            ${className ? className : "shadow-sm"}`}
        >
          {spanText && (
            <div className="absolute top-2 left-3 px-1">
              <span className="text-xs bg-[#FBF9FC] text-[#7E777E] dark:bg-black dark:text-[#7E8088]">
                {spanText}
              </span>
            </div>
          )}

          <div
            className={`w-full flex pl-4 ${spanText ? "pt-3" : "pt-0"} dark:text-[#E4E2E5]`}
          >
            <div
              className={`w-full flex items-center ${miniVersion ? "text-sm" : "text-base"}`}
            >
              {allOptions.find((opt) => {
                if (opt.value !== "" && !isNaN(opt.value)) {
                  return Number(opt.value) === Number(value);
                }
                return String(opt.value) === String(value);
              })?.label ?? "Seleccionar"}
            </div>
          </div>

          <Icon name={"arrow_drop_down"} className={`dark:text-[#7e8088]`} />
        </button>

        {seeAddButton && (
          <button
            ref={addIconRef}
            onClick={(e) => {
              e.stopPropagation();
              if (addIconFunction) addIconFunction(e);
            }}
            type="button"
            className={`h-16 flex items-center justify-center px-5 border rounded-2xl transition-colors duration-200 bg-[#FBF9FC] shadow-sm
            hover:bg-gray-200 hover:cursor-pointer
            dark:bg-black dark:border-[#1e1e20cb] dark:hover:bg-[#28282bbd]`}
          >
            <Icon name={"add"} size={22} className="dark:text-[#E4E2E5]" />
          </button>
        )}
      </div>

      {open && (
        <Modal
          isOpen={open}
          onClose={handleClose}
          triggerRef={triggerRef}
          growDirection={growDirection}
          type="select"
          z_index="600"
        >
          <div
            className={`w-full h-fit max-h-96 flex flex-col gap-1 px-1 py-1 overflow-y-auto rounded-3xl bg-[#fbf9fc]
            dark:bg-black dark:text-white  
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {searchable && (
              <input
                id="search-menu-bar"
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full min-h-[50px] px-5 sticky top-0.5 text-sm rounded-full border border-[#a1a1a131] outline-none
                dark:border-[#28282ba1] dark:bg-black dark:text-white dark:placeholder:text-[#b4aab4]"
              />
            )}
            {filteredOptions.length === 0 ? (
              <div className="min-h-[50px] flex items-center justify-center text-[#7E777E] gap-2.5">
                <Icon name={"search_off"} />

                <span className="text-center text-sm py-6">
                  No se encontraron resultados
                </span>
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected =
                  option.value !== "" && !isNaN(option.value)
                    ? Number(option.value) === Number(value)
                    : String(option.value) === String(value);

                return (
                  <button
                    id={`${id}-${option.value}-option`}
                    key={option.value}
                    onClick={() => handleSelect(option, name, onChange)}
                    className={`min-h-[52px] flex items-center px-5 cursor-pointer text-sm rounded-full transition-colors
                      hover:bg-[#efedf0] hover:font-medium  
                      dark:hover:bg-[#ffffff15]
                      ${isSelected ? "bg-[#efedf0] font-semibold dark:bg-[#ffffff15]" : ""}`}
                  >
                    <span>{option.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </Modal>
      )}
    </section>
  );
}
