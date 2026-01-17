precision mediump float;

uniform vec3 diffuse;
uniform vec3 lightDirection;
uniform float lightIntensity;
uniform sampler2D map;
uniform bool hasTexture;
uniform float time;
uniform bool hasTime;

uniform float noiseScale;
uniform float noiseIntensity;
uniform bool gray;

varying vec3 vNormal;
varying vec2 vUv;

const int   oct  = 8;
const float per  = 0.5;
const float PI   = 3.1415926;

float interpolate(float a, float b, float x){
    float f = (1.0 - cos(x * PI)) * 0.5;
    return a * (1.0 - f) + b * f;
}

float rnd(vec2 p){
    float offs=time;
    if(!hasTime)offs = 0.0;
    return fract(offs+sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float irnd(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec4 v = vec4(rnd(vec2(i.x,       i.y      )),
                  rnd(vec2(i.x + 1.0, i.y      )),
                  rnd(vec2(i.x,       i.y + 1.0)),
                  rnd(vec2(i.x + 1.0, i.y + 1.0)));
    return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}

// 修正版ノイズ関数
float noise(vec2 p){
    float t = 0.0;
    for(int i = 0; i < oct; i++){
        float freq = pow(2.0, float(i));
        float amp  = pow(per, float(oct - i));
        t += irnd(p * freq) * amp;  // ここを修正
    }
    return t;
}

// シームレスノイズも同様に修正
float snoise(vec2 p, vec2 q, vec2 r){
    return noise(vec2(p.x,       p.y      )) *        q.x  *        q.y  +
           noise(vec2(p.x,       p.y + r.y)) *        q.x  * (1.0 - q.y) +
           noise(vec2(p.x + r.x, p.y      )) * (1.0 - q.x) *        q.y  +
           noise(vec2(p.x + r.x, p.y + r.y)) * (1.0 - q.x) * (1.0 - q.y);
}

void main(void){

  // その部分での法線
    vec3 normal = normalize(vNormal);
    // ライトの向き（ライトへ向かう向き）
    vec3 lightDir = normalize(lightDirection);
    // 内積（法線とライトの向きの一致度0~1と考えれば良い）
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
  
  vec2 t = vUv * noiseScale; // スケール調整
  float n = noise(t);
  n=1.0-exp(-4.5*n) * noiseIntensity;

  vec4 texColor=texture2D(map, vUv);
  vec3 finalColor=normalize(texColor.xyz)*n;

  if(gray){
    finalColor=vec3(length(finalColor));
  }
  
  gl_FragColor = vec4(finalColor * toonShade, 1.0);
}