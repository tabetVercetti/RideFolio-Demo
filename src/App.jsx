import { useState, useEffect, useMemo, Suspense, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import { Html, OrbitControls, Stats } from "@react-three/drei";
import { LevaPanel, useCreateStore } from "leva";

// Components
import AnimatedBox from "./components/animatedBox";
import Ground from "./components/ground";
import CameraSettings from "./components/cameraSettings";
import BackgroundSettings from "./components/backgroundSettings";
import GeneralSettings from "./components/generalSettings";

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
import generalSettingsIcon from "./assets/generalSettings.png"; // Add your own icon
import generalSettingsIconActive from "./assets/generalSettingsActive.png";
import fullscreenIcon from "./assets/fullscreen.png";
import fullscreenIconActive from "./assets/fullscreenActive.png";

function App() {
  const [activePanel, setActivePanel] = useState(null);
  const handlePanelToggle = useCallback((key) => {
    setActivePanel((current) => (current === key ? null : key));
  }, []);
  const [multisampling, setMultisampling] = useState(4); // Medium is default (4 samples)
  const [toneMappingMode, setToneMappingMode] = useState(ToneMappingMode.AGX); // Default to AgX
  const [exposure, setExposure] = useState(1); // Store exposure value
  const orbitControlsRef = useRef(); // ✅ Add reference for OrbitControls
  const [showStats, setShowStats] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const canvasContainer = document.getElementById("canvas-container");

    if (!document.fullscreenElement) {
      canvasContainer.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Create separate Leva stores
  const boxStore = useCreateStore();
  const groundStore = useCreateStore();
  const cameraStore = useCreateStore();
  const backgroundStore = useCreateStore();
  const generalStore = useCreateStore();
  
  const stores = useMemo(
    () => ({
      box: boxStore,
      ground: groundStore,
      camera: cameraStore,
      background: backgroundStore,
      general: generalStore,
    }),
    [boxStore, groundStore, cameraStore, backgroundStore, generalStore]
  );

  const buttons = useMemo(() => [
    { key: "box", icon: boxSettingsIcon, activeIcon: boxSettingsIconActive, label: "Box Settings" },
    { key: "ground", icon: groundSettingsIcon, activeIcon: groundSettingsIconActive, label: "Ground Settings" },
    { key: "camera", icon: cameraSettingsIcon, activeIcon: cameraSettingsIconActive, label: "Camera Settings" },
    { key: "background", icon: backgroundSettingsIcon, activeIcon: backgroundSettingsIconActive, label: "Background Settings" },
    { key: "general", icon: generalSettingsIcon, activeIcon: generalSettingsIconActive, label: "General Settings" },
  ], []);

  return (
    <div id="canvas-container">
      {/* Buttons at the bottom*/}
      <div className="settings-buttons">
      {buttons.map(({ key, icon, activeIcon, label }) => (
        <button key={key} className="tooltip" onClick={() => handlePanelToggle(key)}>
          <img src={activePanel === key ? activeIcon : icon} alt={label} />
          <span className="tooltip-text">{label}</span>
        </button>
      ))}

      <button className="tooltip" onClick={toggleFullscreen}>
        <img src={isFullscreen ? fullscreenIconActive : fullscreenIcon} alt="Fullscreen Toggle" />
        <span className="tooltip-text">{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</span>
      </button>
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
          <GeneralSettings
            activePanel={activePanel}
            store={stores.general}
            setShowStats={setShowStats}
            setMultisampling={setMultisampling}
          />
          {/* ✅ Conditionally render stats */}
          {showStats && <Stats className="stats" />}
          {/* Postprocessing */}
          <EffectComposer multisampling={multisampling} disableNormalPass={true}>
            <ToneMapping mode={toneMappingMode} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
