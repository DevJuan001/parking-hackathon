// Hooks
import { useDeleteSpot } from "../../hooks/useDeleteSpot";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Components
import Modal from "../../../../globals/components/modals/Modal";
import Loader from "../../../../globals/components/ui/Loader";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Modals
import ErrorModal from "../../../../globals/components/modals/ErrorModal";

export default function DeleteSpotModal({
  isOpen,
  triggerRef,
  onClose,
  onDeleted,
  spot,
}) {
  const { handleDelete, loading, error } = useDeleteSpot(spot);
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
        <span className="text-base">
          Deseas eliminar el spot <strong>{spot.spot}</strong>?
        </span>

        <ConfirmCancelButtons
          itemsPosition="end"
          confirmText={loading ? <Loader /> : "Eliminar"}
          confirmBgColor="#ff0000"
          disabled={loading}
          confirmButtonOnClick={(e) =>
            handleDelete(e, openInnerModal, onDeleted ?? onClose)
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
