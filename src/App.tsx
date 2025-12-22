import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ChocoCoromet from "./components/Model/choco-coromet/index";
import Horse from "./components/Model/horse";
import { SceneObject } from "./components/Model/gltf-general";
import { testToonShader, type TestToonUniforms } from "./shaders/test-toon/test-toon.tsx";
import { Suspense } from "react";
import { useControls } from "leva";
import { DIRECTIONAL_LIGHT_POSITION } from "./const/DirectionalLight/params";

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

      /* チョココロネ*/
      <SceneObject
        modelPath="/models/choco_coromet/coromet.gltf"
        shader={testToonShader}
        uniforms={{
            time: performance.now(),
            colorTint: [1, 0.5, 0.5],
            lightDirection: [lightX, lightY, lightZ]
        }}
        object={{
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1
        }}
      />

      /*動物 */
      <SceneObject
        modelPath="/models/horse.gltf"
        shader={testToonShader}
        uniforms={{
          time: performance.now(),
          colorTint: [1, 0.5, 0.5],
          lightDirection: [lightX, lightY, lightZ]
        }}
        object={{
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1
        }}
      />
      

    </Canvas>
  );
}

export default App;
