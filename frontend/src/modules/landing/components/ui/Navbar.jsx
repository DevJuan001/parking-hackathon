import Icon from "../../../../../../../Portfolio/src/components/Icon";
import { useScrolled } from "../../../../globals/hooks/useScrolled";

export default function NavBar({ openModal }) {
  const { scrolled } = useScrolled();

  return (
    <nav
      className={`h-[60px] sticky z-10 top-5 flex items-center justify-between px-3 py-2 rounded-full bg-[#ffffff99] transition-all duration-500
        dark:bg-[#00000099]
        ${
          scrolled
            ? `shadow-[0px_0px_0.1px_0.1px_#00000099] backdrop-blur-sm md:w-3xl
              dark:shadow-[0px_0px_1px_0.2px_#ffffff48]`
            : `border-transparent md:w-5xl`
        }`}
    >
      <a
        href="/#"
        className="flex items-center gap-2 px-5 py-2 rounded-3xl outline-0 transition-colors duration-300 group
        hover:bg-gray-200
        dark:hover:bg-[#202022] dark:text-white"
      >
        <Icon
          name={"parking_sign"}
          fill
          size={28}
          className={"group-hover:scale-105"}
        />

        <span className="font-semibold text-lg">Parking</span>
      </a>

      <ul className="flex gap-2 text-[#7E8088]">
        <a
          href="/#features"
          className={`px-4 py-2 rounded-3xl transition-all duration-300
          hover:bg-gray-200 hover:text-black hover:font-semibold
          dark:hover:bg-[#202022] dark:hover:text-white`}
        >
          Características
        </a>

        <a
          href="/#pricing"
          className={`px-4 py-2 rounded-3xl transition-all duration-300
          hover:bg-gray-200 hover:text-black hover:font-semibold
          dark:hover:bg-[#202022] dark:hover:text-white`}
        >
          Precios
        </a>

        <a
          href="/#contact"
          className={`px-4 py-2 rounded-3xl transition-all duration-300
          hover:bg-gray-200 hover:text-black hover:font-semibold
          dark:hover:bg-[#202022] dark:hover:text-white`}
        >
          Contacto
        </a>
      </ul>

      <button
        onClick={(e) => openModal(null, "logIn", e.currentTarget)}
        className="px-5 py-2 border border-[#e5e7eb] font-semibold rounded-3xl transition-colors duration-300
        hover:bg-black hover:text-white
        dark:text-[#758088] dark:border-[#202222] dark:hover:bg-[#202022]"
      >
        Iniciar sesión
      </button>
    </nav>
  );
}
