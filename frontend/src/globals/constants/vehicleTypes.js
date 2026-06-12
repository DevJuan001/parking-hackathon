export const vehicleTypes = {
  1: { text: "Auto", icon: "directions_car" },
  2: { text: "Moto", icon: "two_wheeler" },
  3: { text: "Camión", icon: "local_shipping" },
  4: { text: "Camioneta", icon: "airport_shuttle" },
  5: { text: "Bus", icon: "directions_bus" },
};

export const vehicleTypeOptions = Object.entries(vehicleTypes).map(
  (id, label) => ({ value: Number(id), label }),
);
