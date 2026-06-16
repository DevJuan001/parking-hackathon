// Components
import SpotsPanel from "./SpotsPanel";
import FloorsPanel from "./FloorsPanel";
import TariffsPanel from "./TariffsPanel";

export default function ParkingSectionsContainer({ openModal }) {
  return (
    <div className="h-full w-full grid grid-cols-2 grid-rows-2 gap-4">
      <SpotsPanel openModal={openModal} />

      <FloorsPanel openModal={openModal} />

      <TariffsPanel openModal={openModal} />
    </div>
  );
}
