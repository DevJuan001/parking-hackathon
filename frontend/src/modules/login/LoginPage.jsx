import Modal from "../../globals/components/modals/Modal";
import { useModal } from "../../globals/hooks/useModal";
import ErrorModal from "./components/modals/ErrorModal";
import LoginForm from "./components/ui/LoginForm";

export default function LoginPage() {
  const { isOpen, modalType, modalData, triggerRef, openModal, closeModal } =
    useModal();

  return (
    <section className="w-screen h-screen flex items-center justify-center">
      <LoginForm openModal={openModal} />

      {modalType && (
        <Modal
          isOpen={isOpen}
          type={modalType}
          triggerRef={triggerRef}
          title={modalType === "recoverPassword" ? "Recuperar contraseña" : ""}
          location="center"
          onClose={closeModal}
        >
          {modalType === "error" && <ErrorModal onClose={closeModal} />}
        </Modal>
      )}
    </section>
  );
}
