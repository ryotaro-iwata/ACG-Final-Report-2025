import { useMemo } from "react";
import { useControls } from "leva";
import { testToonShader } from "../../../shaders/test-toon/test-toon";
import { DIRECTIONAL_LIGHT_POSITION } from "../../../const/DirectionalLight/params";
import { namelist } from "../_const/nameList";
import { OldCartoonShader } from "../../../shaders/oldcartoon/oldcartoon";
import { RainbowShader } from "../../../shaders/rainbow/rainbow";
import { VoronoiShader } from "../../../shaders/voronoi/voronoi";

export const useNormalRules = () => {
    const { lightX, lightY, lightZ } = useControls("Light Position", DIRECTIONAL_LIGHT_POSITION);

    const rules = useMemo(() => {
        // ここに共通ルールを書く
        const defaultDef = {
            shader: testToonShader,
            uniforms: {
                time: performance.now(),
                colorTint: [1, 0.5, 0.5],
                lightDirection: [lightX, lightY, lightZ],
                lightIntensity: 1.0,
            },
        };
        const overrides: Record<string, any> = {
            // ここに名前ごとの上書き設定を書く
            "backpack": {
                shader: VoronoiShader,
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