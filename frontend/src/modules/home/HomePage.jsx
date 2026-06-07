// Hooks
import { useModal } from "../../globals/hooks/useModal";
// Components
import Layout from "../../globals/components/Layout/Layout";
import HomeSectionsContainer from "./components/ui/HomeSectionsContainer";

export default function HomePage() {
  const { isOpen, modalType, modalData, triggerRef, openModal, closeModal } =
    useModal();

  return (
    <Layout avatarOnClick={(e) => openModal(null, "avatar", e.currentTarget)}>
      <HomeSectionsContainer />
    </Layout>
  );
}
