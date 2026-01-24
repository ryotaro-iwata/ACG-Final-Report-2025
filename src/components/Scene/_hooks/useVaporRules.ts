import { useMemo } from "react";
import { useControls } from "leva";
import { DIRECTIONAL_LIGHT_POSITION } from "../../../const/DirectionalLight/params";
import { namelist } from "../_const/nameList";
import { RainbowShader } from "../../../shaders/rainbow/rainbow";
import { testToonShader } from "../../../shaders/test-toon/test-toon";

export const useVaporRules = () => {
	const { lightX, lightY, lightZ } = useControls(
		"Light Position",
		DIRECTIONAL_LIGHT_POSITION,
	);

	const rules = useMemo(() => {
		// ここに共通ルールを書く
		const defaultDef = {
			shader: testToonShader,
			uniforms: {
				time: performance.now(),
				colorTint: [1, 0.5, 0.5],
				lightDirection: [lightX, lightY, lightZ],
				lightIntensity: 1.0,
				color: [1.0, 0.2, 0.85],
				colorType: 1,
			},
		};
		const overrides: Record<string, any> = {
			// ここに名前ごとの上書き設定を書く
			myakumyaku: {
				shader: RainbowShader,
			},
			earth_ball: {
				shader: RainbowShader,
			},
			acoustic_guitar: {
				shader: RainbowShader,
			},
			backpack: {
				shader: RainbowShader,
			},
			penguin: {
				shader: RainbowShader,
			},
			daruma: {
				shader: RainbowShader,
			},
            monitor: {
				shader: RainbowShader,
			},
		};
		return [
			...namelist.map((name) => {
				const override = overrides[name] || {};
				return {
					...defaultDef,
					...override,
					name: name,
				};
			}),
		];
	}, [lightX, lightY, lightZ]); // 依存配列には変化する値を入れる

	return rules;
};
