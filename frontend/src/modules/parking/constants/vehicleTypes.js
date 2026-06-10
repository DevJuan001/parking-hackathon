export const vehicleTypes = {
  1: "Auto",
  2: "Moto",
  3: "Camión",
  4: "Camioneta",
  5: "Bus",
};

export const vehicleTypeOptions = Object.entries(vehicleTypes).map(
  ([id, label]) => ({ value: Number(id), label }),
);
