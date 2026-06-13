  export const placeStatus = {
  1: {
    text: "Deshabilitada",
    modalType: "disable",
    optionText: "Deshabilitar",
    optionStyles: "hover:bg-red-100 text-red-600 dark:hover:bg-[#450a0a8a]",
    visibilityIcon: false,
    fill: false,
    styles: "bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400",
    roles: ["Admin"],
  },

  2: {
    text: "Disponible",
    modalType: "enable",
    optionText: "Habilitar",
    optionStyles: "hover:bg-green-100 text-green-600 dark:hover:bg-[#052e1a8a]",
    visibilityIcon: true,
    fill: true,
    styles: "bg-[#efedf0] hover:bg-[#EAE8EB] dark:bg-[#1e1e20cb]",
    roles: ["Admin"],
  },

  3: {
    text: "En uso",
    modalType: "use",
    optionText: "Marcar en uso",
    optionStyles: "hover:bg-blue-100 text-blue-600 dark:hover:bg-[#0c2a5a8a]",
    visibilityIcon: true,
    fill: true,
    styles: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    roles: ["Admin"],
  },
};
