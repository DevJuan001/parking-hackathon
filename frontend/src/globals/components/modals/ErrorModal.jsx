import Modal from "./Modal";
import ConfirmCancelButtons from "./ConfirmCancelButtons";
import Icon from "../ui/Icon";

export default function ErrorModal({
  triggerRef,
  isOpen,
  onClose,
  errorTitle,
  errorText,
  growDirection,
  location = "center",
  confirmButtonText,
}) {
  return (
    <Modal
      z_index="300"
      type="innerModal"
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={triggerRef}
      location={location}
      growDirection={growDirection}
    >
      <section className="flex flex-col items-center gap-1 animate-blur-up">
        <div className="w-20 h-20 flex items-center justify-center bg-red-200 rounded-full dark:bg-red-950">
          <Icon
            name={"close"}
            size={40}
            color={"#dc2626"}
          />
        </div>
        <section className="flex flex-col items-center text-center gap-2 dark:text-white">
          <span className="text-lg font-medium">{errorTitle}</span>
          <span className="text-sm">{errorText}</span>
        </section>
        <ConfirmCancelButtons
          confirmText={confirmButtonText}
          confirmButtonOnClick={onClose}
          cancelButtonOnClick={onClose}
        />
      </section>
    </Modal>
  );
}
