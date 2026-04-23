import { Component } from "react";
import CryptoGridScene from "./scenes/CryptoGridScene.jsx";
import ChromeLuxuryScene from "./scenes/ChromeLuxuryScene.jsx";
import ChromeRippleScene from "./scenes/ChromeRippleScene.jsx";
import DataStreamsScene from "./scenes/DataStreamsScene.jsx";
import { Canvas } from "@react-three/fiber";

const scenes = {
  grid: CryptoGridScene,
  chrome: ChromeLuxuryScene,
  ripple: ChromeRippleScene,
  streams: DataStreamsScene,
};

class SceneErrorBoundary extends Component {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  render() {
    if (this.state.crashed) return null;
    return this.props.children;
  }
}

export default function SceneSwitcher({ activeScene = "grid" }) {
  const SceneComponent = scenes[activeScene] ?? scenes.grid;

  return (
    <div className="scene-shell" aria-hidden="true">
      <SceneErrorBoundary>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 14], fov: 55, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <SceneErrorBoundary>
            <SceneComponent />
          </SceneErrorBoundary>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
