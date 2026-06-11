// Hooks
import { useUpdateSpot } from "../../hooks/useUpdateSpot";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Components
import Loader from "../../../../globals/components/ui/Loader";
import FormField from "../../../../globals/components/ui/FormField";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Constants
import { placeStatus } from "../../constants/spotStatus";
// Modals
import ErrorModal from "../../../../globals/components/modals/ErrorModal";
import SuccessModal from "../../../../globals/components/modals/SuccessModal";
import ModalHighSection from "../../../../globals/components/modals/ModalHighSection";
import DeleteSpotModal from "./DeleteSpotModal";

export default function EditSpotModal({ onClose, spot }) {
  const { innerType, innerTrigger, openInnerModal, closeInnerModal } =
    useInnerModal();
  const { handleChange, handleSubmit, spotData, loading, error } =
    useUpdateSpot(spot);

  return (
    <section className="flex flex-col items-center gap-2">
      <ModalHighSection
        icon={"garage"}
        text={spot.spot}
        closeButtonOnClick={onClose}
        deleteButtonOnClick={(e) => openInnerModal("delete", e)}
      />

      <FormField
        id={"spot"}
        name={"spot"}
        labelText={"Nombre"}
        value={spotData.spot}
        onChange={handleChange}
        autoComplete="off"
      />

      <SelectMenu
        id={"spot_status"}
        spanText={"Estado"}
        name={"spot_status"}
        value={spotData.spot_status}
        onChange={handleChange}
        options={Object.entries(placeStatus).map(([index, value]) => ({
          value: index,
          label: value.text,
        }))}
      />

      <ConfirmCancelButtons
        confirmText={loading ? <Loader /> : "Guardar"}
        confirmButtonOnClick={(e) => handleSubmit(e, openInnerModal, onClose)}
        cancelButtonOnClick={onClose}
      />

      {innerType === "success" && (
        <SuccessModal
          triggerRef={innerTrigger}
          isOpen={true}
          confirmTitle={"Plaza editada con éxito!"}
          confirmText={
            "La plaza se ha editado correctamente, toca el botón de volver a la pagina para verlo"
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
          errorTitle="¡No se pudo editar la plaza!"
          errorText={error}
          confirmButtonText="Volver a intentarlo"
          onClose={() => openInnerModal(null)}
        />
      )}

      {innerType === "delete" && (
        <DeleteSpotModal
          isOpen={true}
          spot={spot}
          triggerRef={innerTrigger}
          onClose={closeInnerModal}
          onDeleted={() => {
            closeInnerModal();
            onClose();
          }}
        />
      )}
    </section>
  );
}
