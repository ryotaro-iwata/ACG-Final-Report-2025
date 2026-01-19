import { Material, ShaderMaterial, Color, BackSide, MeshBasicMaterial } from "three";
import type { ShaderDefinition } from "../../../../types/shader";

const SHADER_CACHE = new WeakMap<object, WeakMap<Material, ShaderMaterial>>();

export const OUTLINE_MATERIAL = new MeshBasicMaterial({
    color: 0x000000,
    side: BackSide,
});

export function createShaderMaterial<T>(
    src: Material,
    shader: ShaderDefinition<T>,
    uniformValues: Partial<T>
): ShaderMaterial {
    let materialCache = SHADER_CACHE.get(shader);
    if (!materialCache) {
        materialCache = new WeakMap();
        SHADER_CACHE.set(shader, materialCache);
    }
    const cached = materialCache.get(src);
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

    materialCache.set(src, material);
    return material;
}