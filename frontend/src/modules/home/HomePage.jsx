// Hooks
import { useModal } from "../../globals/hooks/useModal";
// Components
import Layout from "../../globals/components/Layout/Layout";

export default function HomePage() {
  const { isOpen, modalType, modalData, triggerRef, openModal, closeModal } =
    useModal();

  return (
    <Layout avatarOnClick={(e) => openModal(null, "avatar", e.currentTarget)}>
      <div className="dark:text-white"></div>
    </Layout>
  );
}
