// export default Ground;

import { useRef, useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { useControls, folder } from "leva";
import * as THREE from "three";
import normalMapTexture from "/textures/concrete_floor_worn_001_nor_gl_1k.png";

function Ground({ activePanel, store }) {
  const groundRef = useRef();

  // Load Normal Map texture
  const normalMap = useLoader(THREE.TextureLoader, normalMapTexture);

  useEffect(() => {
    if (normalMap) {
      normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
      normalMap.repeat.set(100, 100);
      normalMap.needsUpdate = true;
    }
  }, [normalMap]);

  // Leva controls
  const {
    color,
    useNormalMap,
    metalness,
    roughness,
    iridescence,
    iridescenceIOR,
    clearcoat,
    clearcoatRoughness,
    transmission,
    ior,
    specularIntensity,
    specularColor,
    transparent,
    opacity,
  } = useControls(
    "Ground Settings",
    {
      color: "#ff0000",
      textures: folder(
        { useNormalMap: false },
        { collapsed: true }
      ),
      properties: folder(
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
    { store, hidden: activePanel !== "ground" }
  );

  // Memoized material properties to prevent unnecessary updates
  const materialProps = useMemo(
    () => ({
      color,
      metalness,
      roughness,
      iridescence,
      iridescenceIOR,
      clearcoat,
      clearcoatRoughness,
      transmission,
      ior,
      specularIntensity,
      specularColor: new THREE.Color(specularColor), // Convert to THREE.Color
      transparent: opacity < 1 ? true : transparent, // Auto-enable transparency
      opacity,
      normalMap: useNormalMap ? normalMap : null, // Toggle normal map dynamically
    }),
    [
      color,
      metalness,
      roughness,
      iridescence,
      iridescenceIOR,
      clearcoat,
      clearcoatRoughness,
      transmission,
      ior,
      specularIntensity,
      specularColor,
      transparent,
      opacity,
      useNormalMap,
      normalMap,
    ]
  );

  return (
    <mesh ref={groundRef} position-y={-2} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshPhysicalMaterial
        color={color}
        metalness={metalness ?? 0.5}
        roughness={roughness ?? 0.5}
        iridescence={iridescence ?? 0}
        iridescenceIOR={iridescenceIOR ?? 1.3}
        clearcoat={clearcoat ?? 0}
        clearcoatRoughness={clearcoatRoughness ?? 0}
        transmission={transmission ?? 0}
        ior={ior ?? 1.5}
        specularIntensity={specularIntensity ?? 1}
        specularColor={specularColor ?? "#ffffff"}
        transparent={transparent ?? false}
        opacity={opacity ?? 1}
        normalMap={useNormalMap ? normalMap : undefined} 
       />
    </mesh>
  );
}

export default Ground;

