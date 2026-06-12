// Components
import EarningsPanel from "./EarningsPanel";
import RecentEntriesPanel from "./RecentEntriesPanel";
import SpotsPanel from "../../../parking/components/ui/SpotsPanel";

export default function HomeSectionsContainer({ openModal }) {
  return (
    <section className="h-full w-full grid grid-cols-2 grid-rows-2 gap-4">
      <SpotsPanel openModal={openModal} />

      <RecentEntriesPanel />

      <EarningsPanel />
    </section>
  );
}
