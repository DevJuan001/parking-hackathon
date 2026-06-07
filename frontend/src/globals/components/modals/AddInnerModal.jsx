import Modal from "./Modal";

export default function AddInnerModal({
  children,
  isOpen,
  onClose,
  title,
  triggerRef,
  disableClose = false,
  location = "center"
}) {
  return (
    <Modal
      z_index="150"
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={"innerModal"}
      triggerRef={triggerRef}
      location={location}
      disableClose={disableClose}
    >
      {children}
    </Modal>
  );
}
