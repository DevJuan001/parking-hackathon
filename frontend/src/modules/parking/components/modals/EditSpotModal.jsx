// Hooks
import { useUpdateSpot } from "../../hooks/useUpdateSpot";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Components
import Loader from "../../../../globals/components/ui/Loader";
import FormField from "../../../../globals/components/ui/FormField";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Modals
import ErrorModal from "../../../../globals/components/modals/ErrorModal";
import SuccessModal from "../../../../globals/components/modals/SuccessModal";
import { placeStatus } from "../../constants/spotStatus";

export default function EditSpotModal({ onClose, spot }) {
  const { innerType, innerTrigger, openInnerModal } = useInnerModal();
  const { handleChange, handleSubmit, spotData, loading } = useUpdateSpot(spot);

  return (
    <section className="flex flex-col items-center gap-2">
      <FormField
        id={"spot"}
        name={"spot"}
        labelText={"Plaza"}
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
        confirmButtonOnClick={(e) => handleSubmit(e, openInnerModal)}
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
          errorText="Verifica que los datos sean correctos y vuelve a intentarlo"
          confirmButtonText="Volver a intentarlo"
          onClose={() => openInnerModal(null)}
        />
      )}
    </section>
  );
}
