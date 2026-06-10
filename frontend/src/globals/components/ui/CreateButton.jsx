import Icon from "./Icon";

export default function CreateButton({ icon, text, borderRadius, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ borderRadius: borderRadius }}
      className={`flex items-center ${text ? "px-5" : "px-3.5"} py-5 gap-2 bg-black font-poppins transition duration-500
      lg:rounded-3xl lg:py-3
      hover:shadow-lg
      dark:bg-white dark:hover:shadow-[0px_0px_32px_-11px_#ffffff]`}
    >
      <Icon
        name={icon ? icon : "add"}
        weight={600}
        className="invert dark:brightness-200 dark:invert-0"
      />

      {text && (
        <span
          data-flip-id="modal-title"
          className="hidden text-white font-medium dark:text-black lg:block"
        >
          {text}
        </span>
      )}
    </button>
  );
}
