// shaders/testToonShader.ts
import { Color, Vector3 } from "three";
import vertexShader from "./test-toon.vs?raw";
import fragmentShader from "./test-toon.fs?raw";
import type { ShaderDefinition } from "../../types/shader";

// このシェーダーで使用するuniformの型を定義
// rimPower: リムの範囲
// rimIntensity: リムの強さ
// color: 追加色
// color: 追加のタイプ 0:塗りつぶし, 1:加算, 2:乗算
export type TestToonUniforms = {
  lightDirection: [number, number, number];
  lightIntensity: number;
  rimColor?: [number, number, number];
  rimPower?: number;
  rimIntensity?: number;
  color?: [number,number,number],
  colorType?: number
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
    lightIntensity: 1.0,
    rimColor: [1.0, 1.0, 1.0],
    rimPower: 1.5,
    rimIntensity: 0.0,
    color: [0.0,0.0,0.0],
    colorType: 0
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
    rimColor: {
      value: new Color().fromArray(values.rimColor ?? [1.0, 1.0, 1.0]),
    },
    rimPower: { 
      value: values.rimPower ?? 1.5 
    },
    rimIntensity: { 
      value: values.rimIntensity ?? 0.30
    },
    color:{
      value: values.color ?? [0.0,0.0,0.0]
    },
    colorType:{
      value: values.colorType ?? 0
    }
  }),
};