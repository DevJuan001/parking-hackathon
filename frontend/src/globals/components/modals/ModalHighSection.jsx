import Icon from "../ui/Icon";

export default function ModalHighSection({
  icon,
  text,
  deleteButtonOnClick,
  closeButtonOnClick,
}) {
  return (
    <div
      className="w-full h-44 flex justify-between items-center py-2 px-2 gap-2 bg-[#efedf0] border-2 rounded-3xl font-inter
      dark:bg-[#101012] dark:border-[#202022]"
    >
      {deleteButtonOnClick && (
        <button
          onClick={deleteButtonOnClick}
          className="self-start flex items-center p-2.5 rounded-3xl bg-[#fbf9fc] border transition-colors duration-200 group
          hover:bg-[#ff5b5b41]
          dark:bg-black dark:text-[#7E8088]"
        >
          <Icon
            name={"delete"}
            size={20}
            className={"group-hover:text-red-700"}
          />
        </button>
      )}

      <div className="justify-self-center flex flex-col items-center">
        <Icon name={icon} size={60} fill />

        <span className="font-semibold text-lg">{text}</span>
      </div>

      <button
        onClick={closeButtonOnClick}
        className="self-start flex items-center p-2.5 rounded-3xl bg-[#fbf9fc] border transition-colors duration-200
        hover:bg-[#ffffff3d]
        dark:bg-black dark:text-[#7E8088] dark:hover:bg-[#101012]"
      >
        <Icon name={"close"} size={20} />
      </button>
    </div>
  );
}
