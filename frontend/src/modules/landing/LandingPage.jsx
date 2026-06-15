// Hooks
import { useModal } from "../../globals/hooks/useModal";
// Componentes
import Hero from "./components/ui/Hero";
import NavBar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import Pricing from "./components/ui/Pricing";
import Features from "./components/ui/Features";
import Questions from "./components/ui/Questions";
import CTASection from "./components/ui/CTASection";
import VideoSection from "./components/ui/VideoSection";
// Modales
import LoginModal from "./components/modals/LoginModal";
import Modal from "../../globals/components/modals/Modal";
import RegisterModal from "./components/modals/RegisterModal";

export default function LandingPage() {
  const { isOpen, modalType, triggerRef, openModal, closeModal } = useModal();

  return (
    <div className="relative mt-5 flex flex-col items-center font-dmsans">
      <NavBar openModal={openModal} />

      <Hero openModal={openModal} />

      <VideoSection />

      <Features />

      <Pricing openModal={openModal} />

      <Questions />

      <CTASection openModal={openModal} />

      <Footer />

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
