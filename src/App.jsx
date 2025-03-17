// export default App;

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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

  // Create separate Leva stores
  const stores = {
    box: useCreateStore(),
    ground: useCreateStore(),
    camera: useCreateStore(),
    background: useCreateStore(),
  };

  const buttons = [
    { key: "box", icon: boxSettingsIcon, activeIcon: boxSettingsIconActive, label: "Box Settings" },
    { key: "ground", icon: groundSettingsIcon, activeIcon: groundSettingsIconActive, label: "Ground Settings" },
    { key: "camera", icon: cameraSettingsIcon, activeIcon: cameraSettingsIconActive, label: "Camera Settings" },
    { key: "background", icon: backgroundSettingsIcon, activeIcon: backgroundSettingsIconActive, label: "Background Settings" },
  ];

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
      {activePanel && <LevaPanel store={stores[activePanel]} titleBar={false} />}

      {/* 3D Scene */}
      <Canvas>
        <OrbitControls />
        <CameraSettings activePanel={activePanel} store={stores.camera} />
        <BackgroundSettings activePanel={activePanel} store={stores.background} />
        <AnimatedBox activePanel={activePanel} store={stores.box} />
        <Ground activePanel={activePanel} store={stores.ground} />
      </Canvas>
    </div>
  );
}

export default App;
