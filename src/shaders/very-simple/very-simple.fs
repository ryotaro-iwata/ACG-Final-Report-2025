precision mediump float;

uniform vec3 diffuse;
uniform vec3 lightDirection;
uniform float lightIntensity;
uniform sampler2D map;
uniform bool hasTexture;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
  // ベースカラー（テクスチャまたは単色）
  vec4 baseColor = hasTexture ? texture2D(map, vUv) : vec4(diffuse, 1.0);
  
  // その部分での法線
  vec3 normal = normalize(vNormal);
  //ライトの向き（ライトへ向かう向き）
  vec3 lightDir = normalize(lightDirection);
  //内積（法線とライトの向きの一致度0~1と考えれば良い）
  float NdotL = dot(normal, lightDir);
  
  vec3 finalColor=baseColor.xyz*max(NdotL,0.0);
  finalColor*=lightIntensity;

  gl_FragColor = vec4(finalColor, baseColor.a);
}