// Hooks
import { useInnerModal } from "../../../hooks/useInnerModal";
// Constantes
import { firstSectionItems } from "../../../constants/asideMenuItems";
// Componentes
import NavItem from "./NavItem";
import Icon from "../../ui/Icon";
// Modales
import MobileMenuModal from "./NavbarMenuModal";

export default function Navbar({ hasRole, avatarOnClick, helpOnClick }) {
  const { innerType, innerTrigger, openInnerModal } = useInnerModal();

  return (
    <section className="relative w-screen flex items-center justify-center gap-10 pb-1 pl-1 pr-2 transition-all duration-700">
      <ul
        className="w-auto h-full flex px-1 gap-0.5 rounded-full border border-[#EBE6E7] bg-white transition-all duration-700 
        dark:bg-black dark:shadow-[1px_1px_1px_4px_#ffffff14]"
      >
        {firstSectionItems
          .filter((item) => hasRole(item.roles))
          .map((item) => (
            <li
              key={item.name}
              className="py-1.5 rounded-full transition-all duration-700"
            >
              <NavItem
                itemId={`${item.itemId}`}
                path={item.path}
                name={item.name}
                icon={item.icon}
              />
            </li>
          ))}
      </ul>

      <button
        id="more-options-aside-button"
        onClick={(e) => openInnerModal("menu", e)}
        className="self-end w-auto h-16 flex flex-col items-center justify-center py-2.5 px-5 rounded-full bg-black cursor-pointer group
        dark:bg-white"
      >
        <Icon
          name={"more_horiz"}
          className="text-white group-hover:text-white dark:text-black dark:group-hover:text-black"
        />
      </button>

      {innerType === "menu" && (
        <MobileMenuModal
          isOpen={true}
          triggerRef={innerTrigger}
          onClose={() => openInnerModal(null)}
          helpOnClick={helpOnClick}
          avatarOnClick={avatarOnClick}
        />
      )}
    </section>
  );
}
