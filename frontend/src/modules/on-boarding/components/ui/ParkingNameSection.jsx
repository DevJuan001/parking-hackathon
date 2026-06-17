import FormField from "../../../../globals/components/ui/FormField";
import SectionButtons from "./SectionButtons";

export default function ParkingNameSection({
  activeSection,
  form,
  handleChange,
  fieldError,
  continueButtonOnClick,
  returnButtonOnClick,
}) {
  return (
    <section
      className={`${
        activeSection === "parkingName"
          ? "h-full w-full flex flex-col items-center justify-center gap-5 animate-blur-down"
          : "hidden"
      } `}
    >
      <div className="w-4xl flex flex-col items-center">
        <span
          className="text-xl text-nowrap font-medium text-[#75777e]
          dark:text-[#7E8088]"
        >
          Ahora configuremos la información de tu parqueadero.
        </span>

        <span
          className="text-6xl font-semibold
          dark:text-[#E4E2E5]"
        >
          ¿Cómo se llama tu parqueadero?
        </span>
      </div>

      <form className="w-lg flex flex-col gap-2">
        <FormField
          name={"parking_name"}
          labelText={"Nombre *"}
          placeholder={"Escribe el nombre aquí"}
          value={form.parking_name}
          onChange={handleChange}
          className={fieldError("parking_name")}
        />

        <SectionButtons
          continueButtonText={"Continuar"}
          continueButtonOnClick={continueButtonOnClick}
          returnButtonOnClick={returnButtonOnClick}
        />
      </form>
    </section>
  );
}
