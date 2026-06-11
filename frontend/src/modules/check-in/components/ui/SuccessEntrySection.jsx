import Icon from "../../../../globals/components/ui/Icon";

export default function SuccessEntrySection({ setActiveSection }) {
  setTimeout(() => setActiveSection("createEntry"), 5000);

  return (
    <section className="w-full h-full flex flex-col animate-blur-down">
      <div className="self-center h-full flex flex-col justify-center gap-2">
        <div className="w-20 h-20 flex items-center justify-center bg-green-200 rounded-full">
          <Icon name={"check"} size={50} color={"#008236"} />
        </div>
        <span className="text-3xl text-[#75777E]">¡Gracias por elegirnos!</span>

        <span className="text-6xl font-semibold">
          Dirigete al piso 1 y a la plaza A-01
        </span>
      </div>
    </section>
  );
}
