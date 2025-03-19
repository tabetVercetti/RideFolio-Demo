import { useRef, useMemo, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { useControls, folder } from "leva";
import * as THREE from "three";
import normalMapTexture from "/textures/terrain-normal.jpg";
import roughnessMapTexture from "/textures/terrain-roughness.jpg";

// Function to handle Leva UI settings
function useGroundControls(store, activePanel) {
  return useControls(
    "Ground Settings",
    {
      color: "#ff0000",
      textures: folder(
        {
          useNormalMap: false,
          normalScale: { value: 0.3, min: 0, max: 2, step: 0.01 }, 
          repeatScale: { value: 10, min: 1, max: 50, step: 1 }, 
          textureRotation: { value: 0, min: 0, max: Math.PI * 2, step: 0.1 }, 
        },
        { collapsed: true }
      ),
      properties: folder(
        {
          metalness: { value: 0.5, min: 0, max: 1, step: 0.01 },
          roughness: { value: 0.5, min: 0, max: 1, step: 0.01 },
        },
        { collapsed: true }
      ),
    },
    { store, hidden: activePanel !== "ground" }
  );
}

function Ground({ activePanel, store }) {
  const groundRef = useRef();
  const controls = useGroundControls(store, activePanel);

  // Load and configure the normal & roughness textures
  const [normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [normalMapTexture, roughnessMapTexture]);

  useEffect(() => {
    [normalMap, roughnessMap].forEach((map) => {
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(controls.repeatScale, controls.repeatScale);
      map.rotation = controls.textureRotation;
      map.needsUpdate = true;
    });
    
    normalMap.encoding = THREE.LinearEncoding;

    // Cleanup function to dispose of textures when component unmounts
    return () => {
      normalMap.dispose();
      roughnessMap.dispose();
    };
  }, [normalMap, roughnessMap, controls.repeatScale, controls.textureRotation]);


  // Animate the ground textures
  useFrame((state, delta) => {
    if (controls.useNormalMap) {
      const speed = 0.1; // ✅ Adjust scrolling speed
      roughnessMap.offset.y -= delta * speed; // ✅ Uses `delta` for smooth movement
      normalMap.offset.y -= delta * speed;
    }
  });

  // Memoized material properties for performance
  const materialProps = useMemo(
    () => ({
      color: controls.color,
      metalness: controls.metalness,
      roughness: controls.roughness,
      normalMap: controls.useNormalMap ? normalMap : null,
      normalScale: controls.useNormalMap ? new THREE.Vector2(controls.normalScale, controls.normalScale) : null,
      roughnessMap: controls.useNormalMap ? roughnessMap : null,
    }),
    [controls, normalMap, roughnessMap]
  );

  // Force material update when `useNormalMap` changes
  useEffect(() => {
    if (groundRef.current) {
      groundRef.current.material.needsUpdate = true;
    }
  }, [controls.useNormalMap]);

  return (
    <mesh ref={groundRef} position-y={0} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
}

export default Ground;
