// Hooks
import { useModal } from "../../globals/hooks/useModal";
// Constantes
import { modalTitles } from "./constants/modalTitles";
// Componentes
import ExitsKpis from "./components/ui/ExitsKpis";
import ExitsTable from "./components/ui/ExitsTable";
import Layout from "../../globals/components/Layout/Layout";
import TopSection from "../../globals/components/ui/TopSection";
// Modales
import Modal from "../../globals/components/modals/Modal";
import CreateExitModal from "./components/modals/CreateExitModal";
import FilterExitsModal from "./components/modals/FilterExitsModal";
import { useExits } from "./hooks/useExits";

export default function ExitsPage() {
  const { isOpen, modalType, triggerRef, openModal, closeModal } = useModal();
  const { exits, loading, filters, setFilters } = useExits();

  return (
    <Layout>
      <TopSection
        sectionName={"Salidas"}
        addButtonText={"Registrar Salida"}
        createButtonVisibility={true}
        createOnClick={(e) => openModal(null, "createExit", e.currentTarget)}
        filterOnClick={(e) => openModal(null, "filter", e.currentTarget)}
      />

      <div className="flex flex-col gap-4">
        <ExitsKpis />

        <ExitsTable exits={exits} loading={loading} />
      </div>

      {modalType && (
        <Modal
          isOpen={isOpen}
          title={modalTitles[modalType]}
          type={modalType}
          onClose={closeModal}
          triggerRef={triggerRef}
          location={modalType === "createExit" ? "center" : "anchored"}
          growDirection="bottom-center"
        >
          {modalType === "createExit" && (
            <CreateExitModal onClose={closeModal} />
          )}

          {modalType === "filter" && (
            <FilterExitsModal
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
