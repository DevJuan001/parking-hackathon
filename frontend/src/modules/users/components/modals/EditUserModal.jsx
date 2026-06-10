// Hooks
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { useInnerModal } from "../../../../globals/hooks/useInnerModal";
import { useRoles } from "../../hooks/useRoles";
// Components
import Loader from "../../../../globals/components/ui/Loader";
import FormField from "../../../../globals/components/ui/FormField";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";
import ConfirmCancelButtons from "../../../../globals/components/modals/ConfirmCancelButtons";
// Modals
import ErrorModal from "../../../../globals/components/modals/ErrorModal";
import SuccessModal from "../../../../globals/components/modals/SuccessModal";

export default function EditUserModal({ onClose, user }) {
  const { innerType, innerTrigger, openInnerModal } = useInnerModal();
  const { handleChange, handleSubmit, form, loading, error } =
    useUpdateUser(user);
  const { roles } = useRoles();

  return (
    <section className="flex flex-col items-center gap-2">
      <SelectMenu
        id={"role-menu"}
        name={"role_id"}
        spanText={"Rol"}
        value={form.role_id}
        onChange={handleChange}
        options={roles.map((role) => ({
          value: role.id,
          label: role.name,
        }))}
      />

      <FormField
        id={"name"}
        name={"name"}
        labelText={"Nombre"}
        value={form.name}
        onChange={handleChange}
        autoComplete="off"
      />

      <FormField
        id={"first_surname"}
        name={"first_surname"}
        labelText={"Primer Apellido"}
        value={form.first_surname}
        onChange={handleChange}
        autoComplete="off"
      />

      <FormField
        id={"second_surname"}
        name={"second_surname"}
        labelText={"Segundo Apellido"}
        value={form.second_surname}
        onChange={handleChange}
        autoComplete="off"
      />

      <FormField
        id={"email"}
        name={"email"}
        labelText={"Correo electronico"}
        value={form.email}
        onChange={handleChange}
        autoComplete="off"
      />

      <SelectMenu
        id={"status-menu"}
        name={"status"}
        spanText={"Estado"}
        value={form.status}
        onChange={handleChange}
        options={[
          { value: 1, label: "Deshabilitado" },
          { value: 2, label: "Activo" },
        ]}
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
          confirmTitle={"Usuario editado con éxito!"}
          confirmText={
            "El usuario se ha editado correctamente, toca el botón de volver a la pagina para verlo"
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
          errorTitle="¡No se pudo editar el usuario!"
          errorText={error}
          confirmButtonText="Volver a intentarlo"
          onClose={() => openInnerModal(null)}
        />
      )}
    </section>
  );
}
