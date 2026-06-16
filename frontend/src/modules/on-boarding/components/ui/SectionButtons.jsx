import Icon from "../../../../globals/components/ui/Icon";

export default function SectionButtons({
  continueButtonText,
  continueButtonOnClick,
  returnButtonOnClick,
}) {
  return (
    <div className="mt-2 w-lg flex gap-2">
      {returnButtonOnClick && (
        <button
          type="button"
          onClick={returnButtonOnClick}
          className="w-full h-[66px] flex items-center justify-center py-5 gap-3 rounded-4xl font-semibold border-2 border-[#e5e7eb] transition-colors
          hover:bg-gray-200
          dark:border-[#20202296] dark:text-white dark:hover:bg-[#20202296]"
        >
          <Icon name={"arrow_back"} />

          <span>Volver</span>
        </button>
      )}

      <button
        type="button"
        onClick={continueButtonOnClick}
        className="w-full h-[66px] py-5 rounded-4xl font-semibold border bg-black text-white transition-transform duration-300
        hover:text-[#ffffffb4]
        dark:bg-white dark:text-black dark:hover:text-black dark:hover:scale-[1.01]"
      >
        {continueButtonText}
      </button>
    </div>
  );
}
