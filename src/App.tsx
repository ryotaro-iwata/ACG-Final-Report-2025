import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./components/Model/index";
import { Suspense } from "react";
import { useControls } from 'leva';

function App() {

  const { lightX, lightY, lightZ } = useControls('Light Position', {
    lightX: { value: 3, min: -10, max: 10, step: 0.1 },
    lightY: { value: 5, min: -10, max: 10, step: 0.1 },
    lightZ: { value: 4, min: -10, max: 10, step: 0.1 },
  });

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
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
}

export default App;
