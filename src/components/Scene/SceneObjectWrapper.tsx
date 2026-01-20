import { SceneObject } from "../Model/scene-object/index";
import { testToonShader } from "../../shaders/test-toon/test-toon.tsx";
import { verySimpleShader } from "../../shaders/very-simple/very-simple.tsx";
import { OldCartoonShader } from "../../shaders/oldcartoon/oldcartoon.tsx";
import { RainbowShader } from "../../shaders/rainbow/rainbow.tsx";
import { Suspense } from "react";

type SceneObjectWrapperProps = {
  lightX: number;
  lightY: number;
  lightZ: number;
};
export const SceneObjectWrapper = ({
  lightX,
  lightY,
  lightZ,
}: SceneObjectWrapperProps) => {
  return (
    <>
      {/* チョココロネ2*/}
      <Suspense>
        <SceneObject
          modelPath="/models/room.gltf"
          shader={RainbowShader}
          uniforms={{
            lightDirection: [lightX, lightY, lightZ],
            lightIntensity: 1.0,
          }}
          object={{
            position: [0, 0, 0],
            rotation: [0, 0, 90],
            scale: 0.3,
          }}
        />
      </Suspense>

    </>
  );
};
