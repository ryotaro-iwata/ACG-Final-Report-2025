import { SceneObject } from "../Model/scene-object/index";
import { Suspense } from "react";
import { useNormalRules } from "./_hooks/useNormalRules";
import { useVaporRules } from "./_hooks/useVaporRules";
import { useControls } from "leva";

export const SceneObjectWrapper = () => {
  const { themeMode } = useControls("SHader Theme", {
    themeMode: {
      value: "Normal",
      options: ["Normal", "Vaporwave"]
    }
  })
  const normalRules = useNormalRules();
  const vaporRules = useVaporRules();

  let rules;
  switch (themeMode) {
    case "Vaporwave":
      rules = vaporRules;
      break;
    case "Normal":
    default:
      rules = normalRules;
      break;
  }
  return (
    <>
      <Suspense>
        <SceneObject
          modelPath="/models/room.gltf"
          rules={rules}
          object={{
            position: [-8, -12.5, -28],
            rotation: [0, 1.5, 0],
            scale: 1,
          }}
        />
      </Suspense>
    </>
  );
};
