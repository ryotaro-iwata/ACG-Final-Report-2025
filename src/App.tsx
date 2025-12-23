import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { useControls } from "leva";
import { DIRECTIONAL_LIGHT_POSITION } from "./const/DirectionalLight/params";
import { SceneObjectWrapper } from "./components/Scene/SceneObjectWrapper.tsx";

function App() {
  const { lightX, lightY, lightZ } = useControls("Light Position", DIRECTIONAL_LIGHT_POSITION);
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh", background: "#0b1221" }}
      camera={{ position: [2.5, 1.6, 3], fov: 45 }}
    >
      <color attach="background" args={["#ffffff"]} />
      <directionalLight position={[lightX, lightY, lightZ]} intensity={3.0} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={10}
      />

      <SceneObjectWrapper lightX={lightX} lightY={lightY} lightZ={lightZ} />
    </Canvas>
  );
}

export default App;
