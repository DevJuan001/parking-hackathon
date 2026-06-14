// Hooks
import { useLogin } from "../../hooks/useLogin";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Componentes
import LoginAndRegisterButtons from "./LoginAndRegisterButtons";
import Icon from "../../../../globals/components/ui/Icon";
import Loader from "../../../../globals/components/ui/Loader";
import FormField from "../../../../globals/components/ui/FormField";
// Modales
import RecoverPasswordModal from "./RecoverPasswordModal";

export default function LoginModal() {
  const {
    form,
    loading,
    handleChange,
    handleSubmit,
    setShowPassword,
    showPassword,
    fieldError,
  } = useLogin();
  const { innerType, innerTrigger, openInnerModal, closeInnerModal } =
    useInnerModal();

  return (
    <section className="flex flex-col gap-3 px-52 py-40 font-poppins">
      <div className="flex gap-1 font-inter">
        <Icon name={"parking_sign"} fill size={24} className={"dark:invert"} />

        <span className="font-semibold dark:text-white">Parking</span>
      </div>

      <span className="text-4xl font-medium">Iniciar sesión</span>

      <form
        action={(e) => handleChange(e, openInnerModal)}
        className="flex flex-col gap-2"
      >
        <FormField
          id={"email"}
          name={"email"}
          labelText={"Correo"}
          value={form.email}
          onChange={handleChange}
          placeholder={"Escribe tu correo"}
          className={fieldError("email")}
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
        >
          <button
            className="flex items-center pr-1"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <Icon name={showPassword ? "visibility_off" : "visibility"} />
          </button>
        </FormField>

        <LoginAndRegisterButtons
          confirmButtonOnClick={(e) => handleSubmit(e, openInnerModal)}
          confirmButtonText={loading ? <Loader /> : "Iniciar sesión"}
          recoverPasswordButtonOnClick={(e) =>
            openInnerModal("recoverPassword", e)
          }
        />
      </form>

      {innerType === "recoverPassword" && (
        <RecoverPasswordModal
          triggerRef={innerTrigger}
          onClose={closeInnerModal}
        />
      )}
    </section>
  );
}
