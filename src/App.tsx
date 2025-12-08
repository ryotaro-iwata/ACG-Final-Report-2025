import { Canvas } from "@react-three/fiber";
import Model from "./components/Model";
function App() {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <ambientLight intensity={Math.PI / 2} />
      <mesh>
        <Model/>
        <meshToonMaterial color="white" />
      </mesh>
    </Canvas>
  );
}

export default App;