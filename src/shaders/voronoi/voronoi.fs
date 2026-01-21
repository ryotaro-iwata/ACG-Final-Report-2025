precision mediump float;

uniform vec3 diffuse;
uniform vec3 lightDirection;
uniform float lightIntensity;
uniform sampler2D map;
uniform bool hasTexture;
uniform float opacity;
uniform vec3 rimColor;
uniform float rimPower;
uniform float rimIntensity;

// ボロノイ用のユニフォーム
uniform float voronoiScale;      // ボロノイのスケール（マス目の数）
uniform float voronoiIntensity;  // ボロノイの強度
uniform float time;               // アニメーション用の時間

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

// 疑似乱数生成関数
vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)),
              dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

// ボロノイ図の計算（最近傍セルのIDと中心点のUV座標を返す）
// UVをグリッド上に分割する
vec3 voronoiCell(vec2 uv, float scale) {
    vec2 st = uv * scale;
    
    vec2 ist = floor(st);  // 整数部分（現在、何行何列目のマスにいるか？）
    vec2 fst = fract(st);  // 小数部分
    
    float minDistance = 5.0;
    vec2 nearestCellUv = vec2(0.0);
    
    // 自身を含む周囲9マスを探索
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 cellId = ist + neighbor;
            
            // マス内のランダムな点の位置（アニメーション付き）
            vec2 p = 0.5 + 0.5 * sin(time + 6.2831 * random2(cellId));
            
            // 点との距離ベクトル
            vec2 diff = neighbor + p - fst;
            
            // 最短距離を更新
            float dist = length(diff);
            if (dist < minDistance) {
                minDistance = dist;
                // セル中心点の元のUV座標を計算
                nearestCellUv = (cellId + p) / scale;
            }
        }
    }
    
    return vec3(nearestCellUv, minDistance);
}

void main() {
    // ベースカラー（テクスチャまたは単色）
    vec4 baseColor = hasTexture ? texture2D(map, vUv) : vec4(diffuse, 1.0);
    
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
    
    // ボロノイセルの取得
    vec3 voronoiResult = voronoiCell(vUv, voronoiScale);
    vec2 cellCenterUv = voronoiResult.xy;
    
    // セル中心点のテクスチャ色を取得
    vec3 voronoiColor;
    if (hasTexture) {
        voronoiColor = texture2D(map, cellCenterUv).rgb;
    } else {
        // テクスチャがない場合は元の色を使う
        voronoiColor = diffuse;
    }

    // ★ セルごとの色のバリエーションを追加
    // セルIDを計算（グリッド座標）
    vec2 cellId = floor(vUv * voronoiScale);
    // セルIDから疑似乱数を生成（-0.05 ~ +0.05の範囲）
    vec2 rand = random2(cellId);
    float colorVariation = (rand.x + rand.y) * 0.025; // 0.05くらいまで調整可能
    voronoiColor += colorVariation;
    
    // 先にシェーディングを適用（ボロノイの境界を崩さない）
    vec3 shadedBase = baseColor.rgb * toonShade;
    vec3 shadedVoronoi = voronoiColor * toonShade;
    
    // シェーディング済みの色をボロノイでブレンド
    vec3 blendedColor = mix(shadedBase, shadedVoronoi, voronoiIntensity);
    
    // リムライト（広めの幅）
    // 視線の向き（目へ向かう向き）
    vec3 viewDir = normalize(vViewPosition);
    // 視線の向きと法線の不一致度0~1
    float rimDot = 1.0 - max(dot(viewDir, normal), 0.0);
    // 不一致であるほど色を付ける（rimPowerが大きいと狭い範囲にだけ色がつく）
    float rimAmount = pow(rimDot, rimPower) * rimIntensity;
    vec3 rim = rimColor * rimAmount;
    
    // 最終カラー合成
    vec3 finalColor = blendedColor;// + rim;
    finalColor *= lightIntensity;

    gl_FragColor = vec4(finalColor, baseColor.a * opacity);
}