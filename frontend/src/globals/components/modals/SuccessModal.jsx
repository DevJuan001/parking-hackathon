import Modal from "./Modal";
import ConfirmCancelButtons from "./ConfirmCancelButtons";
import Icon from "../ui/Icon";

export default function SuccessModal({
  isOpen,
  onClose,
  confirmTitle,
  triggerRef,
  confirmText,
  growDirection,
  confirmButtonText,
  location = "center",
}) {
  return (
    <Modal
      z_index="300"
      isOpen={isOpen}
      onClose={onClose}
      type="innerModal"
      triggerRef={triggerRef}
      location={location}
      growDirection={growDirection}
    >
      <section className="flex flex-col items-center gap-1">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 flex items-center justify-center bg-green-100 rounded-full dark:bg-green-950">
            <Icon name={"check"} size={40} color={"#22c55e"} />
          </div>

          <div className="flex flex-col items-center text-center gap-2 dark:text-white">
            <span id="confirm-title" className="text-xl font-medium">
              {confirmTitle}
            </span>

            <span className="text-sm">{confirmText}</span>
          </div>
        </div>

        <ConfirmCancelButtons
          confirmText={confirmButtonText}
          confirmButtonOnClick={onClose}
          cancelButtonOnClick={onClose}
        />
      </section>
    </Modal>
  );
}
