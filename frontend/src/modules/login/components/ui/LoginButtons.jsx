export default function LoginButtons({
  confirmButtonText,
  confirmButtonOnClick,
  recoverPasswordButtonOnClick,
  disabled,
}) {
  return (
    <section className="flex flex-col items-center pt-5 gap-2">
      <button
        id="login-button"
        onClick={confirmButtonOnClick}
        disabled={disabled}
        className="w-full h-15 flex items-center justify-center px-5 py-2.5 gap-2 font-semibold text-sm bg-black text-white rounded-2xl transition duration-300
        hover:text-gray-300 hover:cursor-pointer
        dark:bg-white dark:text-black dark:hover:text-gray-800"
      >
        <span className="dark:text-black">{confirmButtonText}</span>
      </button>

      <button
        id="recover-password-button"
        disabled={disabled}
        onClick={recoverPasswordButtonOnClick}
        className="w-full h-15 px-5 py-2.5 rounded-2xl text-sm font-medium transition duration-300 border
        hover:bg-gray-200 hover:cursor-pointer
        dark:border-[#1e1e20cb] dark:text-white dark:hover:bg-[#28282bbd]"
      >
        <span>Recuperar contraseña</span>
      </button>
    </section>
  );
}
