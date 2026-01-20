export type ShaderDefinition<T = Record<string, any>> = {
  vertexShader: string;
  fragmentShader: string;
  defaultUniforms: T;
  createUniforms: (values: Partial<T>) => Record<string, { value: any }>;
};

export type ShaderRule = {
  name: string;
  shader: ShaderDefinition;
  uniforms: Record<string, any>;
}
