import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import { Html, OrbitControls } from "@react-three/drei";
import { LevaPanel, useCreateStore } from "leva";

// Components
import AnimatedBox from "./components/animatedBox";
import Ground from "./components/ground";
import CameraSettings from "./components/cameraSettings";
import BackgroundSettings from "./components/backgroundSettings";

// Styling
import "./App.css";

// UI icons
import boxSettingsIcon from "./assets/boxSettings.png";
import boxSettingsIconActive from "./assets/boxSettingsActive.png";
import groundSettingsIcon from "./assets/groundSettings.png";
import groundSettingsIconActive from "./assets/groundSettingsActive.png";
import cameraSettingsIcon from "./assets/cameraSettings.png";
import cameraSettingsIconActive from "./assets/cameraSettingsActive.png";
import backgroundSettingsIcon from "./assets/backgroundSettings.png";
import backgroundSettingsIconActive from "./assets/backgroundSettingsActive.png";

function App() {
  const [activePanel, setActivePanel] = useState(null);
  const [toneMappingMode, setToneMappingMode] = useState(ToneMappingMode.AGX); // Default to AgX
  const [exposure, setExposure] = useState(1); // Store exposure value
  const orbitControlsRef = useRef(); // ✅ Add reference for OrbitControls
  const cameraRef = useRef();

  // Create separate Leva stores
  const boxStore = useCreateStore();
  const groundStore = useCreateStore();
  const cameraStore = useCreateStore();
  const backgroundStore = useCreateStore();
  
  const stores = useMemo(
    () => ({
      box: boxStore,
      ground: groundStore,
      camera: cameraStore,
      background: backgroundStore,
    }),
    [boxStore, groundStore, cameraStore, backgroundStore]
  );

  const buttons = useMemo(() => [
    { key: "box", icon: boxSettingsIcon, activeIcon: boxSettingsIconActive, label: "Box Settings" },
    { key: "ground", icon: groundSettingsIcon, activeIcon: groundSettingsIconActive, label: "Ground Settings" },
    { key: "camera", icon: cameraSettingsIcon, activeIcon: cameraSettingsIconActive, label: "Camera Settings" },
    { key: "background", icon: backgroundSettingsIcon, activeIcon: backgroundSettingsIconActive, label: "Background Settings" },
  ], []);

  return (
    <div id="canvas-container">
      {/* Settings Buttons */}
      <div className="settings-buttons">
      {buttons.map(({ key, icon, activeIcon, label }) => (
        <button key={key} className="tooltip" onClick={() => setActivePanel(activePanel === key ? null : key)}>
          <img src={activePanel === key ? activeIcon : icon} alt={label} />
          <span className="tooltip-text">{label}</span>
          </button>
        ))}
      </div>

      {/* Leva Panel */}
      {activePanel && <LevaPanel store={stores[activePanel]} titleBar={true} />}



      {/* 3D Scene (sRGB color space and gamma correction are enabled by default in canvas) */}
      <Canvas 
        camera={{ position: [-10, 1.75, 0] }} 
        flat 
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          toneMappingExposure:exposure,
        }}>
        <Suspense fallback={<Html center>Loading</Html>}> 
          <OrbitControls   
            ref={orbitControlsRef} 
            minDistance={3} // ✅ Prevents zooming too close
            maxDistance={40} // ✅ Prevents zooming too far
          />
          <CameraSettings 
            activePanel={activePanel} 
            store={stores.camera} 
            setToneMappingMode={setToneMappingMode} 
            setExposure={setExposure}
            orbitControlsRef={orbitControlsRef} // ✅ Pass the ref to CameraSettings 
          />
          <BackgroundSettings activePanel={activePanel} store={stores.background} />
          <AnimatedBox activePanel={activePanel} store={stores.box} />
          <Ground activePanel={activePanel} store={stores.ground} />
          {/* Postprocessing */}
          <EffectComposer>
            <ToneMapping mode={toneMappingMode} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
