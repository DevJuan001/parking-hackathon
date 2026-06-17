import { useState } from "react";

export function useOnboardingSections(validateSection) {
  const [activeSection, setActiveSection] = useState("userInfo");
  const [progress, setProgress] = useState(100);

  function handleContinue(sectionName, nextSection, nextProgress) {
    return function () {
      if (!validateSection(sectionName)) return;
      setProgress(nextProgress);
      setActiveSection(nextSection);
    };
  }

  function handleReturn(prevSection, prevProgress) {
    return function () {
      setActiveSection(prevSection);
      setProgress(prevProgress);
    };
  }

  return {
    activeSection,
    progress,
    handleContinue,
    handleReturn,
  };
}
