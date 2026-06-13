// Hooks
import { useModal } from "../../globals/hooks/useModal";
import { useUsers } from "./hooks/useUsers";
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
import FilterUsersModal from "./components/modals/FilterUsersModal";

export default function UsersPage() {
  const { isOpen, modalType, modalData, triggerRef, openModal, closeModal } =
    useModal();
  const { users, loading, filters, setFilters } = useUsers();

  return (
    <Layout>
      <TopSection
        sectionName={"Usuarios"}
        addButtonText={"Crear Usuario"}
        createOnClick={(e) => openModal(null, "createUser", e.currentTarget)}
        filterOnClick={(e) => openModal(null, "filterUsers", e.currentTarget)}
      />

      <div className="flex flex-col gap-4">
        <UsersKpis />

        <UsersTable users={users} loading={loading} openModal={openModal} />
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

          {modalType === "filterUsers" && (
            <FilterUsersModal
              filters={filters}
              setFilters={setFilters}
              onClose={closeModal}
            />
          )}
        </Modal>
      )}
    </Layout>
  );
}
