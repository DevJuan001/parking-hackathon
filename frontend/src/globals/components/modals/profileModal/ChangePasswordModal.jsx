// Hooks
import { useInnerModal } from "../../../hooks/useInnerModal";
import { useUpdateCurrentUserPassword } from "../../../hooks/useUpdateCurrentUserPassword";
// Components
import Icon from "../../ui/Icon";
import Loader from "../../ui/Loader";
import FormField from "../../ui/FormField";
import ConfirmCancelButtons from "../ConfirmCancelButtons";
// Modals
import Modal from "../Modal";
import ErrorModal from "../ErrorModal";
import SuccessModal from "../SuccessModal";

export default function ChangePasswordModal({ isOpen, onClose, triggerRef }) {
  const { innerType, innerTrigger, openInnerModal } = useInnerModal();
  const {
    handleChange,
    handleSubmit,
    passwordData,
    passwordsMatch,
    loading,
    showPasswords,
    togglePassword,
    fieldError,
  } = useUpdateCurrentUserPassword();

  return (
    <Modal
      z_index="300"
      title={"Cambiar contraseña"}
      isOpen={isOpen}
      type="innerModal"
      onClose={onClose}
      location="center"
      triggerRef={triggerRef}
    >
      <section className="flex flex-col items-center w-full gap-2">
        <FormField
          id={"old_password"}
          type={showPasswords.old ? "text" : "password"}
          name="old_password"
          labelText={"Contraseña actual"}
          onChange={handleChange}
          className={fieldError("old_password")}
        >
          <button type="button" onClick={() => togglePassword("old")}>
            <Icon name={showPasswords.old ? "visibility_off" : "visibility"} />
          </button>
        </FormField>

        <FormField
          id={"new_password"}
          type={showPasswords.new ? "text" : "password"}
          name="new_password"
          labelText={"Nueva contraseña"}
          onChange={handleChange}
          className={fieldError("new_password")}
        >
          <button type="button" onClick={() => togglePassword("new")}>
            <Icon name={showPasswords.new ? "visibility_off" : "visibility"} />
          </button>
        </FormField>

        <FormField
          id={"repeat_password"}
          type={showPasswords.repeat ? "text" : "password"}
          name="repeat_password"
          labelText={"Repita la nueva contraseña"}
          onChange={handleChange}
          className={fieldError("repeat_password")}
        >
          <button type="button" onClick={() => togglePassword("repeat")}>
            <Icon
              name={showPasswords.repeat ? "visibility_off" : "visibility"}
            />
          </button>
        </FormField>

        {!passwordsMatch && passwordData.repeat_password && (
          <span className="text-sm text-red-700">
            Las contraseñas no coinciden
          </span>
        )}

        <ConfirmCancelButtons
          confirmText={loading ? <Loader /> : "Cambiar"}
          confirmButtonOnClick={(e) => handleSubmit(e, openInnerModal)}
          cancelButtonOnClick={onClose}
          disabled={!passwordsMatch}
        />
        {innerType === "success" && (
          <SuccessModal
            triggerRef={innerTrigger}
            isOpen={true}
            confirmTitle={"Contraseña actualizada con exito"}
            confirmText={"Su contraseña ha sido actualizada con exito"}
            onClose={onClose}
          />
        )}
        {innerType === "error" && (
          <ErrorModal
            triggerRef={innerTrigger}
            isOpen={true}
            errorTitle={"No se pudo actualizar su contraseña!"}
            errorText={
              "Verifique que su contraseña anterior sea la correcta y vuelva a intentarlo"
            }
            confirmButtonText={"Volver a intentarlo"}
            onClose={() => openInnerModal(null)}
          />
        )}
      </section>
    </Modal>
  );
}
