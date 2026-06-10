import Icon from "./Icon";

export default function FilterButton({ onClick, filterButtonVisibility }) {
  return (
    <button
      id="filter-button"
      onClick={onClick}
      className={`flex items-center px-5 py-2.5 gap-2 rounded-2xl bg-[#FBF9FC] transition-all duration-200 border border-gray-200
        hover:rounded-[40px]
        lg:rounded-3xl
        hover:bg-gray-300
        dark:bg-[#101012] dark:hover:bg-[#38383b9f] dark:shadow-none dark:border-none
        ${filterButtonVisibility ? "block" : "hidden"}`}
    >
      <Icon name={"page_info"} size={24} className="dark:text-[#C5C6CE]" />
      <span className="hidden font-medium dark:text-[#C5C6CE] lg:block">
        Filtrar
      </span>
    </button>
  );
}
