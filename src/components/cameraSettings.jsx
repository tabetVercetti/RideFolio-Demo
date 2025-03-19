import { useThree, useFrame } from "@react-three/fiber";
import { useControls, button } from "leva";
import { useEffect, useState } from "react";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";

function useCameraControls(store, activePanel, resetCameraTarget) {
  return useControls(
    "Camera Settings",
    {
      "Reset Target": button(resetCameraTarget), // ✅ Button triggers animation
      fov: { value: 50, min: 5, max: 110, step: 1 },
      exposure: { value: 1, min: 0.05, max: 4, step: 0.05 },
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
      },
    },
    { store, hidden: activePanel !== "camera" }
  );
}

function CameraSettings({ activePanel, store, setToneMappingMode, setExposure, orbitControlsRef }) {
  const { camera, gl } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);

  const resetCameraTarget = () => {
    if (orbitControlsRef.current) {
      setIsAnimating(true); // ✅ Start animation
    }
  };

  useFrame(() => {
    if (isAnimating && orbitControlsRef.current) {
      const target = orbitControlsRef.current.target;
      const destination = new THREE.Vector3(0, 0, 0); // ✅ Target Position

      // ✅ Smoothly interpolate (lerp) towards (0,0,0)
      target.lerp(destination, 0.1); // Adjust 0.1 for slower/faster movement

      // ✅ Stop animation when close enough
      if (target.distanceTo(destination) < 0.01) {
        target.set(0, 0, 0);
        setIsAnimating(false); // ✅ Stop animating
      }

      orbitControlsRef.current.update(); // ✅ Apply changes
    }
  });

  const controlsUI = useCameraControls(store, activePanel, resetCameraTarget);

  // Update the camera's FOV
  useEffect(() => {
    camera.fov = controlsUI.fov;
    camera.updateProjectionMatrix();
  }, [controlsUI.fov, camera]);

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

    setToneMappingMode(toneMappingModes[controlsUI.toneMapping] ?? ToneMappingMode.AGX);
  }, [controlsUI.toneMapping, setToneMappingMode]);

  // Update renderer exposure
  useEffect(() => {
    gl.toneMappingExposure = controlsUI.exposure;
    setExposure(controlsUI.exposure);
  }, [controlsUI.exposure, gl, setExposure]);

  return null;
}

export default CameraSettings;
