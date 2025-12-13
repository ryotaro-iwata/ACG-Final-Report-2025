import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./components/Model/index";

function App() {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh", background: "#0b1221" }}
      camera={{ position: [2.5, 1.6, 3], fov: 45 }}
    >
      <color attach="background" args={["#ffffff"]} />
      <directionalLight position={[3, 5, 4]} intensity={3.0} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={10}
      />
      <Model />
    </Canvas>
  );
}

export default App;
