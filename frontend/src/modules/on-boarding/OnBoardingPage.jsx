// Hooks
import { useState } from "react";
import { useCompleteOnBoarding } from "./hooks/useCompleteOnBoarding";
// Componentes
import ProgressBar from "./components/ui/ProgressBar";
import UserInfoSection from "./components/ui/UserInfoSection";
import ParkingNameSection from "./components/ui/ParkingNameSection";
import ParkingLocationSection from "./components/ui/ParkingLocationSection";

export default function OnBoardingPage() {
  const [progress, setProgress] = useState(100);
  const [activeSection, setActiveSection] = useState("userInfo");
  const { form, loading, error, fieldError, handleChange, handleSubmit } =
    useCompleteOnBoarding();

  return (
    <section className="w-screen h-screen flex flex-col items-center font-dmsans">
      <ProgressBar progress={progress} />

      <UserInfoSection
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setProgress={setProgress}
        form={form}
        handleChange={handleChange}
        fieldError={fieldError}
      />

      <ParkingNameSection
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setProgress={setProgress}
        form={form}
        handleChange={handleChange}
        fieldError={fieldError}
      />

      <ParkingLocationSection
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setProgress={setProgress}
        form={form}
        loading={loading}
        error={error}
        handleChange={handleChange}
        fieldError={fieldError}
        handleSubmit={handleSubmit}
      />
    </section>
  );
}
