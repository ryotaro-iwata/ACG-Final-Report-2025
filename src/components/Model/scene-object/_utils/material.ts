import { Material, ShaderMaterial, Color, BackSide, MeshBasicMaterial } from "three";
import type { ShaderDefinition } from "../../../../types/shader";

// マテリアルキャッシュ（グローバルまたはContextで管理しても良い）
const MATERIAL_CACHE = new WeakMap<Material, ShaderMaterial>();

export const OUTLINE_MATERIAL = new MeshBasicMaterial({
    color: 0x000000,
    side: BackSide,
});

export function createShaderMaterial<T>(
    src: Material,
    shader: ShaderDefinition<T>,
    uniformValues: Partial<T>
): ShaderMaterial {
    const cached = MATERIAL_CACHE.get(src);
    if (cached) return cached;

    const m = src as any;
    const shaderUniforms = shader.createUniforms(uniformValues);

    const material = new ShaderMaterial({
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        uniforms: {
            diffuse: { value: m.color?.clone?.() ?? new Color(0xffffff) },
            map: { value: m.map ?? null },
            hasTexture: { value: !!m.map },
            opacity: { value: m.opacity ?? 1.0 },
            ...shaderUniforms,
        },
        transparent: m.transparent,
        side: m.side,
        alphaTest: m.alphaTest,
    });

    MATERIAL_CACHE.set(src, material);
    return material;
}