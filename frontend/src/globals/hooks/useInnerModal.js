import { useState, useCallback } from "react";

export const useInnerModal = () => {
  const [innerModal, setInnerModal] = useState({
    type: null,
    trigger: { element: null, rect: null },
  });

  const openInnerModal = useCallback((type, e = null) => {
    // Si hay un evento, capturamos el elemento y su posición actual
    const triggerData = e?.currentTarget
      ? {
          element: e.currentTarget,
          rect: e.currentTarget.getBoundingClientRect(),
        }
      : { element: null, rect: null };

    setInnerModal({
      type,
      trigger: triggerData,
    });
  }, []);

  const closeInnerModal = useCallback(() => {
    setInnerModal({
      type: null,
      trigger: { element: null, rect: null },
    });
  }, []);

  return {
    innerType: innerModal.type,
    innerTrigger: innerModal.trigger,
    openInnerModal,
    closeInnerModal,
  };
};
