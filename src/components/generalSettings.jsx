import { useControls } from "leva";
import { useEffect } from "react";

function useGeneralControls(store, activePanel) {
  return useControls(
    "General Settings",
    {
        showStats: false,
        antiAliasing: {
            value: "Medium",
            options: {
            Off: "Off",
            Low: "Low",
            Medium: "Medium",
            High: "High",
            VeryHigh: "VeryHigh"
            }
        },
    },
    { store, hidden: activePanel !== "general" }
  );
}

function GeneralSettings({ activePanel, store, setShowStats, setMultisampling }) {
  const controls = useGeneralControls(store, activePanel);

  // update stats visibility
  useEffect(() => {
    setShowStats(controls.showStats);
  }, [controls.showStats, setShowStats]);

  useEffect(() => {
    const sampleMap = {
      Off: 0,
      Low: 2,
      Medium: 4,
      High: 8,
      VeryHigh: 16,
    };

    setMultisampling(sampleMap[controls.antiAliasing]);
  }, [controls.antiAliasing, setMultisampling]);

  return null;
}

export default GeneralSettings;
