# Modals

The codebase uses one `<Modal>` component (`src/globals/components/modals/Modal.jsx`) with three layout modes: `anchored`, `center`, and corner/edge locations. There are **two complementary patterns** for how a page's modal system is structured.

## Pattern A — Page owns the outer modal (preferred for grid / list views)

The page (`HomePage.jsx`) manages modal state with `useModal`, renders **one** anchored `<Modal>`, and branches on `modalType` to show the right child. The child is just a form section, not a `<Modal>` wrapper. Only the success/error feedback opens a sub-modal via `useInnerModal`.

```jsx
// src/modules/home/HomePage.jsx
const { isOpen, modalType, modalData, triggerRef, openModal, closeModal } = useModal();

return (
  <Layout avatarOnClick={(e) => openModal(null, "avatar", e.currentTarget)}>
    <HomeSectionsContainer openModal={openModal} />

    {modalType && (
      <Modal
        isOpen={isOpen}
        title={
          modalType === "edit"
            ? "Editar Plaza"
            : modalType === "create"
              ? "Agregar Plaza"
              : ""
        }
        onClose={closeModal}
        location="anchored"
        growDirection="center"
        triggerRef={triggerRef}
      >
        {modalType === "edit" && (
          <EditSpotModal onClose={closeModal} spot={modalData} />
        )}

        {modalType === "create" && <CreateSpotModal onClose={closeModal} />}
      </Modal>
    )}
  </Layout>
);
```

Conventions for this pattern:
- **Title lives on the outer `<Modal>`**, computed inline from `modalType`. Don't pass it to the child.
- **`growDirection="center"`** for modals triggered from grid cells (edit / create).
- **Single `openModal` prop** is passed down to children (not separate `onEdit` / `onCreate` callbacks). Children decide which `modalType` to open.
- **Children are plain sections, not `<Modal>` wrappers.** They don't receive `isOpen` or `triggerRef` — they always render as if open, because their parent only renders them when their type matches.
- Children do still need to call `useInnerModal` for their success/error feedback.
- The `triggerRef` from `useModal` is the trigger button rect. The outer `<Modal>` uses it to FLIP-animate from the trigger up to the form. The success/error modals (opened by the child's `useInnerModal`) use the confirm-button rect so they FLIP from the confirm button.

### Child modal (in this pattern)

```jsx
// src/modules/home/components/modals/EditSpotModal.jsx
import { useInnerModal } from "../../../globals/hooks/useInnerModal";
import { useUpdateSpot } from "../../hooks/useUpdateSpot";
import Loader from "../../../globals/components/ui/Loader";
import FormField from "../../../globals/components/ui/FormField";
import SelectMenu from "../../../globals/components/modals/SelectMenu";
import ConfirmCancelButtons from "../../../globals/components/modals/ConfirmCancelButtons";
import ErrorModal from "../../../globals/components/modals/ErrorModal";
import SuccessModal from "../../../globals/components/modals/SuccessModal";
import { placeStatusOptions } from "../../constants/placeStatus";

export default function EditSpotModal({ onClose, spot }) {
  const { innerType, innerTrigger, openInnerModal } = useInnerModal();
  const { handleChange, handleSubmit, spotData, loading } = useUpdateSpot(spot);

  return (
    <section className="flex flex-col items-center gap-2">
      <FormField
        id="spot"
        name="spot"
        labelText="Plaza"
        value={spotData.spot}
        onChange={handleChange}
        autoComplete="off"
      />
      <SelectMenu
        id="spot_status"
        spanText="Estado"
        name="spot_status"
        value={spotData.spot_status}
        onChange={handleChange}
        options={placeStatusOptions}
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
          confirmTitle="¡Plaza editada con éxito!"
          confirmText="La plaza se ha editado correctamente, toca el botón de volver a la pagina para verlo."
          confirmButtonText="Volver a la pagina"
          onClose={() => { openInnerModal(null); onClose(); }}
        />
      )}

      {innerType === "error" && (
        <ErrorModal
          triggerRef={innerTrigger}
          isOpen={true}
          errorTitle="¡No se pudo editar la plaza!"
          errorText="Verifica que los datos sean correctos y vuelve a intentarlo."
          confirmButtonText="Volver a intentarlo"
          onClose={() => openInnerModal(null)}
        />
      )}
    </section>
  );
}
```

## Pattern B — Self-contained modal (used in `ProfileModal`)

`EditInfoModal` / `ChangePasswordModal` open their **own** `<Modal type="innerModal" location="center" z_index="300">` and live entirely inside it. Used when the parent modal (`ProfileModal`) is itself a container with its own state, and the children are full screens that need to be centered.

```jsx
// src/globals/components/modals/profileModal/ProfileModal.jsx (excerpt)
<Modal isOpen={true} type="user" title="Configuración" location="center" triggerRef={innerTrigger} onClose={closeInnerModal}>
  ...
  {innerType === "editInfo" && (
    <EditInfoModal user={user} triggerRef={innerTrigger} isOpen={true} onClose={() => openInnerModal(null)} />
  )}
  {innerType === "changePassword" && (
    <ChangePasswordModal triggerRef={innerTrigger} isOpen={true} onClose={() => openInnerModal(null)} />
  )}
</Modal>
```

The self-contained child opens its own inner `<Modal>` and renders its form + success/error inside it. See `src/globals/components/modals/profileModal/EditInfoModal.jsx` for the canonical example.

## Which pattern to pick

- **Pattern A** when the page has a list/grid and each item triggers a modal — keeps the FLIP animation clean (one hop) and avoids stacking modals visually.
- **Pattern B** when the parent is already a settings-style container (e.g. `ProfileModal`) and the child is a focused form that takes over the full modal surface.

## When the page itself is the outer shell

If the page has no anchored trigger (e.g. a settings page opened from a sidebar), skip the outer `<Modal>` and render only the child modal with `location="center"`. The `EditInfoModal` in the profile modal is an example of this pattern.
