import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect } from "react";

function useCameraControls(store, activePanel) {
  return useControls(
    "Camera Settings",
    { fov: { value: 50, min: 5, max: 110, step: 1 } },
    { store, hidden: activePanel !== "camera" }
  );
}

function CameraSettings({ activePanel, store }) {
  const { camera } = useThree();
  const controls = useCameraControls(store, activePanel);

  // Update the camera's FOV only when it changes
  useEffect(() => {
    camera.fov = controls.fov;
    camera.updateProjectionMatrix();
  }, [controls.fov, camera]);

  return null; // This component doesn't render anything
}

export default CameraSettings;
