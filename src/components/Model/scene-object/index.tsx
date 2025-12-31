import { type FC, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { ShaderDefinition } from "../../../types/shader";
import { useShaderModel } from "./_hooks/useShaderModel";
import { useOutline } from "./_hooks/useOutline";

type SceneObjectProps<T = Record<string, any>> = {
  modelPath: string;
  shader: ShaderDefinition<T>;
  uniforms: Partial<T>;
  object?: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number] | number;
  };
};

export const SceneObject: FC<SceneObjectProps> = (props) => {
  const { modelPath, shader, uniforms, object = {} } = props;

  const gltf = useGLTF(modelPath);

  // シーンのクローン（複数のSceneObjectで同じモデルを使う場合に汚染しないため）
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // フックでロジックを注入
  useShaderModel(scene, shader, uniforms);
  useOutline(scene);

  return (
    <primitive
      object={scene}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
    />
  );
};