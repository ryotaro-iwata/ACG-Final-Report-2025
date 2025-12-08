import { type FC, useState, useEffect } from "react";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";

const Model: FC = () => {
    const [gltf, setGltf] = useState<GLTF | null>(null);
    useEffect(() => {
        const loader = new GLTFLoader();
        loader.load("/models/assets.gltf", (loadedGltf) => {
            setGltf(loadedGltf);
        });
    }, []);
    if (!gltf) return null;
    return <primitive object={gltf.scene} />;
}

export default Model;