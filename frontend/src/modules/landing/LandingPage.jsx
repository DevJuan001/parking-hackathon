// Hooks
import { useModal } from "../../globals/hooks/useModal";
// Componentes
import Hero from "./components/ui/Hero";
import NavBar from "./components/ui/Navbar";
import Pricing from "./components/ui/Pricing";
// Modales
import LoginModal from "./components/modals/LoginModal";
import Modal from "../../globals/components/modals/Modal";
import RegisterModal from "./components/modals/RegisterModal";

export default function LandingPage() {
  const { isOpen, modalType, triggerRef, openModal, closeModal } = useModal();

  return (
    <div className="relative flex flex-col items-center font-dmsans">
      <NavBar openModal={openModal} />

      <Hero openModal={openModal} />

      <Pricing />

      {modalType && (
        <Modal
          isOpen={isOpen}
          type={modalType}
          triggerRef={triggerRef}
          location="center"
          onClose={closeModal}
        >
          {modalType === "logIn" && <LoginModal />}

          {modalType === "register" && <RegisterModal />}
        </Modal>
      )}
    </div>
  );
}
