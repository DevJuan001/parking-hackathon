// Hooks
import { useState } from "react";
import { useRecoverPassword } from "../../hooks/useRecoverPassword";
// Icons
import { loginIcons } from "../../../../assets/icons/loginIcons";
// Components
import FormField from "../../../../globals/components/ui/FormField";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Modals
import EmailSentModal from "./EmailSentModal";
import Loader from "../../../../globals/components/ui/Loader";

export default function RecoverPasswordModal({ onClose }) {
  const { loading, handleChange, handleSubmit } = useRecoverPassword({
    email: "",
  });
  const [innerModal, setInnerModal] = useState(null);
  
  return (
    <section className="flex flex-col items-center">
      <FormField
        id={"email"}
        name={"email"}
        labelText={"Email"}
        onChange={handleChange}
        inputIcon={loginIcons.emailIcon}
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
  );
}
