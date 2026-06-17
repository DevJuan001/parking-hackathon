import ErrorModal from "../../../../globals/components/modals/ErrorModal";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";
import FormField from "../../../../globals/components/ui/FormField";
import Loader from "../../../../globals/components/ui/Loader";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
import SectionButtons from "./SectionButtons";

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
          ¿Dónde está ubicado tu parqueadero?
        </span>
      </div>

      <form className="w-lg flex flex-col gap-2">
        <SelectMenu
          id={"department-menu-city"}
          name={"parking_deparment"}
          spanText={"Departamento"}
          value={form.parking_deparment}
          onChange={handleChange}
          options={[{}]}
          className={fieldError("parking_deparment")}
        />

        <FormField
          name={"parking_address"}
          labelText={"Dirección *"}
          placeholder={"Escribe el nombre aquí"}
          value={form.parking_address}
          onChange={handleChange}
          className={fieldError("parking_address")}
        />

        <SectionButtons
          continueButtonText={loading ? <Loader /> : "Continuar"}
          continueButtonOnClick={(e) => handleSubmit(e, openInnerModal)}
          returnButtonOnClick={returnButtonOnClick}
        />

        {innerType === "error" && (
          <ErrorModal
            isOpen={true}
            triggerRef={innerTrigger}
            errorTitle={"No se pudo configurar tu perfil"}
            errorText={error}
            onClose={closeInnerModal}
          />
        )}
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
