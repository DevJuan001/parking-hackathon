import Icon from "../../../../globals/components/ui/Icon";

export default function ErrorModal({ onClose }) {
  return (
    <section className="flex flex-col items-center gap-1 animate-blur-up">
      <div className="w-24 h-24 flex items-center justify-center bg-red-200 rounded-full dark:bg-[#450a0a81]">
        <Icon name={"close"} size={40} color={"#dc2626"} />
      </div>
      <section className="flex flex-col items-center text-center gap-2 dark:text-white">
        <span className="text-xl font-medium">
          Usuario o contraseña incorrectos
        </span>
        <span className="text-sm">
          Verifica que tus credenciales esten escritas correctamente e intentalo
          nuevamente
        </span>
      </section>

      <button
        onClick={onClose}
        className="mt-5 px-6 py-3 bg-black rounded-xl font-medium text-white
        dark:bg-white dark:text-black dark:hover:bg-white/90"
      >
        Ok
      </button>
    </section>
  );
}
