// Hooks
import { useState } from "react";
// Componentes
import CreateEntrySection from "./components/ui/CreateEntrySection";
import SuccessEntrySection from "./components/ui/SuccessEntrySection";

export default function CheckInPage() {
  const [activeSection, setActiveSection] = useState("createEntry");

  return (
    <section className="w-full h-full flex flex-col items-center justify-between p-6 font-dmsans bg-noise">
      {activeSection === "createEntry" && (
        <CreateEntrySection setActiveSection={setActiveSection} />
      )}

      {activeSection === "successEntry" && (
        <SuccessEntrySection setActiveSection={setActiveSection} />
      )}
    </section>
  );
}
