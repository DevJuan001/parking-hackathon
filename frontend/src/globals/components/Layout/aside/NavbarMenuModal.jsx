import Icon from "../../ui/Icon";
import NavItem from "./NavItem";
import Modal from "../../modals/Modal";
import {
  avatarItem,
  secondSectionItems,
} from "../../../constants/asideMenuItems";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

export default function NavbarMenuModal({
  isOpen,
  triggerRef,
  onClose,
  helpOnClick,
  avatarOnClick,
}) {
  const { user } = useCurrentUser();

  return (
    <Modal
      isOpen={isOpen}
      type={"menu"}
      onClose={onClose}
      triggerRef={triggerRef}
    >
      <button
        onClick={avatarOnClick}
        className="w-full h-full flex items-center py-2.5 px-4 gap-2.5 rounded-3xl transition duration-300 text-[#75777eb7]
        hover:bg-[#e5e7eb96]
        dark:text-[#7E8088] dark:hover:bg-[#181818]"
      >
        <img src={avatarItem.icon} alt={avatarItem.alt} className="w-8 h-8" />
        <span>
          {user.name} {user.first_surname}
        </span>
      </button>

      {secondSectionItems.map((item) =>
        item.path ? (
          <NavItem
            showName={true}
            itemId={`${item.itemId}`}
            key={item.name}
            path={item.path}
            name={item.name}
            icon={item.icon}
          />
        ) : (
          <button
            key={item.name}
            onClick={helpOnClick}
            className="w-full h-full flex items-center py-4 px-6 gap-2 rounded-full transition duration-300 cursor-pointer group text-[#75777eb7]
            hover:cursor-pointer
            hover:bg-[#e5e7eb96] 
            dark:text-gray-50 dark:hover:bg-[#202022]"
          >
            <Icon
              name={item.icon}
              size={25}
              className={`fill-none
                group-hover:text-black group-hover:[--icon-weight:500]
                dark:group-hover:text-white`}
            />

            <span className="font-medium group-hover:text-black dark:group-hover:text-white">
              {item.name}
            </span>
          </button>
        ),
      )}
    </Modal>
  );
}
