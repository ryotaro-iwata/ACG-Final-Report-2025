// hooks/useOutline.ts
import { useEffect } from "react";
import { Object3D, Mesh } from "three";
import { OUTLINE_MATERIAL } from "../_utils/material";

export const useOutline = (scene: Object3D | undefined) => {
    useEffect(() => {
        if (!scene) return;

        const outlines: Mesh[] = [];

        scene.traverse((obj) => {
            // SkinnedMesh除外などの条件
            if ((obj as any).isSkinnedMesh) return;
            if (!(obj as Mesh).isMesh) return;

            const mesh = obj as Mesh;

            const outlineMesh = new Mesh(mesh.geometry, OUTLINE_MATERIAL);
            // 親のトランスフォームに追従させるため、単純にaddするだけにするか、
            // world行列をコピーするかは構成次第ですが、元のコードに倣います
            outlineMesh.position.copy(mesh.position);
            outlineMesh.rotation.copy(mesh.rotation);
            outlineMesh.scale.copy(mesh.scale);
            outlineMesh.scale.multiplyScalar(1.01);
            outlineMesh.renderOrder = -1;

            // 元のコードでは parent に add していました
            if (mesh.parent) {
                mesh.parent.add(outlineMesh);
                outlines.push(outlineMesh);
            }
        });

        return () => {
            outlines.forEach((o) => o.removeFromParent());
        };
    }, [scene]);
};