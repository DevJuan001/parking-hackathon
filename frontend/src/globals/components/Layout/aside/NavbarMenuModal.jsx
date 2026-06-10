// Hooks
import { useInnerModal } from "../../../hooks/useInnerModal";
// Constants
import { secondSectionItems } from "../../../constants/asideMenuItems";
// Components
import NavItem from "./NavItem";
import AvatarButton from "./AvatarButton";
// Modals
import Modal from "../../modals/Modal";
import ProfileModal from "../../modals/profileModal/ProfileModal";

export default function NavbarMenuModal({ isOpen, triggerRef, onClose }) {
  const { innerType, innerTrigger, openInnerModal, closeInnerModal } =
    useInnerModal();

  return (
    <Modal
      isOpen={isOpen}
      type={"menu"}
      onClose={onClose}
      triggerRef={triggerRef}
    >
      <AvatarButton avatarOnClick={(e) => openInnerModal("user", e)} />

      {secondSectionItems.map((item) => (
        <NavItem
          showName={true}
          itemId={`${item.itemId}`}
          key={item.name}
          path={item.path}
          name={item.name}
          icon={item.icon}
        />
      ))}

      {innerType === "user" && (
        <ProfileModal triggerRef={innerTrigger} onClose={closeInnerModal} />
      )}
    </Modal>
  );
}
