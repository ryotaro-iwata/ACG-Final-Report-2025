// components/GLTFModel.tsx
import { type FC, useState, useEffect } from "react";
import {
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  BackSide,
  Material,
  Color,
  Vector3,
} from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import type { ShaderDefinition } from "../../../types/shader";

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

// マテリアルごとに1つのシェーダーマテリアルをキャッシュ
const MATERIAL_CACHE = new WeakMap<Material, ShaderMaterial>();

function createShaderMaterial<T>(
  src: Material,
  shader: ShaderDefinition<T>,
  uniformValues: Partial<T>
): ShaderMaterial {
  // 同じ元マテリアル + 同じシェーダーの組み合わせならキャッシュを返す
  // （シェーダーが変わったら新しいマテリアルを作成する必要があるため、
  //  実際にはキャッシュキーにシェーダーIDを含めるべきだが、簡易的にスキップ）
  const cached = MATERIAL_CACHE.get(src);
  if (cached) return cached;

  // 元マテリアルのプロパティを取得
  const m = src as unknown as {
    map?: unknown;
    color?: { clone: () => Color };
    transparent?: boolean;
    opacity?: number;
    side?: number;
    alphaTest?: number;
  };

  // シェーダー定義からuniformを生成
  const shaderUniforms = shader.createUniforms(uniformValues);

  const material = new ShaderMaterial({
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    uniforms: {
      // 基本的なuniform
      diffuse: { value: m.color?.clone?.() ?? new Color(0xffffff) },
      map: { value: m.map ?? null },
      hasTexture: { value: !!m.map },
      opacity: { value: m.opacity ?? 1.0 },
      // シェーダー固有のuniform
      ...shaderUniforms,
    },
    transparent: m.transparent,
    side: m.side as never,
    alphaTest: m.alphaTest,
  });

  MATERIAL_CACHE.set(src, material);
  return material;
}

// アウトライン用の黒マテリアル
const OUTLINE_MATERIAL = new MeshBasicMaterial({
  color: 0x000000,
  side: BackSide,
});

export const SceneObject: FC<SceneObjectProps> = (props) => {
  const { modelPath, shader, uniforms, object = {} } = props;
  const [gltf, setGltf] = useState<GLTF | null>(null);

  // モデルのロード
  useEffect(() => {
    const loader = new GLTFLoader();
    let cancelled = false;

    loader.load(modelPath, (loadedGltf) => {
      if (cancelled) return;

      loadedGltf.scene.traverse((obj) => {
        const mesh = obj as unknown as {
          isMesh?: boolean;
          isSkinnedMesh?: boolean;
          material?: Material | Material[];
          castShadow?: boolean;
          receiveShadow?: boolean;
          geometry?: unknown;
          parent?: { add: (child: unknown) => void } | null;
        };
        if (!mesh.isMesh || !mesh.material || !mesh.geometry) return;

        // マテリアルをカスタムシェーダーマテリアルに変換
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map((m) => createShaderMaterial(m, shader, uniforms))
          : createShaderMaterial(mesh.material, shader, uniforms);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // SkinnedMeshの場合はアウトライン処理をスキップ
        if (mesh.isSkinnedMesh) return;

        // アウトライン用のMeshを複製
        const outlineMesh = new Mesh(mesh.geometry as never, OUTLINE_MATERIAL);
        outlineMesh.position.copy((mesh as Mesh).position);
        outlineMesh.rotation.copy((mesh as Mesh).rotation);
        outlineMesh.scale.copy((mesh as Mesh).scale);
        outlineMesh.scale.multiplyScalar(1.01);
        outlineMesh.renderOrder = -1;

        if (mesh.parent) {
          mesh.parent.add(outlineMesh);
        }
      });

      setGltf(loadedGltf);
    });

    return () => {
      cancelled = true;
    };
  }, [modelPath, shader]);

  // uniformの動的更新
  useEffect(() => {
    if (!gltf) return;

    const shaderUniforms = shader.createUniforms(uniforms);

    gltf.scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat) => {
        if (mat instanceof ShaderMaterial) {
          // 動的に更新されるuniformを反映
          Object.entries(shaderUniforms).forEach(([key, uniform]) => {
            if (mat.uniforms[key]) {
              mat.uniforms[key].value = uniform.value;
            }
          });
        }
      });
    });
  }, [gltf, shader, uniforms]);

  if (!gltf) return null;
  return (
    <primitive
      object={gltf.scene}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
    />
  );
};