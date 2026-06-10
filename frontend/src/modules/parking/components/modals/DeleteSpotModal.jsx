// Hooks
import { useDeleteSpot } from "../../hooks/useDeleteSpot";
// Components
import Modal from "../../../../globals/components/modals/Modal";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";

export default function DeleteSpotModal({ isOpen, triggerRef, onClose, spot, onDeleted, onError }) {
  const { handleDelete, loading } = useDeleteSpot(spot);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      type={"delete"}
      title={"Eliminar plaza"}
      growDirection="center"
      triggerRef={triggerRef}
    >
      <div className="flex flex-col">
        <span>
          Deseas eliminar el spot <strong>{spot.spot}</strong> ?
        </span>

        <ConfirmCancelButtons
          confirmText={loading ? "..." : "Eliminar"}
          confirmBgColor="#ff0000"
          disabled={loading}
          confirmButtonOnClick={() => handleDelete(onDeleted, onError)}
          cancelButtonOnClick={onClose}
        />
      </div>
    </Modal>
  );
}
