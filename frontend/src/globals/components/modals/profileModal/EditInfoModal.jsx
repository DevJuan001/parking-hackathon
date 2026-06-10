//Hooks
import { useInnerModal } from "../../../hooks/useInnerModal";
import { useUpdateCurrentUserInfo } from "../../../hooks/useUpdateCurrentUserInfo";
// Components
import Loader from "../../ui/Loader";
import FormField from "../../ui/FormField";
import ConfirmCancelButtons from "../ConfirmCancelButtons";
// Modals
import Modal from "../Modal";
import ErrorModal from "../ErrorModal";

export default function EditInfoModal({ isOpen, onClose, user, triggerRef }) {
  const { innerType, innerTrigger, openInnerModal } = useInnerModal();
  const { handleChange, handleSubmit, userData, loading } =
    useUpdateCurrentUserInfo(user);

  return (
    <Modal
      z_index="300"
      title={"Editar información"}
      isOpen={isOpen}
      type="innerModal"
      location="center"
      onClose={onClose}
      triggerRef={triggerRef}
    >
      <section className="flex flex-col items-center gap-2">
        <FormField
          id={"name"}
          name={"name"}
          labelText={"Nombre"}
          value={userData.name}
          onChange={handleChange}
          autoComplete="given-name"
        />

        <FormField
          id={"first_surname"}
          name={"first_surname"}
          labelText={"Primer Apellido"}
          value={userData.first_surname}
          onChange={handleChange}
          autoComplete="family-name"
        />

        <FormField
          id={"second_surname"}
          name={"second_surname"}
          labelText={"Segundo Apellido"}
          value={userData.second_surname}
          onChange={handleChange}
          autoComplete="family-name"
        />

        <FormField
          id={"email"}
          name={"email"}
          labelText={"Correo eléctronico"}
          value={userData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <ConfirmCancelButtons
          confirmText={loading ? <Loader /> : "Editar"}
          confirmButtonOnClick={(e) => handleSubmit(e, openInnerModal, onClose)}
          cancelButtonOnClick={onClose}
        />
      </section>

      {innerType === "error" && (
        <ErrorModal
          triggerRef={innerTrigger}
          isOpen={true}
          errorTitle="¡No se pudo completar el registro!"
          errorText="Verfica que todos los campos esten completos y que el correo electronico es el correcto"
          confirmButtonText="Volver a intentarlo"
          onClose={() => openInnerModal(null)}
        />
      )}
    </Modal>
  );
}
