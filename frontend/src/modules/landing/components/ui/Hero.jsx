export default function Hero({ openModal }) {
  return (
    <section
      id="hero"
      className="w-full my-32 flex flex-col items-center gap-4"
    >
      <h1 className="text-6xl font-semibold">Gestiona tu Parqueadero Fácil</h1>

      <p className="text-2xl text-center text-gray-500 font-medium w-xl">
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
          hover:scale-[1.02] hover:text-[#ffffffb4]"
        >
          Prueba gratis
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            openModal(null, "logIn", e.currentTarget);
          }}
          className="px-6 py-3 border rounded-3xl font-semibold transition-colors duration-300
          hover:bg-gray-200"
        >
          Iniciar sesión
        </button>
      </div>
    </section>
  );
}
