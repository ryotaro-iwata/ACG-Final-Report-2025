import type { ShaderMaterialParameters } from "three";

export type ShaderDefinition<T = Record<string, any>> = {
  vertexShader: string;
  fragmentShader: string;
  defaultUniforms: T;
  createUniforms: (values: Partial<T>) => Record<string, { value: any }>;
};