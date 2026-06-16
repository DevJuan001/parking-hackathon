// Hooks
import { useDeleteFloor } from "../../hooks/useDeleteFloor";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Components
import Loader from "../../../../globals/components/ui/Loader";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Modals
import Modal from "../../../../globals/components/modals/Modal";
import ErrorModal from "../../../../globals/components/modals/ErrorModal";

export default function DeleteFloorModal({
  isOpen,
  triggerRef,
  onClose,
  onDeleted,
  floor,
}) {
  const { handleDelete, loading, error } = useDeleteFloor(floor);
  const { innerType, innerTrigger, openInnerModal, closeInnerModal } =
    useInnerModal();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      type={"delete"}
      title={"Eliminar plaza"}
      growDirection="center-right"
      triggerRef={triggerRef}
    >
      <div className="flex flex-col">
        <span>
          Deseas eliminar el <strong>{floor.name}</strong>?
        </span>

        <ConfirmCancelButtons
          itemsPosition="end"
          confirmText={loading ? <Loader /> : "Eliminar"}
          confirmBgColor="#ff0000"
          disabled={loading}
          confirmButtonOnClick={(e) =>
            handleDelete(e, openInnerModal, onDeleted)
          }
          cancelButtonOnClick={onClose}
        />
      </div>

      {innerType === "error" && (
        <ErrorModal
          isOpen={true}
          triggerRef={innerTrigger}
          onClose={closeInnerModal}
          errorText={error}
          errorTitle={"No se pudo eliminar la plaza!"}
        />
      )}
    </Modal>
  );
}
