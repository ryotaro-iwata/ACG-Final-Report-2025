import { useMemo } from "react";
import { useControls } from "leva";
import { testToonShader } from "../../../shaders/test-toon/test-toon";
import { DIRECTIONAL_LIGHT_POSITION } from "../../../const/DirectionalLight/params";
import { OldCartoonShader } from "../../../shaders/oldcartoon/oldcartoon";
import { RainbowShader } from "../../../shaders/rainbow/rainbow";
// import type { ShaderRule } from "../../types/shader";

export const useNormalRules = () => {
    const { lightX, lightY, lightZ } = useControls("Light Position", DIRECTIONAL_LIGHT_POSITION);

    const rules = useMemo(() => {
        // ここに共通ルールを書く
        const defaultDef = {
            shader: testToonShader,
            uniforms: {
                colorTint: [1, 0.5, 0.5],
                lightDirection: [lightX, lightY, lightZ],
                lightIntensity: 3.0,
            },
        };

        return [
            {
                ...defaultDef,
                name: "shrimp",
                // 個別の設定があればここで上書き
                shader: OldCartoonShader
            },
            {
                ...defaultDef,
                name: "myakumyaku",
                shader: RainbowShader
            },
            {
                ...defaultDef,
                name: "bed",
                shader: testToonShader
            },
        ];
    }, [lightX, lightY, lightZ]); // 依存配列には変化する値を入れる

    return rules;
};