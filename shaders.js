// 模擬用的頂點著色器
// 負責將 3D 座標轉換到 2D 螢幕空間
export const simulationVertexShader = `
    // 傳遞給片段著色器的 UV 座標
    varying vec2 vUv;
    
    void main() {
        // 將模型的 UV 座標傳給片段著色器
        vUv = uv;
        // 計算頂點在螢幕空間的位置
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// 模擬用的片段著色器
// 負責計算水波的物理模擬
export const simulationFragmentShader = `
    // 設定浮點數精度為高精度
    precision highp float;
    
    // 接收前一幀的水波狀態紋理
    uniform sampler2D textureA;
    // 滑鼠位置（像素座標）
    uniform vec2 mouse;
    // 畫布解析度
    uniform vec2 resolution;
    // 時間（秒）
    uniform float time;
    // 當前幀數
    uniform int frame;
    // 從頂點著色器接收的 UV 座標
    varying vec2 vUv;

    // 波動方程的時間步長
    const float delta = 1.4;

    void main() {
        // 獲取當前像素的 UV 座標
        vec2 uv = vUv;
        
        // 第 0 幀時初始化為靜止狀態
        if (frame == 0) {
            gl_FragColor = vec4(0.0);
            return;
        }

        // 讀取當前像素的水波狀態
        vec4 data = texture2D(textureA, uv);
        float pressure = data.x;    // 水壓
        float pVel = data.y;       // 水壓變化速度

        // 計算相鄰像素的間距
        vec2 texelSize = 1.0 / resolution;
        // 讀取周圍四個像素的水壓
        float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
        float p_left  = texture2D(textureA, uv + vec2(-texelSize.x, 0.0)).x;
        float p_up    = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
        float p_down  = texture2D(textureA, uv + vec2(0.0, -texelSize.y)).x;

        // 邊界處理：使用鏡像邊界條件
        if (uv.x <= texelSize.x) p_left = p_right;
        if (uv.x >= 1.0 - texelSize.x) p_right = p_left;
        if (uv.y <= texelSize.y) p_down = p_up;
        if (uv.y >= 1.0 - texelSize.y) p_up = p_down;

        // 更新水波：使用波動方程模擬水波傳播
        // 計算水平方向的壓力差
        pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
        // 計算垂直方向的壓力差
        pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;

        // 更新水壓
        pressure += delta * pVel;

        // 添加阻尼效果，使水波逐漸平靜
        pVel -= 0.005 * delta * pressure;
        pVel *= 1.0 - 0.002 * delta;
        pressure *= 0.999;

        // 處理滑鼠互動：在滑鼠位置產生水波
        vec2 mouseUV = mouse / resolution;
        if (mouse.x > 0.0) {
            float dist = distance(uv, mouseUV);
            if (dist <= 0.02) {
                pressure += 2.0 * (1.0 - dist / 0.02);
            }
        }

        // 輸出結果：
        // r 通道：水壓
        // g 通道：水壓變化速度
        // b 通道：水平方向的壓力梯度
        // a 通道：垂直方向的壓力梯度
        gl_FragColor = vec4(
            pressure,
            pVel,
            (p_right - p_left) * 0.5,
            (p_up - p_down) * 0.5
        );
    }
`;

// 渲染用的頂點著色器
// 與模擬用的頂點著色器相同
export const renderVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// 渲染用的片段著色器
// 負責將模擬結果視覺化
export const renderFragmentShader = `
    // 設定浮點數精度為高精度
    precision highp float;
    
    // 接收水波模擬結果的紋理
    uniform sampler2D textureA;
    // 接收背景圖像的紋理
    uniform sampler2D textureB;
    // 從頂點著色器接收的 UV 座標
    varying vec2 vUv;

    void main() {
        // 讀取水波狀態
        vec4 data = texture2D(textureA, vUv);
        // 根據壓力梯度計算扭曲效果
        vec2 distortion = 0.03 * data.zw;
        // 對背景圖像進行扭曲採樣
        vec4 color = texture2D(textureB, vUv + distortion);

        // 計算法線向量用於光照效果
        vec3 normal = normalize(vec3(-data.z * 2.0, 0.5, -data.w * 2.0));
        // 定義光源方向
        vec3 lightDir = normalize(vec3(-3.0, 10.0, 3.0));
        // 計算鏡面反射
        float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * 1.5;

        // 輸出最終顏色：背景色 + 鏡面反射
        gl_FragColor = color + vec4(vec3(specular), 0.0);
    }
`;