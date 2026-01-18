precision mediump float;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+10.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm( vec2 p ) {
   float f = 0.0, scale;
   for (int i=0; i<4; i++) {
      scale = pow( pow(1.1, 6.784/3.200), float(i) );
      f += snoise( p * scale ) / scale;
   }
   return f; }


uniform vec3 lightDirection;
uniform float lightIntensity;
uniform sampler2D map;
uniform float time;
uniform bool hasTime;

uniform float noiseScale;
uniform bool isPastel;
uniform float pastelIntensity;

varying vec3 vNormal;
varying vec2 vUv;

const int   oct  = 8;
const float per  = 0.5;
const float PI   = 3.1415926;

// RGBからHSVへの変換関数
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// HSVからRGBへの変換関数
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 toPastel(vec3 fragColor) {
    vec3 inputColor = fragColor; // 元の色
    
    vec3 hsv = rgb2hsv(inputColor);
    
    // パステル化の調整
    hsv.y *= (1.0-pastelIntensity); // 彩度を落とす
    hsv.z = 1.0;   // 明度を最大にする
    
    vec3 finalColor = hsv2rgb(hsv);
    return finalColor;
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

    vec3 texColor=texture2D(map,vUv).xyz;

    vec3 finalColor=vec3(0.0);
    if(isPastel)
        finalColor=toPastel(texColor);
    else
        finalColor=texColor;

    float t=0.0;
    if(hasTime)
        t=floor(time);

    float n1 = fbm( vUv*2000.0/noiseScale +t);
    float n2 = fbm( vUv*200.0/noiseScale+vec2(100.0,1.0)*t );
    float n3 = fbm( vUv*20.0/noiseScale+vec2(1.0,2.0)*t );
    float n4 = fbm( vUv*10.0/noiseScale+vec2(2.0,1.0)*t );
    float n=n1+n2+n3+n4;
    
    finalColor+=max(vec3(n*0.5+0.5),0.0)*0.1;

    gl_FragColor = vec4(finalColor*toonShade, 1.0);
}