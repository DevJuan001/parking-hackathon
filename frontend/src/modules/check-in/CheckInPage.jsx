// Hooks
import { useState } from "react";
// Componentes
import CreateEntrySection from "./components/ui/CreateEntrySection";
import SuccessEntrySection from "./components/ui/SuccessEntrySection";
import { useCreateEntry } from "./hooks/usecreateEntry";

export default function CheckInPage() {
  const [activeSection, setActiveSection] = useState("createEntry");
  const { entryData, message, loading, error, handleChange, handleSubmit } =
    useCreateEntry(setActiveSection);

  return (
    <section className="w-full h-full flex flex-col items-center justify-between p-6 font-dmsans bg-noise">
      {activeSection === "createEntry" && (
        <CreateEntrySection
          entryData={entryData}
          loading={loading}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}

      {activeSection === "successEntry" && (
        <SuccessEntrySection setActiveSection={setActiveSection} message={message} />
      )}
    </section>
  );
}
