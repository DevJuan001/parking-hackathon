import Icon from "../ui/Icon";

export default function ConfirmCancelButtons({
  disabled = false,
  itemsPosition = "center",
  flexDirection,
  confirmImage,
  confirmImageDisplay = false,
  confirmText = "Confirmar",
  confirmBgColor = "#000",
  confirmButtonOnClick,
  cancelText = "Cancelar",
  cancelButtonWidth,
  cancelButtonOnClick,
  confirmBtnRef,
}) {
  return (
    <section
      className={`flex ${flexDirection} items-center self-${itemsPosition} pt-5 gap-2`}
    >
      <button
        id="confirm-button"
        ref={confirmBtnRef}
        onClick={confirmButtonOnClick}
        disabled={disabled}
        style={{ backgroundColor: confirmBgColor }}
        className={`h-11 flex items-center px-5 py-2.5 gap-2 font-medium text-sm text-white rounded-2xl transition duration-300
        hover:text-gray-300
        dark:bg-white dark:text-black dark:hover:text-gray-800`}
      >
        {confirmImage && (
          <Icon
            name={confirmImage}
            size={24}
            className={`dark:invert-0 ${confirmImageDisplay ? "block" : "hidden"}`}
          />
        )}
        <span>{confirmText}</span>
      </button>

      <button
        id="cancel-button"
        disabled={disabled}
        onClick={cancelButtonOnClick}
        className={`${cancelButtonWidth} h-11 px-5 py-2.5 rounded-2xl text-sm transition duration-300 bg-[#F5F3F6]
        hover:bg-gray-200
        dark:bg-[#101012] dark:text-white dark:hover:bg-[#28282bbd]`}
      >
        <span>{cancelText}</span>
      </button>
    </section>
  );
}
