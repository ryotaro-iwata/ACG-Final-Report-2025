// shaders/testToonShader.ts
import { Color, Vector3 } from "three";
import vertexShader from "./test-toon.vs?raw";
import fragmentShader from "./test-toon.fs?raw";
import type { ShaderDefinition } from "../../types/shader";

// このシェーダーで使用するuniformの型を定義
export type TestToonUniforms = {
  lightDirection: [number, number, number];
  rimColor?: [number, number, number];
  rimPower?: number;
  rimIntensity?: number;
};

// シェーダー定義オブジェクトを作成・エクスポート
export const testToonShader: ShaderDefinition<TestToonUniforms> = {
  // 頂点シェーダーのコード
  vertexShader,
  
  // フラグメントシェーダーのコード
  fragmentShader,
  
  // デフォルト値
  defaultUniforms: {
    lightDirection: [1, 1, 1],
    rimColor: [0.27, 1.0, 0.27],
    rimPower: 1.5,
    rimIntensity: 0.3,
  },
  
  // uniform値をThree.jsのuniform形式に変換する関数
  createUniforms: (values) => ({
    lightDirection: {
      value: new Vector3(
        values.lightDirection?.[0] ?? 1,
        values.lightDirection?.[1] ?? 1,
        values.lightDirection?.[2] ?? 1
      ).normalize(),
    },
    rimColor: {
      value: new Color().fromArray(values.rimColor ?? [0.27, 1.0, 0.27]),
    },
    rimPower: { 
      value: values.rimPower ?? 1.5 
    },
    rimIntensity: { 
      value: values.rimIntensity ?? 0.3 
    },
  }),
};