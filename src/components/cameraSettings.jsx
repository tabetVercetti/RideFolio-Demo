// import { useThree } from "@react-three/fiber";
// import { useControls } from "leva";
// import { useEffect } from "react";

// function useCameraControls(store, activePanel) {
//   return useControls(
//     "Camera Settings",
//     { fov: { value: 50, min: 5, max: 110, step: 1 } },
//     { store, hidden: activePanel !== "camera" }
//   );
// }

// function CameraSettings({ activePanel, store }) {
//   const { camera } = useThree();
//   const controls = useCameraControls(store, activePanel);

//   // Update the camera's FOV only when it changes
//   useEffect(() => {
//     camera.fov = controls.fov;
//     camera.updateProjectionMatrix();
//   }, [controls.fov, camera]);

//   return null; // This component doesn't render anything
// }
// export default CameraSettings;

import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect } from "react";
import { ToneMappingMode } from "postprocessing";

function useCameraControls(store, activePanel) {
  return useControls(
    "Camera Settings",
    {
      fov: { value: 50, min: 5, max: 110, step: 1 },
      toneMapping: { 
        value: "AgX", 
        options: {
          Linear: "Linear",
          Reinhard: "Reinhard",
          Uncharted2: "Uncharted2",
          Cineon: "Cineon",
          ACESFilmic: "ACESFilmic",
          AgX: "AgX",
          Neutral: "Neutral",
        }
      }
    },
    { store, hidden: activePanel !== "camera" }
  );
}

function CameraSettings({ activePanel, store, setToneMappingMode }) {
  const { camera } = useThree();
  const controls = useCameraControls(store, activePanel);

  // Update the camera's FOV when changed
  useEffect(() => {
    camera.fov = controls.fov;
    camera.updateProjectionMatrix();
  }, [controls.fov, camera]);

  // Update the tone mapping mode when the dropdown changes
  useEffect(() => {
    const toneMappingModes = {
      Linear: ToneMappingMode.LINEAR,
      Reinhard: ToneMappingMode.REINHARD,
      Uncharted2: ToneMappingMode.UNCHARTED2,
      Cineon: ToneMappingMode.CINEON,
      ACESFilmic: ToneMappingMode.ACES_FILMIC,
      AgX: ToneMappingMode.AGX,
      Neutral: ToneMappingMode.NEUTRAL,
    };

    setToneMappingMode(toneMappingModes[controls.toneMapping] ?? ToneMappingMode.AGX);
  }, [controls.toneMapping, setToneMappingMode]);

  return null; // This component doesn't render anything
}

export default CameraSettings;
