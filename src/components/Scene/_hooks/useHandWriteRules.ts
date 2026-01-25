import { useMemo } from "react";
import { useControls } from "leva";
import { DIRECTIONAL_LIGHT_POSITION } from "../../../const/DirectionalLight/params";
import { namelist } from "../_const/nameList";
import { OldCartoonShader } from "../../../shaders/oldcartoon/oldcartoon";
import { RainbowShader } from "../../../shaders/rainbow/rainbow";
import { fBMWaterShader } from "../../../shaders/fbmwater/fbmwater";
import { VoronoiShader } from "../../../shaders/voronoi/voronoi";

export const useHandWriteRules = () => {
    const { lightX, lightY, lightZ } = useControls("Light Position", DIRECTIONAL_LIGHT_POSITION);

    const rules = useMemo(() => {
        // ここに共通ルールを書く
        const defaultDef = {
            shader: fBMWaterShader,
            uniforms: {
                time: performance.now(),
                colorTint: [1, 0.5, 0.5],
                lightDirection: [lightX, lightY, lightZ],
                lightIntensity: 1.0,
                noiseScale: 5.0,
                isPastel: true,
                pastelIntensity: 0.001
            },
        };
        const overrides: Record<string, any> = {
            // ここに名前ごとの上書き設定を書く
            "acoustic_guitar": {
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    noiseScale: 5.0,
                    isPastel: true,
                    pastelIntensity: 0.2
                }
            },
            "air_conditionor": {},
            "backpack": {},
            "bed": {
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    noiseScale: 3.0,
                    isPastel: true,
                    pastelIntensity: 0.001
                }
            },
            "book_shell": {
                shader: fBMWaterShader,
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    noiseScale: 4.0,
                    isPastel: true,
                    pastelIntensity: 0.1
                }
            },
            "books1": {},
            "books2": {},
            "books3": {},
            "cactus1": {},
            "cactus2": {},
            "calendar": {},
            "chair": {
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    noiseScale: 2.0,
                    isPastel: true,
                    pastelIntensity: 0.001
                }
            },
            "chest": {},
            "clock": {},
            "coffee_cup": {

            },
            "cushion1": {},
            "cushion2": {},
            "daruma": {},
            "desk_clock": {},
            "diffuser": {},
            "earth_ball": {
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    noiseScale: 3.0,
                    isPastel: true,
                    pastelIntensity: 0.001
                }
            },
            "floor": {
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    noiseScale: 2.0,
                    isPastel: true,
                    pastelIntensity: 0.1
                }
            },
            "game": {},
            "keyboard": {
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    noiseScale: 0.5,
                    isPastel: true,
                    pastelIntensity: 0.1
                }
            },
            "kirby": {},
            "mat": {},
            "monitor": {},
            "monitor_stand": {},
            "mouse": {},
            "myakumyaku": {},
            "penguin": {},
            "pillow": {},
            "record_player": {
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    noiseScale: 2.0,
                    isPastel: true,
                    pastelIntensity: 0.001
                }
            },
            "shrimp": {
                shader: VoronoiShader,
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    voronoiScale: 50.0,
                    voronoiIntensity: 1.0
                }
            },
            "smartphone": {},
            "speaker": {
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    noiseScale: 1.5,
                    isPastel: true,
                    pastelIntensity: 0.1
                }
            },
            "stand": {
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    noiseScale: 1.0,
                    isPastel: true,
                    pastelIntensity: 0.1
                }
            },
            "stool": {
            },
            "table": {
                uniforms: {
                    time: performance.now(),
                    colorTint: [1, 0.5, 0.5],
                    lightDirection: [lightX, lightY, lightZ],
                    lightIntensity: 1.0,
                    noiseScale: 2.0,
                    isPastel: true,
                    pastelIntensity: 0.2
                }
            },
            "tv": {},
            "wall1": {

            },
            "wall2": {

            },
        }
        return [
            ...namelist.map((name) => {
                const override = overrides[name] || {};
                return {
                    ...defaultDef,
                    ...override,
                    name: name
                };
            })
        ];
    }, [lightX, lightY, lightZ]); // 依存配列には変化する値を入れる

    return rules;
};