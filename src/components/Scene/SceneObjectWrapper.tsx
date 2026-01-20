import { SceneObject } from "../Model/scene-object/index";
import { Suspense } from "react";
import { useNormalRules } from "./_hooks/useNormalRules";

export const SceneObjectWrapper = () => {
  const rules = useNormalRules();
  return (
    <>
      <Suspense>
        <SceneObject
          modelPath="/models/test_room/test_room.gltf"
          rules={rules}
          object={{
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: 1,
          }}
        />
      </Suspense>

    </>
  );
};
