import FormField from "../../../../globals/components/ui/FormField";
import SectionButtons from "./SectionButtons";

export default function ParkingLocationSection({
  activeSection,
  setActiveSection,
  setProgress,
  form,
  handleChange,
  handleSubmit,
}) {
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
        <FormField
          name={"parking_address"}
          labelText={"Nombre"}
          placeholder={"Escribe el nombre aquí"}
          value={form.parking_address}
          onChange={handleChange}
        />

        <SectionButtons
          continueButtonText={"Continuar"}
          continueButtonOnClick={(e) => handleSubmit(e)}
          returnButtonOnClick={() => {
            setActiveSection("parkingName");
            setProgress(200);
          }}
        />
      </form>
    </section>
  );
}
