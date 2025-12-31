import { SceneObject } from "../Model/scene-object/index";
import { testToonShader } from "../../shaders/test-toon/test-toon.tsx";
import { verySimpleShader } from "../../shaders/very-simple/very-simple.tsx";
import { Suspense } from "react";

type SceneObjectWrapperProps = {
  lightX: number;
  lightY: number;
  lightZ: number;
};
export const SceneObjectWrapper = ({ lightX, lightY, lightZ, }: SceneObjectWrapperProps) => {
  return (
    <>
      {/* チョココロネ*/}
      <Suspense fallback={null}>
        <SceneObject
          modelPath="/models/choco_coromet/coromet.gltf"
          shader={testToonShader}
          uniforms={{
            time: performance.now(),
            colorTint: [1, 0.5, 0.5],
            lightDirection: [lightX, lightY, lightZ],
            lightIntensity: 1.0,
          }}
          object={{
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: 1,
          }}
        />
      </Suspense>


      {/*動物 */}
      <Suspense fallback={null}>
        <SceneObject
          modelPath="/models/horse.gltf"
          shader={testToonShader}
          uniforms={{
            time: performance.now(),
            colorTint: [1, 0.5, 0.5],
            lightDirection: [lightX, lightY, lightZ],
          }}
          object={{
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: 1,
          }}
        />
      </Suspense>


      {/* チョココロネ2*/}
      <Suspense fallback={null}>
        <SceneObject
          modelPath="/models/choco_coromet/coromet.gltf"
          shader={verySimpleShader}
          uniforms={{
            lightDirection: [lightX, lightY, lightZ],
            lightIntensity: 1.0,
          }}
          object={{
            position: [0, 2.5, 0],
            rotation: [0, 0, 0],
            scale: 0.3,
          }}
        />
      </Suspense>

    </>
  );
};
