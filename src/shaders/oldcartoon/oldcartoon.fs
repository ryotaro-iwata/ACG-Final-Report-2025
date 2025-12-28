precision mediump float;

uniform vec3 diffuse;
uniform vec3 lightDirection;
uniform float lightIntensity;
uniform sampler2D map;
uniform bool hasTexture;

varying vec3 vNormal;
varying vec2 vUv;

// マット寄りトゥーン陰影
float toonShade(float x) {
  if (x > 0.9) return 0.75;
  if (x > 0.5) return 0.55;
  if (x > 0.25) return 0.35;
  return 0.2;
}

// 黒斜線
float hatch(vec2 uv, float scale) {
  float v = sin((uv.x + uv.y) * scale);
  return step(0.7, v);
}

// 疑似ノイズ（ざらざら）
float noise(vec2 uv) {
  return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec4 baseColor = hasTexture ? texture2D(map, vUv)
                              : vec4(diffuse, 1.0);

  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(lightDirection);

  float NdotL = max(dot(normal, lightDir), 0.0);
  float toon = toonShade(NdotL) * lightIntensity;
  toon = min(toon, 0.85);

  vec3 color = baseColor.rgb * toon;

  // ===== 影判定 =====
  float isShadow = 1.0 - step(0.45, toon);

  // ===== 黒ハッチ =====
  float lineMask = hatch(vUv * 10.0, 250.0) * isShadow;
  color = mix(color, vec3(0.0), lineMask);

  // ===== ざらざら =====
  float grain = (noise(vUv * 800.0) - 0.5) * 0.3;
  grain *= mix(0.3, 1.0, isShadow); // 影ほど強く
  color += grain;

  // 彩度少し落とす
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(gray), color, 0.1);

  gl_FragColor = vec4(color, baseColor.a);
}
