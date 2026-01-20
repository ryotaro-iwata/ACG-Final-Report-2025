import { useMemo } from "react";
import { useControls } from "leva";
import { DIRECTIONAL_LIGHT_POSITION } from "../../../const/DirectionalLight/params";
import { namelist } from "../_const/nameList";
import { OldCartoonShader } from "../../../shaders/oldcartoon/oldcartoon";
import { RainbowShader } from "../../../shaders/rainbow/rainbow";
import { fBMWaterShader } from "../../../shaders/fbmwater/fbmwater";

export const useVaporRules = () => {
    const { lightX, lightY, lightZ } = useControls("Light Position", DIRECTIONAL_LIGHT_POSITION);

    const rules = useMemo(() => {
        // ここに共通ルールを書く
        const defaultDef = {
            shader: fBMWaterShader,
            uniforms: {
                time: performance.now(),
                colorTint: [1, 0.5, 0.5],
                lightDirection: [lightX, lightY, lightZ],
                lightIntensity: 3.0,
            },
        };
        const overrides: Record<string, any> = {
            // ここに名前ごとの上書き設定を書く
            "myakumyaku": {
                shader: RainbowShader,
            },
            "kirby": {
                shader: OldCartoonShader
            },
            "backpack": {
                shader: RainbowShader,
            },
            "penguin": {
                shader: RainbowShader
            }
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