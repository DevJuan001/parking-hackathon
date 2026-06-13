export default function FormField({
  value,
  labelText,
  id,
  type = "text",
  placeholder,
  onChange,
  name,
  autoComplete = "off",
  children,
  className,
  disabled,
}) {
  return (
    <div
      className={`relative flex w-full border pr-2 rounded-2xl bg-[#FBF9FC] overflow-hidden transition-shadow duration-200
      focus-within:shadow-[0_0_3px_2px_#e5e7eb]
      dark:bg-black dark:border-[#1e1e20cb] dark:focus-within:shadow-[0_0_3px_3px_#28282b]
      ${className ? className : "shadow-sm"}
      `}
    >
      <input
        required
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        type={type}
        id={id}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`
          w-full h-16 pt-7 px-4 pb-2 outline-none
          bg-transparent rounded-xl
          transition-all duration-200
          dark:text-[#E4E2E5] dark:placeholder:text-[#b4aab4]
          ${disabled ? "text-[#0000007a]" : "text-black"}
        `}
      />

      {labelText && (
        <label
          htmlFor={id}
          className="
          absolute left-3.5 top-5 px-0.5
          -translate-y-1/2
          text-xs text-[#7E777E]
          pointer-events-none
          transition-all duration-200
          bg-[#FBF9FC] dark:bg-black dark:text-[#b4aab4]
        "
        >
          {labelText}
        </label>
      )}
      {children}
    </div>
  );
}
