import { Color, Vector3 } from "three";
import vertexShader from "./noise.vs?raw";
import fragmentShader from "./noise.fs?raw";
import type { ShaderDefinition } from "../../types/shader";

// このシェーダーで使用するuniformの型を定義
export type NoiseUniforms = {
  lightDirection: [number, number, number];
  lightIntensity: number;
  time: number;
  noiseIntensity: number;
  noiseScale: number;
  gray: boolean;
};

// シェーダー定義オブジェクトを作成・エクスポート
export const NoiseShader: ShaderDefinition<NoiseUniforms> = {
  // 頂点シェーダーのコード
  vertexShader,
  
  // フラグメントシェーダーのコード
  fragmentShader,
  
  // デフォルト値
  defaultUniforms: {
    lightDirection: [1, 1, 1],
    lightIntensity: 1.0,
    time: 0.0,
    noiseIntensity: 2.0,
    noiseScale: 10.0,
    gray: false
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
    time:{
        value: values.time ?? 0.0
    },
    noiseIntensity:{
      value: values.noiseIntensity ?? 2.0
    },
    noiseScale:{
      value: values.noiseScale ?? 10.0
    },
    gray:{
      value: values.gray ?? false
    }
  }),
};