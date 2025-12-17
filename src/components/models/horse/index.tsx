import { type FC, useState, useEffect } from "react";
import {
    DataTexture,
    Mesh,
    MeshBasicMaterial,
    MeshToonMaterial,
    NearestFilter,
    NoColorSpace,
    BackSide,
    type Material,
} from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";

// 影の「段階」をハッキリ出すために、連続グラデーションではなく段階のみのランプを生成
// NOTE: モデル数が増えても毎回作らないようにモジュールスコープで共有する
const TOON_GRADIENT_MAP = (() => {
    const levels = 4;
    // 0..255の明度を段階で定義（好みで調整OK）
    const steps = [32, 96, 176, 255];
    const data = new Uint8Array(levels * 4);
    for (let i = 0; i < levels; i++) {
        const v = steps[i] ?? Math.round((i / (levels - 1)) * 255);
        const o = i * 4;
        data[o + 0] = v;
        data[o + 1] = v;
        data[o + 2] = v;
        data[o + 3] = 255;
    }

    const tex = new DataTexture(data, levels, 1);
    tex.minFilter = NearestFilter;
    tex.magFilter = NearestFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = NoColorSpace;
    tex.needsUpdate = true;
    return tex;
})();

// 同じ元Materialからは同じToonMaterialを再利用（Mesh数が多いほど効く）
// skinned / unskinned はシェーダdefineが変わるので別キャッシュにする
const TOON_MATERIAL_CACHE = new WeakMap<
    Material,
    { skinned?: MeshToonMaterial; unskinned?: MeshToonMaterial }
>();

function toToonMaterial(src: Material, isSkinned: boolean) {
    const cached = TOON_MATERIAL_CACHE.get(src) ?? {};
    const key = isSkinned ? "skinned" : "unskinned";
    const hit = cached[key];
    if (hit) return hit;

    // 元マテリアルのテクスチャ/色などは可能な範囲で引き継ぐ
    const m = src as unknown as {
        map?: unknown;
        color?: { clone: () => unknown };
        transparent?: boolean;
        opacity?: number;
        side?: number;
        alphaTest?: number;
    };

    const toon = new MeshToonMaterial({
        map: m.map as never,
        color: (m.color?.clone?.() as never) ?? undefined,
        transparent: m.transparent,
        opacity: m.opacity,
        side: m.side as never,
        alphaTest: m.alphaTest,
        gradientMap: TOON_GRADIENT_MAP,
    });

    // threeの型定義上は存在しない扱いになるためanyで回避（実体としては有効）
    if (isSkinned) (toon as unknown as { skinning: boolean }).skinning = true;

    cached[key] = toon;
    TOON_MATERIAL_CACHE.set(src, cached);
    return toon;
}

// アウトライン用の黒マテリアル（全Meshで共有）
const OUTLINE_MATERIAL = new MeshBasicMaterial({
    color: 0x000000,
    side: BackSide,
});

const Horse: FC = () => {
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

                // 元のマテリアルをToonMaterialに変換
                mesh.material = Array.isArray(mesh.material)
                    ? mesh.material.map((m) => toToonMaterial(m, !!mesh.isSkinnedMesh))
                    : toToonMaterial(mesh.material, !!mesh.isSkinnedMesh);

                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // SkinnedMeshの場合はアウトライン処理をスキップ（複雑なため）
                if (mesh.isSkinnedMesh) return;

                // アウトライン用のMeshを複製
                // 同じgeometryを使い、黒のBackSideマテリアルで裏面描画、少し拡大
                const outlineMesh = new Mesh(mesh.geometry as never, OUTLINE_MATERIAL);
                // 元のMeshのtransformをコピーしてから、scaleだけ1.01倍に拡大
                outlineMesh.position.copy((mesh as Mesh).position);
                outlineMesh.rotation.copy((mesh as Mesh).rotation);
                outlineMesh.scale.copy((mesh as Mesh).scale);
                outlineMesh.scale.multiplyScalar(1.01); // 元のscaleに1.01を掛ける
                // アウトラインを先に描画するようにrenderOrderを設定
                outlineMesh.renderOrder = -1;

                // 元のMeshの親に追加（同じtransformが適用される）
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
    if (!gltf) return null;
    return <primitive object={gltf.scene} />;
};
export default Horse;
