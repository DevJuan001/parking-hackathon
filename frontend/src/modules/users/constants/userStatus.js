export const userStatus = {
  1: {
    text: "Deshabilitado",
    modalType: "enableUser",
    optionText: "Deshabilitar",
    optionStyles: "hover:bg-red-100 text-red-600 dark:hover:bg-[#450a0a8a]",
    visibilityIcon: false,
    icon: "block",
    fill: false,
    styles: "bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400",
  },

  2: {
    text: "Activo",
    modalType: "disableUser",
    optionText: "Habilitar",
    optionStyles: "hover:bg-green-100 text-green-600 dark:hover:bg-[#052e1a8a]",
    visibilityIcon: true,
    icon: "circle",
    fill: true,
    styles:
      "bg-green-100 text-green-600 hover:bg-[#EAE8EB] dark:bg-[#1e1e20cb]",
  },
};
