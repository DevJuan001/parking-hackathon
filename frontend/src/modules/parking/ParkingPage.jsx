// Hooks
import { useModal } from "../../globals/hooks/useModal";
// Constants
import { modalTitles } from "./constants/modalTitles";
// Components
import Modal from "../../globals/components/modals/Modal";
import Layout from "../../globals/components/Layout/Layout";
import ParkingSectionsContainer from "./components/ui/ParkingSectionsContainer";
// Modals
import EditSpotModal from "./components/modals/EditSpotModal";
import EditFloorModal from "./components/modals/EditFloorModal";
import EditTariffModal from "./components/modals/EditTariffModal";
import CreateSpotModal from "./components/modals/CreateSpotModal";
import CreateFloorModal from "./components/modals/CreateFloorModal";
import CreateTariffModal from "./components/modals/CreateTariffModal";

export default function ParkingPage() {
  const { isOpen, modalType, modalData, triggerRef, openModal, closeModal } =
    useModal();

  return (
    <Layout avatarOnClick={(e) => openModal(null, "avatar", e.currentTarget)}>
      <ParkingSectionsContainer openModal={openModal} />

      {modalType && (
        <Modal
          isOpen={isOpen}
          type={modalType}
          title={modalTitles[modalType] ?? ""}
          onClose={closeModal}
          location="anchored"
          growDirection="center"
          triggerRef={triggerRef}
        >
          {modalType === "editSpot" && (
            <EditSpotModal onClose={closeModal} spot={modalData} />
          )}

          {modalType === "createSpot" && (
            <CreateSpotModal floor={modalData} onClose={closeModal} />
          )}

          {modalType === "editFloor" && (
            <EditFloorModal onClose={closeModal} floor={modalData} />
          )}

          {modalType === "createFloor" && (
            <CreateFloorModal onClose={closeModal} />
          )}

          {modalType === "editTariff" && (
            <EditTariffModal onClose={closeModal} tariff={modalData} />
          )}

          {modalType === "createTariff" && (
            <CreateTariffModal onClose={closeModal} />
          )}
        </Modal>
      )}
    </Layout>
  );
}
