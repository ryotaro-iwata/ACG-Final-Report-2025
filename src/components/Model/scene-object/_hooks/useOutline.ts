import { useEffect, useMemo } from "react";
import { Object3D, Mesh } from "three";
import { OUTLINE_MATERIAL } from "../_utils/material";
import { useControls } from "leva";
import { OUTLINE_ACTIVE, OUTLINE_COLOR, OUTLINE_WEIGHT } from "../../../../const/SceneObject/params";

export const useOutline = (scene: Object3D | undefined) => {
    const { outlineWeight } = useControls("Outline_weight", OUTLINE_WEIGHT);
    const { outlineActive } = useControls("Outline_active", OUTLINE_ACTIVE);
    const { outlineColor } = useControls("Outline_color", OUTLINE_COLOR);

    const material = useMemo(() => OUTLINE_MATERIAL.clone(), [])

    useEffect(() => {
        if (!scene) return;
        if (!outlineActive) return;
        const outlines: Mesh[] = [];

        scene.traverse((obj) => {
            // SkinnedMesh除外などの条件    
            if ((obj as any).isSkinnedMesh) return;
            if (!(obj as Mesh).isMesh) return;

            const mesh = obj as Mesh;

            const outlineMesh = new Mesh(mesh.geometry, material);

            outlineMesh.position.copy(mesh.position);
            outlineMesh.rotation.copy(mesh.rotation);
            outlineMesh.scale.copy(mesh.scale);
            outlineMesh.scale.multiplyScalar(outlineWeight);
            outlineMesh.renderOrder = -1;

            if (mesh.parent) {
                mesh.parent.add(outlineMesh);
                outlines.push(outlineMesh);
            }
        });

        return () => {
            outlines.forEach((o) => o.removeFromParent());
        };
    }, [scene, outlineWeight, outlineActive, material]);

    useEffect(() => {
        material.color.set(outlineColor);
    }, [outlineColor, material]);

};