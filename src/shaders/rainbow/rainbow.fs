precision mediump float;

uniform vec3 diffuse;
uniform vec3 lightDirection;
uniform float lightIntensity;
uniform sampler2D map;
uniform bool hasTexture;

varying vec3 vNormal;
varying vec2 vUv;

// HSV → RGB
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {

  vec4 baseColor = hasTexture
    ? texture2D(map, vUv)
    : vec4(diffuse, 1.0);

  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(lightDirection);

  // ===== やさしいライティング =====
  float NdotL = max(dot(normal, lightDir), 0.0);
  float light = mix(0.85, 1.05, NdotL) * lightIntensity;

  // ===== パステル虹 =====
  float hue = fract(
      normal.x * 0.45 +
      normal.y * 0.45 +
      0.5
  );

  float sat = 0.7;   // ← 低彩度
  float val = 1.0;

  vec3 rainbow = hsv2rgb(vec3(hue, sat, val));

  // ===== 白を混ぜてパステル化 =====
  rainbow = mix(rainbow, vec3(1.0), 0.1);

  // ===== 明暗は元の質感から =====
  float luminance = dot(baseColor.rgb, vec3(0.299, 0.587, 0.114));

  vec3 color = rainbow * (0.7 + luminance * 0.6) * light;

  // ===== 全体をふんわり =====
  color = mix(color, vec3(1.0), 0.08);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), baseColor.a);
}
