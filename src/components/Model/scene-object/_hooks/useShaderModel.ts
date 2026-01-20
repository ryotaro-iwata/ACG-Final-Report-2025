import { useEffect, useRef } from "react";
import { Object3D, Mesh, ShaderMaterial, Material } from "three";
import type { ShaderRule } from "../../../../types/shader";
import { createShaderMaterial } from "../_utils/material";
import { useFrame } from "@react-three/fiber";

export const useShaderModel = (
    scene: Object3D | undefined,
    rules: ShaderRule[]
) => {

    // マテリアルの参照を保持する配列
    const materialRef = useRef<{ mat: ShaderMaterial; ruleName: string }[]>([]);

    // マテリアルの置換
    useEffect(() => {
        if (!scene) return;

        materialRef.current = [];

        scene.traverse((obj) => {
            // debug
            // if ((obj as Mesh).isMesh) {
            //     console.log(`[Debug] Found Mesh: "${obj.name}" | Parent: "${obj.parent?.name}"`);
            // }

            const mesh = obj as Mesh;
            if (!mesh.isMesh || !mesh.material || !mesh.geometry) return;

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // マッチング処理
            // 自分か親がルール名を含んでいれば適用
            const findRuleRecursive = (targetObj: Object3D | null): ShaderRule | undefined => {
                if (!targetObj) return undefined;
                const found = rules.find((rule) => targetObj.name.includes(rule.name));
                if (found) return found;
                return findRuleRecursive(targetObj.parent);
            }
            const matchedRule = findRuleRecursive(mesh);

            if (!matchedRule) return;

            // バックアップ
            if (!mesh.userData.originalMaterial) {
                mesh.userData.originalMaterial = mesh.material;
            }

            const sourceMaterial = mesh.userData.originalMaterial as Material | Material[];
            const originalMaterials = Array.isArray(sourceMaterial) ? sourceMaterial : [sourceMaterial];

            const newMaterials = originalMaterials.map((m) => {
                const mat = createShaderMaterial(m, matchedRule.shader, matchedRule.uniforms);

                materialRef.current.push({ mat, ruleName: matchedRule.name });
                return mat;
            });

            mesh.material = Array.isArray(sourceMaterial) ? newMaterials : newMaterials[0];

        });
    }, [scene, rules]); // uniformsは依存配列に入れない

    // uniformsの更新
    useEffect(() => {
        materialRef.current.forEach(({ mat, ruleName }) => {
            const targetRule = rules.find((r) => r.name === ruleName);
            if (!targetRule) return;

            const nextUniforms = targetRule.shader.createUniforms(targetRule.uniforms);
            Object.entries(nextUniforms).forEach(([key, u]) => {
                if (mat.uniforms[key]) {
                    mat.uniforms[key].value = u.value;
                }
            });
        });
    }, [rules]);

    // 毎フレームの更新
    useFrame((state) => {
        const time = state.clock.elapsedTime;
        materialRef.current.forEach(({ mat }) => {
            // time uniformがあれば更新
            if (mat.uniforms.time) {
                mat.uniforms.time.value = time;
            }
        })
    })
};