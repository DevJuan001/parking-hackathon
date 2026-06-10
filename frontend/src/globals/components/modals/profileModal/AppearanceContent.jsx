import Icon from "../../ui/Icon";
import SelectMenu from "../SelectMenu";
import { useTheme } from "../../../hooks/useTheme";

export default function AppearanceContent() {
  const { setTheme } = useTheme();

  return (
    <section className="h-full w-full flex flex-col pb-10 gap-7 animate-blur-up dark:text-white">
      {/* Opciones de apariencia */}
      <div className="w-full flex flex-col gap-2">
        <span className="font-medium text-sm">Apariencia</span>
        <div className="flex gap-3 w-full">
          {/* Sistema */}
          <button
            onClick={() => setTheme("system")}
            className={`w-28 flex flex-col items-start justify-between gap-1.5 py-2.5 pl-3 border rounded-xl
            focus-within:shadow-[0_0_3px_2px_#e5e7eb]
            dark:bg-[#2020226c] dark:border-[#202022] dark:focus-within:shadow-[0_0_3px_3px_#28282b]
            md:w-[135px]
            `}
          >
            <div className="flex items-center">
              <Icon
                fill
                name={"circle"}
                size={18}
                color={"#ffffff"}
                className="border rounded-full dark:border-none"
              />

              <Icon
                fill
                name={"circle"}
                size={20}
                color={"#000"}
                className={"rounded-3xl dark:border dark:border-gray-900"}
              />
            </div>
            <span className="font-medium text-sm">Sistema</span>
          </button>

          {/* Claro */}
          <button
            onClick={() => setTheme("light")}
            className={`w-28 flex flex-col items-start justify-between gap-2 py-2.5 pl-3 border rounded-xl
            focus-within:shadow-[0_0_3px_2px_#e5e7eb]
            dark:bg-[#2020226c] dark:border-[#202022]
            md:w-[135px]
            `}
          >
            <Icon
              fill
              name={"circle"}
              size={18}
              color={"#ffffff"}
              className="border rounded-full dark:border-none"
            />

            <span className="font-medium text-sm">Claro</span>
          </button>

          {/* Oscuro */}
          <button
            onClick={() => setTheme("dark")}
            className={`w-28 flex flex-col items-start justify-between gap-2 py-2.5 pl-3 border rounded-xl
            dark:focus-within:shadow-[0_0_3px_3px_#28282b]
            dark:bg-[#2020226c] dark:border-[#202022]
            md:w-[135px]
            `}
          >
            <Icon
              fill
              name={"circle"}
              size={20}
              color={"#000"}
              className={"rounded-3xl dark:border dark:border-gray-900"}
            />

            <span className="font-medium text-sm">Oscuro</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-24 md:gap-44">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm">Lenguaje</span>

          <span className="text-xs font-light">Español</span>
        </div>

        <SelectMenu
          value={1}
          options={[
            { value: 1, label: "Español" },
            { value: 2, label: "Ingles" },
          ]}
        />
      </div>
    </section>
  );
}
