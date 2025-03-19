import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls, folder } from "leva";
import * as THREE from "three";

// Function to handle Leva UI settings
function useBoxControls(store, activePanel) {
  return useControls(
    "Box Settings",
    {
      color: "gold",
      animation: folder(
        {
          speed: { value: 0.005, min: 0.0, max: 0.03, step: 0.001 },
        },
        { collapsed: true }
      ),
      material: folder(
        {
          metalness: { value: 0.5, min: 0, max: 1, step: 0.01 },
          roughness: { value: 0.5, min: 0, max: 1, step: 0.01 },
          iridescence: { value: 0, min: 0, max: 1, step: 0.01 },
          iridescenceIOR: { value: 1.3, min: 1, max: 2.5, step: 0.01 },
          clearcoat: { value: 0, min: 0, max: 1, step: 0.01 },
          clearcoatRoughness: { value: 0, min: 0, max: 1, step: 0.01 },
          transmission: { value: 0, min: 0, max: 1, step: 0.01 },
          ior: { value: 1.5, min: 1, max: 2.5, step: 0.01 },
          specularIntensity: { value: 1, min: 0, max: 2, step: 0.01 },
          specularColor: "#ffffff",
          transparent: false,
          opacity: { value: 1, min: 0, max: 1, step: 0.01 },
        },
        { collapsed: true }
      ),
    },
    { store, hidden: activePanel !== "box" }
  );
}

function AnimatedBox({ activePanel, store }) {
  const boxRef = useRef();
  const controls = useBoxControls(store, activePanel);

  // Memoized material properties to prevent re-renders
  const materialProps = useMemo(
    () => ({
      color: controls.color,
      metalness: controls.metalness,
      roughness: controls.roughness,
      iridescence: controls.iridescence,
      iridescenceIOR: controls.iridescenceIOR,
      clearcoat: controls.clearcoat,
      clearcoatRoughness: controls.clearcoatRoughness,
      transmission: controls.transmission,
      ior: controls.ior,
      specularIntensity: controls.specularIntensity,
      specularColor: new THREE.Color(controls.specularColor),
      transparent: Boolean(controls.opacity < 1 || controls.transparent),
      opacity: controls.opacity,
      depthWrite: controls.transparent ? false : true, // 🔥 Prevents depth sorting issues
    }),
    [controls]
  );

  // 🔥 Force material update when transparency changes
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.material.needsUpdate = true;
    }
  }, [controls.transparent]);

  // Frame loop for smooth animation
  useFrame((_, delta) => {
    if (boxRef.current) {
      const rotationSpeed = controls.speed * delta * 60;
      boxRef.current.rotation.x += rotationSpeed;
      boxRef.current.rotation.y += rotationSpeed;
      boxRef.current.rotation.z += rotationSpeed;
    }
  });

  return (
    <mesh ref={boxRef}>
      <boxGeometry args={[2, 3, 2]} />
      <meshPhysicalMaterial {...materialProps} />
    </mesh>
  );
}

export default AnimatedBox;
