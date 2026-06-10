// Hooks
import { useUpdateFloor } from "../../hooks/useUpdateFloor";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Components
import Loader from "../../../../globals/components/ui/Loader";
import FormField from "../../../../globals/components/ui/FormField";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Modals
import ErrorModal from "../../../../globals/components/modals/ErrorModal";
import SuccessModal from "../../../../globals/components/modals/SuccessModal";

export default function EditFloorModal({ onClose, floor }) {
  const { innerType, innerTrigger, openInnerModal } = useInnerModal();
  const { handleChange, handleSubmit, floorData, loading } = useUpdateFloor(floor);

  return (
    <section className="flex flex-col items-center gap-2">
      <FormField
        id={"floor_number"}
        name={"floor_number"}
        labelText={"Número de piso"}
        type="number"
        value={floorData.floor_number}
        onChange={handleChange}
        autoComplete="off"
      />

      <ConfirmCancelButtons
        confirmText={loading ? <Loader /> : "Guardar"}
        confirmButtonOnClick={(e) => handleSubmit(e, openInnerModal)}
        cancelButtonOnClick={onClose}
      />

      {innerType === "success" && (
        <SuccessModal
          triggerRef={innerTrigger}
          isOpen={true}
          confirmTitle={"Piso editado con éxito!"}
          confirmText={
            "El piso se ha editado correctamente, toca el botón de volver a la pagina para verlo"
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
          errorTitle="¡No se pudo editar el piso!"
          errorText="Verifica que el número sea válido y vuelve a intentarlo"
          confirmButtonText="Volver a intentarlo"
          onClose={() => openInnerModal(null)}
        />
      )}
    </section>
  );
}
