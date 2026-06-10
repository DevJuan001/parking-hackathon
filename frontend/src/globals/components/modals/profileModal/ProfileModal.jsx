// Hooks
import { useState } from "react";
import { useInnerModal } from "../../../hooks/useInnerModal";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
// Components
import Icon from "../../ui/Icon";
import GeneralContent from "./GeneralContent";
import AppearanceContent from "./AppearanceContent";
// Modals
import EditInfoModal from "./EditInfoModal";
import ChangePasswordModal from "./ChangePasswordModal";
import Modal from "../Modal";

export default function ProfileModal({ triggerRef, onClose }) {
  const { user } = useCurrentUser();
  const [activeSection, setActiveSection] = useState("general");
  const { innerTrigger, innerType, openInnerModal } = useInnerModal();

  return (
    <Modal
      isOpen={true}
      type={"user"}
      title={"Configuración"}
      location="center"
      triggerRef={triggerRef}
      onClose={onClose}
    >
      <section
        className="h-screen flex flex-col-reverse items-center justify-between gap-4
      md:h-[445px] md:grid md:grid-cols-[150px_1fr]"
      >
        <aside
          className="h-[30%] justify-self-end w-full border-gray-300
        dark:border-[#3a3d43]
        md:h-full md:justify-self-start md:self-start"
        >
          {/* Lista de opciones */}
          <ul className="flex justify-center gap-1 md:flex-col md:justify-start">
            <li>
              <button
                className={`flex flex-col items-center py-2.5 px-3 rounded-xl gap-2 transition duration-300
              hover:bg-[#efedf0]
              md:flex-row md:w-full
              ${
                activeSection === "general"
                  ? "bg-gray-200 font-medium dark:bg-[#202022] text-black dark:text-white"
                  : "hover:bg-[#efedf0] dark:hover:bg-[#202022] text-[#68676786]"
              }`}
                onClick={() => setActiveSection("general")}
              >
                <Icon name={"apps"} size={24} />

                <span className="text-xs md:text-sm"> General </span>
              </button>
            </li>

            <li>
              <button
                className={`w-full flex flex-col items-center py-2.5 px-3 rounded-xl gap-2 transition duration-300
              hover:bg-[#efedf0]
              md:flex-row md:pr-0 md:pl-3
              dark:hover:bg-[#202022]
              ${
                activeSection === "appearance"
                  ? "bg-gray-200 font-medium dark:bg-[#202022] text-black dark:text-white"
                  : "hover:bg-[#efedf0] dark:hover:bg-[#202022] text-[#68676786]"
              }`}
                onClick={() => setActiveSection("appearance")}
              >
                <Icon name={"palette"} size={24} />

                <span className="text-xs md:text-sm"> Apariencia </span>
              </button>
            </li>
          </ul>
        </aside>

        <section
          className="h-[80%] w-full flex flex-col gap-7 animate-blur-up
        md:h-full
        dark:text-white"
        >
          {/* Contenido de la sección seleccionada */}
          {activeSection === "general" && (
            <GeneralContent
              user={user}
              openInnerModal={openInnerModal}
              onEditClick={(e) => {
                openInnerModal("editInfo", e);
              }}
              onPasswordClick={(e) => {
                openInnerModal("changePassword", e);
              }}
            />
          )}

          {activeSection === "appearance" && <AppearanceContent />}

          {/* Modales Internas */}
          {innerType === "editInfo" && (
            <EditInfoModal
              user={user}
              triggerRef={innerTrigger}
              isOpen={true}
              onClose={() => {
                openInnerModal(null);
              }}
            />
          )}

          {innerType === "changePassword" && (
            <ChangePasswordModal
              triggerRef={innerTrigger}
              isOpen={true}
              onClose={() => openInnerModal(null)}
            />
          )}
        </section>
      </section>
    </Modal>
  );
}
