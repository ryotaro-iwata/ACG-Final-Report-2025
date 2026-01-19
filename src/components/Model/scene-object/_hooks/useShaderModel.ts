import { useEffect, useRef } from "react";
import { Object3D, Mesh, ShaderMaterial, Material } from "three";
import type { ShaderDefinition } from "../../../../types/shader";
import { createShaderMaterial } from "../_utils/material";
import { useFrame } from "@react-three/fiber";

export const useShaderModel = <T>(
    scene: Object3D | undefined,
    shader: ShaderDefinition<T>,
    uniforms: Partial<T>
) => {

    // マテリアルの参照を保持する配列
    const materialRef = useRef<ShaderMaterial[]>([]);

    // マテリアルの置換
    useEffect(() => {
        if (!scene) return;

        materialRef.current = [];

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
            const newMaterials = originalMaterials.map((m) => {
                const mat = createShaderMaterial(m, shader, uniforms)
                materialRef.current.push(mat);
                return mat;
            });
            mesh.material = Array.isArray(sourceMaterial) ? newMaterials : newMaterials[0];

        });
    }, [scene, shader]); // uniformsは依存配列に入れない

    // uniformsの更新
    useEffect(() => {
        const nextUniforms = shader.createUniforms(uniforms);

        materialRef.current.forEach((mat) => {
            Object.entries(nextUniforms).forEach(([key, u]) => {
                if (mat.uniforms[key]) {
                    mat.uniforms[key].value = u.value;
                }
            });
        });
    }, [shader, uniforms]);

    // 毎フレームの更新
    useFrame((state) => {
        const time = state.clock.elapsedTime;
        materialRef.current.forEach((mat) => {
            // time uniformがあれば更新
            if (mat.uniforms.time) {
                mat.uniforms.time.value = time;
            }
        })
    })
};