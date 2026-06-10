// Hooks
import { useCreateEntry } from "../../hooks/useCreateEntry";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Components
import Loader from "../../../../globals/components/ui/Loader";
import FormField from "../../../../globals/components/ui/FormField";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Modals
import ErrorModal from "../../../../globals/components/modals/ErrorModal";
import SuccessModal from "../../../../globals/components/modals/SuccessModal";

export default function CreateEntryModal({ onClose }) {
  const { innerType, innerTrigger, openInnerModal } = useInnerModal();
  const { handleChange, handleSubmit, form, loading, error } = useCreateEntry();

  return (
    <section className="flex flex-col items-center gap-2">
      <FormField
        id={"plate"}
        name={"plate"}
        labelText={"Placa"}
        value={form.plate}
        onChange={handleChange}
        autoComplete="off"
      />

      <ConfirmCancelButtons
        confirmText={loading ? <Loader /> : "Registrar"}
        confirmButtonOnClick={(e) => handleSubmit(e, openInnerModal)}
        cancelButtonOnClick={onClose}
      />

      {innerType === "success" && (
        <SuccessModal
          triggerRef={innerTrigger}
          isOpen={true}
          confirmTitle={"Ingreso registrado con éxito!"}
          confirmText={
            "El ingreso se ha registrado correctamente, toca el botón de volver a la pagina para verlo"
          }
          confirmButtonText={"Volver a la pagina"}
          onClose={() => {
            openInnerModal(null);
            onClose();
          }}
        />
      )}

      {innerType === "error" && (
        <ErrorModal
          triggerRef={innerTrigger}
          isOpen={true}
          errorTitle="¡No se pudo registrar el ingreso!"
          errorText={error}
          confirmButtonText="Volver a intentarlo"
          onClose={() => openInnerModal(null)}
        />
      )}
    </section>
  );
}
