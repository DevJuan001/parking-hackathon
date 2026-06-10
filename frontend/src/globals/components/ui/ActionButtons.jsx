import Icon from "./Icon";

export default function ActionButtons({
  children,
  backgroundColor = "#F5F3F6",
  visibilityIcon = true,
  editButtonId,
  editButtonVisible = true,
  editButtonOnClick,
  deleteButtonId,
  deleteButtonVisible = true,
  deleteButtonOnClick,
  moreInfoButtonOnClick,
  moreInfoButtonVisible = true,
}) {
  return (
    <section className="flex items-center justify-center gap-3 dark:invert">
      {children}

      {moreInfoButtonVisible && (
        <button
          onClick={moreInfoButtonOnClick}
          className={`flex items-center transition-colors duration-300 rounded-xl p-1.5 bg-[${backgroundColor}]
          hover:bg-[#969292a8]`}
        >
          <Icon name={"arrow_outward"} className="dark:brightness-0" />
        </button>
      )}

      {editButtonVisible && (
        <button
          id={editButtonId}
          onClick={editButtonOnClick}
          className={`flex items-center transition-colors duration-300 rounded-xl p-1.5 bg-[${backgroundColor}]
          hover:bg-[#969292a8]`}
        >
          <Icon name={"edit"} className="dark:brightness-0" />
        </button>
      )}

      {deleteButtonVisible && (
        <button
          id={deleteButtonId}
          onClick={deleteButtonOnClick}
          className={`flex items-center transition-colors duration-300 rounded-xl p-1.5 bg-[${backgroundColor}] 
          hover:bg-[#969292a8]`}
        >
          <Icon
            name={`${visibilityIcon ? "visibility" : "visibility_off"}`}
            className="dark:brightness-0"
          />
        </button>
      )}
    </section>
  );
}
