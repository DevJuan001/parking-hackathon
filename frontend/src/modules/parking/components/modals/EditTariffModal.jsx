// Hooks
import { useUpdateTariff } from "../../hooks/useUpdateTariff";
import { useVehicleTypes } from "../../hooks/useVehicleTypes";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
// Constants
import { vehicleTypesConstant } from "../../../../globals/constants/vehicleTypes";
// Components
import Loader from "../../../../globals/components/ui/Loader";
import FormField from "../../../../globals/components/ui/FormField";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Modals
import ErrorModal from "../../../../globals/components/modals/ErrorModal";
import SuccessModal from "../../../../globals/components/modals/SuccessModal";
import ModalHighSection from "../../../../globals/components/modals/ModalHighSection";

export default function EditTariffModal({ onClose, tariff }) {
  const { innerType, innerTrigger, openInnerModal } = useInnerModal();
  const { vehicleTypes } = useVehicleTypes();
  const { handleChange, handleSubmit, tariffData, loading, error } =
    useUpdateTariff(tariff);

  return (
    <section className="flex flex-col items-center gap-2">
      <ModalHighSection
        icon={"payments"}
        text={vehicleTypesConstant[tariffData.vehicle_type]?.text}
        closeButtonOnClick={onClose}
        deleteButtonOnClick={onClose}
      />

      <SelectMenu
        id={"vehicle_type"}
        spanText={"Tipo de vehículo"}
        name={"vehicle_type"}
        value={tariffData.vehicle_type}
        onChange={handleChange}
        options={vehicleTypes.map((vehicleType) => ({
          value: vehicleType.id,
          label: vehicleType.name,
        }))}
      />

      <FormField
        id={"value"}
        name={"value"}
        labelText={"Valor"}
        type="number"
        value={tariffData.value}
        onChange={handleChange}
        autoComplete="off"
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
          confirmTitle={"Tarifa editada con éxito!"}
          confirmText={
            "La tarifa se ha editado correctamente, toca el botón de volver a la pagina para verla"
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
          errorTitle="¡No se pudo editar la tarifa!"
          errorText={error}
          confirmButtonText="Volver a intentarlo"
          onClose={() => openInnerModal(null)}
        />
      )}
    </section>
  );
}
