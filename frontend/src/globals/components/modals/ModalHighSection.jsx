import Icon from "../ui/Icon";

export default function ModalHighSection({
  deleteButtonOnClick,
  closeButtonOnClick,
  icon,
  iconClassName = "dark:text-[#E4E2E5]",
  text,
}) {
  return (
    <div
      className="w-full h-44 flex justify-between items-center py-2 px-2 gap-2 bg-[#efedf0] border-2 border-[#EBE6E7] rounded-3xl font-inter
      dark:bg-[#101012] dark:border-[#202022]"
    >
      {deleteButtonOnClick && (
        <button
          type="button"
          onClick={deleteButtonOnClick}
          className="self-start flex items-center p-2.5 rounded-3xl bg-[#fbf9fc] border border-[#EBE6E7] transition-colors duration-200 group
          hover:bg-[#ff5b5b41]
          dark:bg-black dark:text-[#7E8088] dark:border-[#202022]"
        >
          <Icon
            name={"delete"}
            size={20}
            className={"group-hover:text-red-700"}
          />
        </button>
      )}

      <div className="justify-self-center flex flex-col items-center gap-3">
        <Icon name={icon} size={60} fill className={iconClassName} />

        <span
          className="w-52 font-semibold text-lg text-center text-ellipsis overflow-hidden
          dark:text-[#E4E2E5]"
        >
          {text}
        </span>
      </div>

      <button
        type="button"
        onClick={closeButtonOnClick}
        className="self-start flex items-center p-2.5 rounded-3xl bg-[#fbf9fc] border border-[#EBE6E7] transition-colors duration-200
        hover:bg-[#ffffff3d]
        dark:bg-black dark:text-[#7E8088] dark:hover:bg-[#101012] dark:border-[#202022]"
      >
        <Icon name={"close"} size={20} />
      </button>
    </div>
  );
}
