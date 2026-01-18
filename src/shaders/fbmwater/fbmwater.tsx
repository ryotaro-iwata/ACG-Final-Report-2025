import { Color, Vector3 } from "three";
import vertexShader from "./fbmwater.vs?raw";
import fragmentShader from "./fbmwater.fs?raw";
import type { ShaderDefinition } from "../../types/shader";

// このシェーダーで使用するuniformの型を定義
//isPastel: パステルカラーにするか？
//pasteIntensity: 0~1. パステルカラーの強さ
//noiseScale: ノイズの粗さ。多分デカいほど粗くなる
export type fBMWaterUniforms = {
  lightDirection: [number, number, number];
  lightIntensity: number;
  time: number;
  noiseScale: number;
  isPastel: boolean;
  pastelIntensity: number;
  hasTime: boolean;
};

// シェーダー定義オブジェクトを作成・エクスポート
export const fBMWaterShader: ShaderDefinition<fBMWaterUniforms> = {
  // 頂点シェーダーのコード
  vertexShader,
  
  // フラグメントシェーダーのコード
  fragmentShader,
  
  // デフォルト値
  defaultUniforms: {
    lightDirection: [1, 1, 1],
    lightIntensity: 1.0,
    time: 0.0,
    noiseScale: 1.0,
    isPastel: false,
    pastelIntensity: 0.3,
    hasTime: false,
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
    noiseScale:{
      value: values.noiseScale ?? 1.0
    },
    isPastel:{
      value: values.isPastel ?? false
    },
    pastelIntensity:{
      value: values.pastelIntensity ?? 0.3
    },
    hasTime:{
      value: values.hasTime ?? false
    }
  }),
};