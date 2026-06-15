/// Hooks
import { useRegister } from "../../hooks/useRegister";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Componentes
import Icon from "../../../../globals/components/ui/Icon";
import Loader from "../../../../globals/components/ui/Loader";
import LoginAndRegisterButtons from "./LoginAndRegisterButtons";
import FormField from "../../../../globals/components/ui/FormField";
// Modales
import ErrorModal from "../../../../globals/components/modals/ErrorModal";

export default function RegisterModal() {
  const {
    form,
    loading,
    error,
    fieldError,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
  } = useRegister();
  const { innerType, innerTrigger, openInnerModal, closeInnerModal } =
    useInnerModal();

  return (
    <section className="flex flex-col gap-3 px-52 py-32 font-poppins">
      <div className="flex gap-1 font-inter">
        <Icon name={"parking_sign"} fill size={24} className={"dark:invert"} />

        <span className="font-semibold dark:text-white">Parking</span>
      </div>

      <span className="text-4xl font-medium dark:text-white">
        Crea tu cuenta
      </span>

      <form
        action={(e) => handleChange(e, openInnerModal)}
        className="flex flex-col gap-2 dark:text-white"
      >
        <FormField
          id={"email"}
          name={"email"}
          labelText={"Correo"}
          value={form.email}
          onChange={handleChange}
          placeholder={"Escribe tu correo"}
          className={fieldError("email")}
          autoComplete="off"
        />

        <FormField
          id={"password"}
          name={"password"}
          labelText={"Contraseña"}
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          placeholder={"Escribe tu contraseña"}
          className={fieldError("password")}
          autoComplete="off"
        >
          <button
            className="flex items-center pr-1"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <Icon name={showPassword ? "visibility_off" : "visibility"} />
          </button>
        </FormField>

        <FormField
          id={"repeat_password"}
          name={"repeat_password"}
          labelText={"Repite tu contraseña"}
          type={showPassword ? "text" : "password"}
          value={form.repeat_password}
          onChange={handleChange}
          placeholder={"Repite tu contraseña"}
          className={fieldError("password")}
          autoComplete="off"
        >
          <button
            className="flex items-center pr-1"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <Icon name={showPassword ? "visibility_off" : "visibility"} />
          </button>
        </FormField>

        <div className="mt-2.5 flex items-center gap-2">
          <input
            required
            type="checkbox"
            className="transition-transform duration-100"
          />

          <p className="text-xs">
            He leído y acepto la {""}
            <a
              href="/privacy"
              className="text-blue-800 border-b border-blue-800"
            >
              Politica de Privacidad {""}
            </a>
            y los {""}
            <a href="/terms" className="text-blue-800 border-b border-blue-800">
              Términos y Condiciones
            </a>
          </p>
        </div>

        <LoginAndRegisterButtons
          confirmButtonOnClick={(e) => handleSubmit(e, openInnerModal)}
          confirmButtonText={loading ? <Loader /> : "Crear cuenta"}
        />
      </form>

      {innerType === "error" && (
        <ErrorModal
          isOpen={true}
          triggerRef={innerTrigger}
          errorTitle={"No se pudo crear tu cuenta"}
          errorText={error}
          location="center"
          onClose={closeInnerModal}
        />
      )}
    </section>
  );
}
