import { SceneObject } from "../Model/scene-object/index";
import { Suspense } from "react";
import { useNormalRules } from "./_hooks/useNormalRules";
import { useVaporRules } from "./_hooks/useVaporRules";
import { useHandWriteRules } from "./_hooks/useHandWriteRules";
import { useControls } from "leva";

export const SceneObjectWrapper = () => {
  const { themeMode } = useControls("SHader Theme", {
    themeMode: {
      value: "Normal",
      options: ["Normal", "Vaporwave", "Handwrite"]
    }
  })
  const normalRules = useNormalRules();
  const vaporRules = useVaporRules();
  const handWriteRules = useHandWriteRules();

  let rules;
  switch (themeMode) {
    case "Vaporwave":
      rules = vaporRules;
      break;
    case "Handwrite":
      rules = handWriteRules;
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
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: 1,
          }}
        />
      </Suspense>
    </>
  );
};
