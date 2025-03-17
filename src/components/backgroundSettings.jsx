// export default BackgroundSettings;

import { Environment } from "@react-three/drei";
import { useControls } from "leva";
import { useMemo } from "react";

function useBackgroundControls(store, activePanel) {
  return useControls(
    "Background Settings",
    {
      hdri: { value: "Sunset", options: ["Sunset", "Dawn", "Night", "Warehouse", "Forest", "Apartment", "Studio", "City"] }, // Dropdown options
      blur: { value: 0, min: 0, max: 1, step: 0.01 },
      backgroundIntensity: { value: 1, min: 0, max: 5, step: 0.1 },
    },
    { store, hidden: activePanel !== "background" }
  );
}

function BackgroundSettings({ activePanel, store }) {
  const controls = useBackgroundControls(store, activePanel);

  // Memoized HDRi options
  const hdriOptions = useMemo(
    () => ({
      Sunset: "sunset",
      Dawn: "dawn",
      Night: "night",
      Warehouse: "warehouse",
      Forest: "forest",
      Apartment: "apartment",
      Studio: "studio",
      City: "city",
    }),
    []
  );

  return (
    <Environment
      background
      preset={hdriOptions[controls.hdri] ?? "sunset"} // Prevents errors if an undefined value is selected
      blur={controls.blur}
      backgroundIntensity={controls.backgroundIntensity}
    />
  );
}

export default BackgroundSettings;
