// Hooks
import { useCreateSpot } from "../../hooks/useCreateSpot";
import { useVehicleTypes } from "../../hooks/useVehicleTypes";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Components
import Loader from "../../../../globals/components/ui/Loader";
import FormField from "../../../../globals/components/ui/FormField";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Modals
import ErrorModal from "../../../../globals/components/modals/ErrorModal";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";

export default function CreateSpotModal({ floor, onClose }) {
  const { innerType, innerTrigger, openInnerModal } = useInnerModal();
  const { vehicleTypes } = useVehicleTypes();
  const { handleChange, handleSubmit, spotData, loading, error } =
    useCreateSpot(floor);

  return (
    <form
      onSubmit={(e) => handleSubmit(e, openInnerModal)}
      className="flex flex-col items-center gap-2"
    >
      <SelectMenu
        id={"vehicle-types-menu"}
        name={"vehicle_type_id"}
        spanText={"Tipo de vehículo"}
        value={spotData.vehicle_type_id}
        onChange={handleChange}
        options={vehicleTypes.map((vehicleType) => ({
          value: vehicleType.id,
          label: vehicleType.name,
        }))}
      />

      <FormField
        id={"spot"}
        name={"spot"}
        labelText={"Nombre"}
        value={spotData.spot}
        placeholder={"Nombre de la plaza"}
        onChange={handleChange}
        autoComplete="off"
      />

      <ConfirmCancelButtons
        confirmText={loading ? <Loader /> : "Crear"}
        confirmButtonOnClick={(e) => handleSubmit(e, openInnerModal, onClose)}
        cancelButtonOnClick={onClose}
      />

      {innerType === "error" && (
        <ErrorModal
          triggerRef={innerTrigger}
          isOpen={true}
          location="anchored"
          growDirection={"center"}
          errorTitle="¡No se pudo crear la plaza!"
          errorText={error}
          confirmButtonText="Volver a intentarlo"
          onClose={() => openInnerModal(null)}
        />
      )}
    </form>
  );
}
