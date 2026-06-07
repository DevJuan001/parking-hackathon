import LoginButtons from "./LoginButtons";
import { useLogin } from "../../hooks/useLogin";
import FormField from "../../../../globals/components/ui/FormField";
import Loader from "../../../../globals/components/ui/Loader";
import Icon from "../../../../globals/components/ui/Icon";

export default function LoginForm({ openModal }) {
  const {
    form,
    loading,
    handleChange,
    handleSubmit,
    setShowPassword,
    showPassword,
    fieldError,
  } = useLogin(openModal);

  return (
    <section
      className="w-[300px] flex flex-col gap-2 font-poppins
      md:w-[450px]"
    >
      <div className="flex gap-2 font-inter mb-3">
        <div className="dark:bg-black"></div>
        <Icon name={"parking_sign"} fill size={40} className={"dark:invert"} />
        <span className="text-3xl font-semibold dark:text-white">
          Parking Hackathon
        </span>
      </div>

      <FormField
        id={"email"}
        name={"email"}
        labelText={"Correo"}
        value={form.email}
        onChange={handleChange}
        placeholder={"Correo"}
        className={fieldError("email")}
      />

      <FormField
        id={"password"}
        name={"password"}
        labelText={"Contraseña"}
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange}
        placeholder={"Contraseña"}
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

      <LoginButtons
        confirmButtonOnClick={(e) => handleSubmit(e)}
        confirmButtonText={loading ? <Loader /> : "Iniciar sesión"}
        recoverPasswordButtonOnClick={(e) =>
          openModal(null, "recoverPassword", e.currentTarget)
        }
      />
    </section>
  );
}
