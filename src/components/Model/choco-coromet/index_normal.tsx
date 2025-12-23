import { type GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import { useState, useEffect } from "react";
import { DoubleSide, type Material } from "three";

const ChocoCoromet = () => {
  const [gltf, setGltf] = useState<GLTF | null>(null);
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load("/models/assets.gltf", (loadedGltf) => {

      loadedGltf.scene.traverse((obj) => {
        const mesh = obj as unknown as {
          isMesh?: boolean;
          material?: Material | Material[];
        };
        if (!mesh.isMesh || !mesh.material) return;

        const forceOpaque = (mat: Material) => {
          const m = mat as unknown as {
            transparent?: boolean;
            opacity?: number;
            depthWrite?: boolean;
            alphaTest?: number;
            side?: number;
            needsUpdate?: boolean;
          };
          m.transparent = false;
          m.opacity = 1;
          m.depthWrite = true;
          m.alphaTest = 0;
          m.side = DoubleSide;
          m.needsUpdate = true;
        };

        if (Array.isArray(mesh.material)) mesh.material.forEach(forceOpaque);
        else forceOpaque(mesh.material);
      });

      setGltf(loadedGltf);
    });
  }, []);
  if (!gltf) return null;
  return <primitive object={gltf.scene} />;
};

export default ChocoCoromet;
