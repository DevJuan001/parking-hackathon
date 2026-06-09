// Hooks
import { useModal } from "../../globals/hooks/useModal";
// Components
import Layout from "../../globals/components/Layout/Layout";
import HomeSectionsContainer from "./components/ui/HomeSectionsContainer";
import Modal from "../../globals/components/modals/Modal";
// Modals
import EditSpotModal from "./components/modals/EditSpotModal";
import CreateSpotModal from "./components/modals/CreateSpotModal";

export default function HomePage() {
  const { isOpen, modalType, modalData, triggerRef, openModal, closeModal } =
    useModal();

  return (
    <Layout avatarOnClick={(e) => openModal(null, "avatar", e.currentTarget)}>
      <HomeSectionsContainer openModal={openModal} />

      {modalType && (
        <Modal
          isOpen={isOpen}
          title={
            modalType === "edit"
              ? "Editar Plaza"
              : modalType === "create"
                ? "Agregar Plaza"
                : ""
          }
          onClose={closeModal}
          location="anchored"
          growDirection="center"
          triggerRef={triggerRef}
        >
          {modalType === "edit" && (
            <EditSpotModal onClose={closeModal} spot={modalData} />
          )}

          {modalType === "create" && <CreateSpotModal onClose={closeModal} />}
        </Modal>
      )}
    </Layout>
  );
}
