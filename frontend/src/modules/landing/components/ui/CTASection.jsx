import Icon from "../../../../globals/components/ui/Icon";

export default function CTASection({ openModal }) {
  return (
    <section className="my-44 w-full flex flex-col gap-3 items-center">
      <span
        className="text-5xl text-[#1b1b1e] font-semibold
        dark:text-[#e4e2e5]"
      >
        ¿Listo para transformar la gestión de tu parqueadero?
      </span>

      <span
        className="max-w-2xl text-2xl text-center text-[#75777e] font-medium
        dark:text-[#7E8088]"
      >
        Deja atrás los procesos manuales y centraliza toda tu operación en una
        plataforma diseñada para ahorrar tiempo, mejorar el control y aumentar
        la eficiencia.
      </span>

      <div className="mt-5 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openModal(null, "register", e.currentTarget);
          }}
          className="px-7 py-3 border rounded-3xl font-semibold bg-black text-white transition-transform duration-300
          hover:scale-[1.02] hover:text-[#ffffffb4]
          dark:bg-white dark:text-black dark:hover:text-black"
        >
          Probar gratis
        </button>

        <a
          target="_blank"
          href="https://wa.me/3001231231"
          className="px-6 py-3 border border-[#e5e7eb] rounded-3xl font-semibold transition-colors duration-300
          hover:bg-gray-200
          dark:text-[#e4e2e5] dark:border-[#202022] dark:hover:bg-[#202022]"
        >
          Hablar con un asesor
        </a>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className="flex items-center gap-1">
          <Icon name={"check"} size={14} /> Configuración rápida
        </span>

        <span className="flex items-center gap-1">
          <Icon name={"check"} size={14} /> Sin instalaciones
        </span>

        <span className="flex items-center gap-1">
          <Icon name={"check"} size={14} /> Acceso desde cualquier lugar
        </span>
      </div>
    </section>
  );
}
