import FormField from "../../../../globals/components/ui/FormField";
import SectionButtons from "./SectionButtons";

export default function UserInfoSection({
  activeSection,
  setActiveSection,
  setProgress,
  form,
  handleChange,
  fieldError,
}) {
  return (
    <section
      className={`${
        activeSection === "userInfo"
          ? "h-full w-full flex flex-col items-center justify-center gap-5 animate-blur-down"
          : "hidden"
      }`}
    >
      <div className="w-lg flex flex-col">
        <span
          className="text-lg text-nowrap font-medium text-[#75777e]
          dark:text-[#7E8088]"
        >
          Estamos a pocos pasos de poner tu parqueadero en marcha.
        </span>

        <span
          className="text-6xl font-semibold
          dark:text-[#E4E2E5]"
        >
          ¿Cómo te llamas?
        </span>
      </div>

      <form className="w-lg flex flex-col gap-2">
        <FormField
          labelText={"Nombre *"}
          placeholder={"Escribe tu nombre aquí"}
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          className={fieldError("name")}
        />

        <FormField
          labelText={"Primer apellido *"}
          placeholder={"Escribe tu apellido aqui"}
          name="first_surname"
          value={form.first_surname}
          onChange={handleChange}
          autoComplete="family-name"
          className={fieldError("first_surname")}
        />

        <FormField
          labelText={"Segundo apellido"}
          placeholder={"Opcional"}
          name="second_surname"
          value={form.second_surname}
          onChange={handleChange}
          autoComplete="family-name"
          className={fieldError("second_surname")}
        />

        <SectionButtons
          continueButtonText={"Continuar"}
          continueButtonOnClick={() => {
            setProgress(200);
            setActiveSection("parkingName");
          }}
        />
      </form>
    </section>
  );
}
