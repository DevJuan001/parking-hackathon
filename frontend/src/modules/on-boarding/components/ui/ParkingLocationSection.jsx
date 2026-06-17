// Hooks
import { useCountries } from "../../hooks/useCountries";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Componentes
import SectionButtons from "./SectionButtons";
import Loader from "../../../../globals/components/ui/Loader";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";
// Modales
import ErrorModal from "../../../../globals/components/modals/ErrorModal";

export default function ParkingLocationSection({
  activeSection,
  form,
  loading,
  error,
  handleChange,
  fieldError,
  handleSubmit,
  returnButtonOnClick,
}) {
  const { innerType, innerTrigger, openInnerModal, closeInnerModal } =
    useInnerModal();
  const { countries } = useCountries();

  return (
    <section
      className={`${
        activeSection === "parkingLocation"
          ? "h-full w-full flex flex-col items-center justify-center gap-5 animate-blur-down"
          : "hidden"
      }`}
    >
      <div className="w-5xl flex flex-col items-center gap-1">
        <span
          className="text-xl text-nowrap font-medium text-[#75777e]
          dark:text-[#7E8088]"
        >
          Un último paso para completar la configuración inicial.
        </span>

        <span
          className="text-5xl font-semibold
          dark:text-[#E4E2E5]"
        >
          ¿En qué país te encuentras?
        </span>
      </div>

      <form className="w-lg flex flex-col gap-2">
        <SelectMenu
          searchable
          id={"countries-menu"}
          name={"parking_country"}
          spanText={"País"}
          value={form.parking_country}
          onChange={handleChange}
          options={countries.map((country) => ({
            value: country.id,
            label: country.name,
          }))}
          className={fieldError("parking_country")}
        />

        <SectionButtons
          continueButtonText={loading ? <Loader /> : "Continuar"}
          continueButtonOnClick={(e) => handleSubmit(e, openInnerModal)}
          returnButtonOnClick={returnButtonOnClick}
        />
      </form>

      {innerType === "error" && (
        <ErrorModal
          isOpen={true}
          triggerRef={innerTrigger}
          location="center"
          errorTitle={"No se pudo configurar tu parqueadero"}
          errorText={error}
          confirmButtonText={"Volver a intentar"}
          onClose={closeInnerModal}
        />
      )}
    </section>
  );
}
