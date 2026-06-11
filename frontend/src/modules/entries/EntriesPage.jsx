// Hooks
import { useModal } from "../../globals/hooks/useModal";
// Constantes
import { modalTitles } from "./constants/modalTitles";
// Componentes
import EntriesKpis from "./components/ui/EntriesKpis";
import EntriesTable from "./components/ui/EntriesTable";
import Layout from "../../globals/components/Layout/Layout";
import TopSection from "../../globals/components/ui/TopSection";
// Modales
import Modal from "../../globals/components/modals/Modal";
import CreateEntryModal from "./components/modals/CreateEntryModal";
import FilterEntriesModal from "./components/modals/FilterEntriesModal";
import { useEntries } from "./hooks/useEntries";

export default function EntriesPage() {
  const { isOpen, modalType, triggerRef, openModal, closeModal } = useModal();
  const { entries, loading, filters, setFilters } = useEntries();

  return (
    <Layout>
      <TopSection
        sectionName={"Ingresos"}
        addButtonText={"Registrar Ingreso"}
        createButtonVisibility={true}
        createOnClick={(e) => openModal(null, "createEntry", e.currentTarget)}
        filterOnClick={(e) => openModal(null, "filter", e.currentTarget)}
      />

      <div className="flex flex-col gap-4">
        <EntriesKpis />

        <EntriesTable entries={entries} loading={loading} />
      </div>

      {modalType && (
        <Modal
          isOpen={isOpen}
          title={modalTitles[modalType]}
          type={modalType}
          onClose={closeModal}
          triggerRef={triggerRef}
          location={modalType === "createEntry" ? "center" : "anchored"}
          growDirection="bottom-center"
        >
          {modalType === "createEntry" && (
            <CreateEntryModal onClose={closeModal} />
          )}

          {modalType === "filter" && (
            <FilterEntriesModal
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
