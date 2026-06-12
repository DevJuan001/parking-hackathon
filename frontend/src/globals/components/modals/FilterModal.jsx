import Icon from "../ui/Icon";
import DateField from "../ui/DateField";

export default function FilterModal({
  orderByStartDateOnChange,
  orderByStartDateValue,
  orderByFinishDateOnChange,
  orderByFinishDateValue,
  children,
  fieldName = "Creación",
  seeCleanFiltersButton = false,
  cleanFiltersOnClick,
}) {
  return (
    <section className="w-full flex flex-col gap-2 font-dmsans">
      <div
        className="w-full h-28 flex justify-between items-center pt-2 pb-7 pr-2 pl-5 gap-2 bg-[#efedf0] border-2 rounded-3xl font-inter
        dark:bg-[#101012] dark:border-[#202022]"
      >
        <div className="justify-self-center self-end flex items-center gap-2">
          <Icon name={"page_info"} size={28} className={"font-bold"} />

          <span className="font-semibold text-2xl">Filtros</span>
        </div>

        <button
          onClick={cleanFiltersOnClick}
          className="self-start flex items-center p-2.5 rounded-3xl bg-[#fbf9fc] border transition-colors duration-200
          hover:bg-[#ffffff3d]
          dark:bg-black dark:text-[#7E8088] dark:hover:bg-[#101012]"
        >
          <Icon name={"close"} size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-1 px-2">
        <span className="text-sm dark:text-white">Fecha de {fieldName}</span>

        <div className="max-w-full flex gap-2">
          <DateField
            spanText={"Desde:"}
            name={"start_date"}
            value={orderByStartDateValue ? orderByStartDateValue : "yyyy-mm-dd"}
            onChange={orderByStartDateOnChange}
          />

          <DateField
            spanText={"Hasta:"}
            name={"end_date"}
            value={
              orderByFinishDateValue ? orderByFinishDateValue : "yyyy-mm-dd"
            }
            onChange={orderByFinishDateOnChange}
          />
        </div>
      </div>

      <div className="px-2">{children}</div>

      <div className="flex items-end mt-3 gap-2">
        {seeCleanFiltersButton && (
          <button
            onClick={cleanFiltersOnClick}
            className="h-11 flex items-center px-3 py-2.5 gap-2 text-[#c0392b] rounded-2xl border
            hover:bg-red-100 transition-colors duration-200
            dark:hover:bg-[#450a0a96] dark:border-[#28282ba1]"
          >
            <Icon name={"filter_list_off"} size={20} />
            <span className="text-xs md:text-sm">Limpiar filtros</span>
          </button>
        )}
      </div>
    </section>
  );
}
