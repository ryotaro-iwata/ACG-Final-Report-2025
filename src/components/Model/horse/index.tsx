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

// シェーダーファイルを読み込む
import vertexShader from "../../../shaders/test-toon/test-toon.vs?raw";
import fragmentShader from "../../../shaders/test-toon/test-toon.fs?raw";

type HorseProps = {
  // マテリアルのuniform用
  uniforms: {
    lightDirection: number[];
  };
  // オブジェクトのパラメータ用
  object: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number] | number;
  };
};

// 同じ元Materialからは同じToonShaderMaterialを再利用
const TOON_MATERIAL_CACHE = new WeakMap<Material, ShaderMaterial>();

function toToonShaderMaterial(src: Material) {
  const hit = TOON_MATERIAL_CACHE.get(src);
  if (hit) return hit;

  // 元マテリアルのプロパティを取得
  const m = src as unknown as {
    map?: unknown;
    color?: { clone: () => Color };
    transparent?: boolean;
    opacity?: number;
    side?: number;
    alphaTest?: number;
  };

  const toon = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      diffuse: { value: m.color?.clone?.() ?? new Color(0xffffff) },
      lightDirection: { value: new Vector3(1, 1, 1).normalize() },
      map: { value: m.map ?? null },
      hasTexture: { value: !!m.map },
      opacity: { value: m.opacity ?? 1.0 },
      // リムライト設定（赤っぽい光、控えめの強さ、広めの幅）
      rimColor: { value: new Color(0x44ff44) }, // 赤っぽい色
      rimPower: { value: 1.5 }, // 広めの幅（小さいほど広い）
      rimIntensity: { value: 0.3 }, // 控えめの強さ
    },
    transparent: m.transparent,
    side: m.side as never,
    alphaTest: m.alphaTest,
  });

  TOON_MATERIAL_CACHE.set(src, toon);
  return toon;
}

// アウトライン用の黒マテリアル（全Meshで共有）
const OUTLINE_MATERIAL = new MeshBasicMaterial({
  color: 0x000000,
  side: BackSide,
});

const Horse: FC<HorseProps> = (props) => {
  const [gltf, setGltf] = useState<GLTF | null>(null);
  useEffect(() => {
    const loader = new GLTFLoader();
    let cancelled = false;

    loader.load("/models/horse.gltf", (loadedGltf) => {
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

        // 元のマテリアルをカスタムToonShaderMaterialに変換
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map((m) => toToonShaderMaterial(m))
          : toToonShaderMaterial(mesh.material);

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
  }, []);

  useEffect(() => {
    if (!gltf) return;

    gltf.scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat) => {
        if (mat instanceof ShaderMaterial && mat.uniforms.lightDirection) {
          mat.uniforms.lightDirection.value = new Vector3(
            props.uniforms.lightDirection[0],
            props.uniforms.lightDirection[1],
            props.uniforms.lightDirection[2]
          ).normalize();
        }
      });
    });
  }, [gltf, props.uniforms.lightDirection[0], props.uniforms.lightDirection[1], props.uniforms.lightDirection[2]]);

  if (!gltf) return null;
  return (
    <primitive
      object={gltf.scene}
      position={props.object.position}
      rotation={props.object.rotation}
      scale={props.object.scale}
    />
  );
};
export default Horse;