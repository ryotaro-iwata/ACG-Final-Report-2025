// shaders/somethingShader.ts
import { Color, Vector3 } from "three";
import vertexShader from "./something.vs?raw";
import fragmentShader from "./something.fs?raw";
import type { ShaderDefinition } from "../../types/shader";

// このシェーダーで使用するuniformの型を定義
export type SomethingUniforms = {
  lightDirection: [number, number, number];
  lightIntensity: number;
  rimColor?: [number, number, number];
  rimPower?: number;
  rimIntensity?: number;
  voronoiScale?: number;
  voronoiIntensity?: number;
};

// シェーダー定義オブジェクトを作成・エクスポート
export const SomethingShader: ShaderDefinition<SomethingUniforms> = {
  // 頂点シェーダーのコード
  vertexShader,
  
  // フラグメントシェーダーのコード
  fragmentShader,
  
  // デフォルト値
  defaultUniforms: {
    lightDirection: [1, 1, 1],
    lightIntensity: 1.0,
    rimColor: [0.7, 0.2, 0.0],
    rimPower: 1.5,
    rimIntensity: 0.0,
    voronoiScale: 10.0,
    voronoiIntensity: 0.4,
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
      value: new Vector3(
        values.rimColor?.[0] ?? 0.7,
        values.rimColor?.[1] ?? 0.2,
        values.rimColor?.[2] ?? 0.0
      )
    },
    rimPower: { 
      value: values.rimPower ?? 1.5 
    },
    rimIntensity: { 
      value: values.rimIntensity ?? 0.3 
    },
    voronoiScale: { 
      value: values.voronoiScale ?? 10.0
    },
    voronoiIntensity: { 
      value: values.voronoiIntensity ?? 0.4
    },
  }),
};