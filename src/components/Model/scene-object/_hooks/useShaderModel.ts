import { useEffect } from "react";
import { Object3D, Mesh, ShaderMaterial, Material } from "three";
import type { ShaderDefinition } from "../../../../types/shader";
import { createShaderMaterial } from "../_utils/material";

export const useShaderModel = <T>(
    scene: Object3D | undefined,
    shader: ShaderDefinition<T>,
    uniforms: Partial<T>
) => {
    // マテリアルの置換
    useEffect(() => {
        if (!scene) return;

        scene.traverse((obj) => {
            const mesh = obj as Mesh;
            if (!mesh.isMesh || !mesh.material || !mesh.geometry) return;

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (!mesh.userData.originalMaterial) {
                mesh.userData.originalMaterial = mesh.material;
            }

            const sourceMaterial = mesh.userData.originalMaterial as Material | Material[];
            const originalMaterials = Array.isArray(sourceMaterial) ? sourceMaterial : [sourceMaterial];
            const newMaterials = originalMaterials.map((m) =>
                createShaderMaterial(m, shader, uniforms)
            );

            mesh.material = Array.isArray(sourceMaterial) ? newMaterials : newMaterials[0];

        });
    }, [scene, shader]); // uniformsは依存配列に入れない

    // Uniformの値だけを書き換え
    useEffect(() => {
        if (!scene) return;

        // Shader定義から最新のUniformオブジェクトを生成（値の参照用）
        const nextUniforms = shader.createUniforms(uniforms);

        scene.traverse((obj) => {
            const mesh = obj as Mesh;
            if (!mesh.isMesh) return;

            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

            materials.forEach((mat) => {
                if (mat instanceof ShaderMaterial) {
                    Object.entries(nextUniforms).forEach(([key, u]) => {
                        if (mat.uniforms[key]) {
                            mat.uniforms[key].value = u.value;
                        }
                    });
                }
            });
        });
    }, [scene, shader, uniforms]);
};