// Hooks
import { useState } from "react";
import { useRecoverPassword } from "../../hooks/useRecoverPassword";
// Components
import FormField from "../../../../globals/components/ui/FormField";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Modals
import EmailSentModal from "./EmailSentModal";
import Loader from "../../../../globals/components/ui/Loader";
import Modal from "../../../../globals/components/modals/Modal";

export default function RecoverPasswordModal({ triggerRef, onClose }) {
  const { form, loading, handleChange, handleSubmit } = useRecoverPassword();
  const [innerModal, setInnerModal] = useState(null);

  return (
    <Modal
      isOpen={true}
      triggerRef={triggerRef}
      location="center"
      title={"Recuperar contraseña"}
      onClose={onClose}
    >
      <section className="flex flex-col items-center">
        <FormField
          id={"email"}
          name={"email"}
          labelText={"Email"}
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder={"Escribe tu correo aquí"}
        />

        <ConfirmCancelButtons
          cancelText="Cancelar"
          cancelButtonOnClick={onClose}
          confirmText={loading ? <Loader /> : "Restablecer"}
          confirmButtonOnClick={(e) => handleSubmit(e, setInnerModal)}
        />

        {innerModal === "sentEmail" && (
          <EmailSentModal isOpen={true} onClose={() => setInnerModal(null)} />
        )}
      </section>
    </Modal>
  );
}
