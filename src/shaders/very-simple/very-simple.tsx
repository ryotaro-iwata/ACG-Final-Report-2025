import { Color, Vector3 } from "three";
import vertexShader from "./very-simple.vs?raw";
import fragmentShader from "./very-simple.fs?raw";
import type { ShaderDefinition } from "../../types/shader";

// このシェーダーで使用するuniformの型を定義
export type VerySimpleUniforms = {
  lightDirection: [number, number, number];
  lightIntensity: number;
};

// シェーダー定義オブジェクトを作成・エクスポート
export const verySimpleShader: ShaderDefinition<VerySimpleUniforms> = {
  // 頂点シェーダーのコード
  vertexShader,
  
  // フラグメントシェーダーのコード
  fragmentShader,
  
  // デフォルト値
  defaultUniforms: {
    lightDirection: [1, 1, 1],
    lightIntensity: 1.0,
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
    lightIntensity:{
        value: values.lightIntensity ?? 1.0
    },
  }),
};