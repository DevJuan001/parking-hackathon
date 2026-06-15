export default function Hero({ openModal }) {
  return (
    <section
      id="hero"
      className="w-full mt-36 mb-28 flex flex-col items-center gap-5
      dark:text-white"
    >
      <h1 className="text-6xl font-semibold dark:text-[#E4E2E5]">
        Gestiona tu Parqueadero Fácil
      </h1>

      <p className="text-2xl text-center text-[#7E8088] font-medium w-xl">
        Registra vehículos, asigna plazas, calcula tarifas automáticamente y
        administra toda tu operación desde un único panel.
      </p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={(e) => {
            e.preventDefault();
            openModal(null, "register", e.currentTarget);
          }}
          className="px-7 py-3 border rounded-3xl font-semibold bg-black text-white transition-transform duration-300
          hover:scale-[1.02] hover:text-[#ffffffb4]
          dark:bg-white dark:text-black dark:hover:text-black"
        >
          Prueba gratis
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            openModal(null, "logIn", e.currentTarget);
          }}
          className="px-6 py-3 border border-[#e5e7eb] rounded-3xl font-semibold transition-colors duration-300
          hover:bg-gray-200
          dark:text-[#e4e2e5] dark:border-[#202022] dark:hover:bg-[#202022]"
        >
          Iniciar sesión
        </button>
      </div>
    </section>
  );
}
