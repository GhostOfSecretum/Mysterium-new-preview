import { Suspense, lazy, Component } from "react";
import { Canvas } from "@react-three/fiber";

const scenes = {
  grid:    lazy(() => import("./scenes/CryptoGridScene.jsx")),
  chrome:  lazy(() => import("./scenes/ChromeLuxuryScene.jsx")),
  ripple:  lazy(() => import("./scenes/ChromeRippleScene.jsx")),
  streams: lazy(() => import("./scenes/DataStreamsScene.jsx")),
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
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 14], fov: 55, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <SceneErrorBoundary>
              <SceneComponent />
            </SceneErrorBoundary>
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
