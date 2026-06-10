// Hooks
import { useDisableUser } from "../../hooks/useDisableUser";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Components
import Loader from "../../../../globals/components/ui/Loader";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Modals
import ErrorModal from "../../../../globals/components/modals/ErrorModal";

export default function DisableUserModal({ onClose, user }) {
  const { innerType, innerTrigger, openInnerModal, closeInnerModal } =
    useInnerModal();
  const { handleDisable, loading, error } = useDisableUser(user);

  return (
    <section className="flex flex-col gap-2">
      <span>
        Deseas deshabilitar al usuario{" "}
        <strong>
          {user.name} {user.first_surname}
        </strong>
        ?
      </span>

      <ConfirmCancelButtons
        confirmText={loading ? <Loader /> : "Deshabilitar"}
        confirmBgColor="#ff0000"
        confirmButtonOnClick={(e) =>
          handleDisable(e, openInnerModal, () => {
            closeInnerModal();
            onClose();
          })
        }
        cancelButtonOnClick={onClose}
      />

      {innerType === "error" && (
        <ErrorModal
          triggerRef={innerTrigger}
          isOpen={true}
          errorTitle="¡No se pudo deshabilitar el usuario!"
          errorText={error}
          confirmButtonText="Volver a intentarlo"
          onClose={() => openInnerModal(null)}
        />
      )}
    </section>
  );
}
