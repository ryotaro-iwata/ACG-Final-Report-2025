precision mediump float;

uniform vec3 diffuse;
uniform vec3 lightDirection;
uniform sampler2D map;
uniform bool hasTexture;
uniform float opacity;
uniform vec3 rimColor;
uniform float rimPower;
uniform float rimIntensity;

varying vec3 vNormal;
varying vec3 vViewPosition;
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
  
  // 4段階のトゥーンシェーディング（一致度が高いほど明るくする）
  float toonShade;
  if (NdotL > 0.75) {
    toonShade = 1.0;  // 255/255
  } else if (NdotL > 0.45) {
    toonShade = 0.69; // 176/255
  } else if (NdotL > 0.15) {
    toonShade = 0.376; // 96/255
  } else {
    toonShade = 0.125; // 32/255
  }
  
  // リムライト（広めの幅）
  //視線の向き（目へ向かう向き）
  vec3 viewDir = normalize(vViewPosition);
  //視線の向きと法線の不一致度0~1
  float rimDot = 1.0 - max(dot(viewDir, normal), 0.0);
  //不一致であるほど色を付ける（rimPowerが大きいと狭い範囲にだけ色がつく）
  float rimAmount = pow(rimDot, rimPower) * rimIntensity;
  vec3 rim = rimColor * rimAmount;
  
  // 最終カラー合成
  vec3 finalColor = baseColor.rgb * toonShade + rim;

  gl_FragColor = vec4(finalColor, baseColor.a * opacity);
}