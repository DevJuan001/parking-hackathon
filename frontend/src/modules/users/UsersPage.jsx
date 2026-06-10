// Hooks
import { useModal } from "../../globals/hooks/useModal";
// Constantes
import { modalTitles } from "./constants/modalTitles";
// Componentes
import UsersKpis from "./components/ui/UsersKpis";
import UsersTable from "./components/ui/UsersTable";
import Layout from "../../globals/components/Layout/Layout";
import TopSection from "../../globals/components/ui/TopSection";
// Modales
import Modal from "../../globals/components/modals/Modal";
import EditUserModal from "./components/modals/EditUserModal";
import CreateUserModal from "./components/modals/CreateUserModal";
import EnableUserModal from "./components/modals/EnableUserModal";
import DisableUserModal from "./components/modals/DisableUserModal";

export default function UsersPage() {
  const { isOpen, modalType, modalData, triggerRef, openModal, closeModal } =
    useModal();

  return (
    <Layout>
      <TopSection
        sectionName={"Usuarios"}
        addButtonText={"Crear Usuario"}
        createButtonVisibility={true}
        createOnClick={(e) => openModal(null, "createUser", e.currentTarget)}
        filterOnClick={(e) => openModal(null, "filterUsers", e.currentTarget)}
      />

      <div className="flex flex-col gap-4">
        <UsersKpis />

        <UsersTable openModal={openModal} />
      </div>

      {modalType && (
        <Modal
          isOpen={isOpen}
          title={modalTitles[modalType]}
          type={modalType}
          onClose={closeModal}
          triggerRef={triggerRef}
          location={modalType === "createUser" ? "center" : "anchored"}
          growDirection={modalType === "editUser" ? "center" : "bottom-center"}
        >
          {modalType === "createUser" && (
            <CreateUserModal onClose={closeModal} />
          )}

          {modalType === "editUser" && (
            <EditUserModal user={modalData} onClose={closeModal} />
          )}

          {modalType === "disableUser" && (
            <DisableUserModal user={modalData} onClose={closeModal} />
          )}

          {modalType === "enableUser" && (
            <EnableUserModal user={modalData} onClose={closeModal} />
          )}
        </Modal>
      )}
    </Layout>
  );
}
