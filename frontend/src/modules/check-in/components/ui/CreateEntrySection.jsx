// Hooks
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Componentes
import Icon from "../../../../globals/components/ui/Icon";
import Loader from "../../../../globals/components/ui/Loader";
// Modales
import ErrorModal from "../../../../globals/components/modals/ErrorModal";

export default function CreateEntrySection({
  entryData,
  loading,
  error,
  handleChange,
  handleSubmit,
}) {
  const { innerType, innerTrigger, openInnerModal, closeInnerModal } =
    useInnerModal();

  return (
    <section className="w-full h-full flex flex-col">
      <div className="self-center justify-self-center h-full flex flex-col items-center justify-center gap-6 animate-blur-down">
        <div className="w-full flex flex-col gap-1">
          <span className="text-3xl text-start text-[#7E777E]">Bienvenido</span>

          <div className="flex items-center gap-2">
            <span className="text-6xl font-semibold">
              Escribe tu placa aqui
            </span>

            <Icon
              name={"arrow_downward_alt"}
              size={40}
              className={"animate-jump"}
            />
          </div>
        </div>

        <input
          type="text"
          autoFocus
          placeholder="ABC123"
          name="plate"
          autoComplete="off"
          value={entryData.plate || ""}
          onChange={handleChange}
          className="w-full h-44 px-3 rounded-3xl bg-[#00000008] text-7xl text-center font-semibold outline-0
            placeholder:text-[#1b1b1e52]"
          maxLength={6}
        />

        <button
          onClick={(e) => handleSubmit(e, openInnerModal)}
          className="w-full py-5 rounded-3xl bg-black text-white font-semibold
            hover:bg-black/90"
        >
          {loading ? <Loader /> : "Enviar"}
        </button>
      </div>

      <a
        href="/vehicle-payment"
        className="self-end justify-self-end px-12 py-3 rounded-4xl bg-[#00000008] text-nowrap font-semibold transition-colors duration-300 outline-0
        hover:bg-[#00000018]"
      >
        Ir a Pagar
      </a>

      {innerType === "error" && (
        <ErrorModal
          isOpen={true}
          triggerRef={innerTrigger}
          onClose={closeInnerModal}
          errorTitle={"¡No se pudo permitir el ingreso!"}
          errorText={error}
          growDirection={"center"}
        />
      )}
    </section>
  );
}
