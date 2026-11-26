import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 极简黑白灰 3D GPU 细点阵星云（Three.js + 自定义 GLSL Shader）
 * - 严格纯黑白灰体系：仅使用 #333333 / #666666 / #999999，无蓝紫色、无发光
 * - 9,600+ 极细微粒点阵，在屏幕中央 Logo 周围保留圆形真空区，呈星云环绕态缓慢运转
 * - 鼠标移动触发极克制的 3D 视差倾斜与细腻涟漪
 */
export const AuthParticleScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const initialWidth = container.clientWidth || Math.floor(window.innerWidth * 0.55);
    const initialHeight = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 0, 8.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(initialWidth, initialHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // =========================================================================
    // Layer 1: 环绕中心真空区的 3D 莫比乌斯极细点阵星云 (6,800 极细粒子)
    // =========================================================================
    const mainCount = 6800;
    const mainPositions = new Float32Array(mainCount * 3);
    const mainUV = new Float32Array(mainCount * 2);
    const mainSeed = new Float32Array(mainCount * 3); // [sizeWeight, phase, grayTier]

    const MAJOR_R = 2.85; // 放大主环半径，确保中央自然留出宽敞真空区
    const HALF_W = 0.72;

    for (let i = 0; i < mainCount; i++) {
      const isStructured = i < 4600;
      let u: number;
      let v: number;
      let radialJitter = 0;

      if (isStructured) {
        const uSteps = 230;
        const vSteps = 20;
        const iu = Math.floor(i / vSteps);
        const iv = i % vSteps;
        u = (iu / uSteps) * Math.PI * 2 + (Math.random() - 0.5) * 0.02;
        v = (iv / (vSteps - 1)) * 2 - 1 + (Math.random() - 0.5) * 0.05;
        radialJitter = (Math.random() - 0.5) * 0.05;
      } else {
        u = Math.random() * Math.PI * 2;
        v = (Math.random() * 2 - 1) * 1.45;
        radialJitter = (Math.random() - 0.35) * 0.55; // 偏向外围扩散，远离中心 Logo
      }

      const halfU = u * 0.5;
      let r = MAJOR_R + v * HALF_W * Math.cos(halfU) + radialJitter;
      // 强制保持在中心真空半径外
      if (r < 2.05) r = 2.05 + Math.random() * 0.45;

      const x = r * Math.cos(u);
      const y = r * Math.sin(u);
      const z = v * HALF_W * Math.sin(halfU) + radialJitter * 0.7;

      mainPositions[i * 3] = x;
      mainPositions[i * 3 + 1] = y;
      mainPositions[i * 3 + 2] = z;

      mainUV[i * 2] = u;
      mainUV[i * 2 + 1] = v;

      mainSeed[i * 3] = isStructured ? 0.55 + Math.random() * 0.65 : 0.4 + Math.random() * 0.6;
      mainSeed[i * 3 + 1] = Math.random() * Math.PI * 2;
      mainSeed[i * 3 + 2] = Math.random(); // 用于在 #333 / #666 / #999 三档纯灰中分配
    }

    const mainGeo = new THREE.BufferGeometry();
    mainGeo.setAttribute('position', new THREE.BufferAttribute(mainPositions, 3));
    mainGeo.setAttribute('aParam', new THREE.BufferAttribute(mainUV, 2));
    mainGeo.setAttribute('aSeed', new THREE.BufferAttribute(mainSeed, 3));

    const mainMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uAspect: { value: initialWidth / initialHeight },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHoverStrength: { value: 0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uAspect;
        uniform vec2 uMouse;
        uniform float uHoverStrength;

        attribute vec2 aParam;
        attribute vec3 aSeed;

        varying float vDepth;
        varying float vTier;
        varying float vVacuumMask;

        void main() {
          float u = aParam.x;
          float v = aParam.y;
          float phase = aSeed.y;

          float flowWave = sin(u * 4.0 - uTime * 1.45 + v * 2.2);
          float secondaryWave = cos(u * 7.0 + uTime * 1.0 - phase);
          float breathe = 1.0 + sin(uTime * 0.65) * 0.032;

          float R = 2.85 * breathe;
          float halfW = 0.72 * (1.0 + cos(uTime * 0.6 + u * 2.0) * 0.05);
          float halfU = u * 0.5;

          float ripple = flowWave * 0.08 + secondaryWave * 0.032;
          vec3 canonical = vec3(
            (2.85 + v * 0.72 * cos(halfU)) * cos(u),
            (2.85 + v * 0.72 * cos(halfU)) * sin(u),
            v * 0.72 * sin(halfU)
          );
          vec3 baseOffset = position - canonical;
          vec3 drift = baseOffset * (1.0 + sin(uTime * 0.85 + phase) * 0.18);

          float r = max(2.08, R + (v * halfW + ripple) * cos(halfU));
          vec3 pos = vec3(
            r * cos(u),
            r * sin(u),
            (v * halfW + ripple) * sin(halfU)
          ) + drift;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vec4 clipPos = projectionMatrix * mvPosition;
          vec2 ndc = clipPos.xy / max(0.001, clipPos.w);

          // 轻微的鼠标交互磁力涟漪
          float mouseDist = length(ndc - uMouse);
          float repel = exp(-mouseDist * mouseDist * 5.0) * uHoverStrength;
          pos += normalize(pos + vec3(0.0001)) * repel * 0.24;

          mvPosition = modelViewMatrix * vec4(pos, 1.0);
          clipPos = projectionMatrix * mvPosition;
          gl_Position = clipPos;

          // 屏幕正中心圆形真空区平滑剔除，确保 Logo 与 Slogan 周围干净通透
          vec2 finalNdc = clipPos.xy / max(0.001, clipPos.w);
          vec2 aspectScaled = vec2(finalNdc.x * min(uAspect, 1.35), finalNdc.y);
          float centerDist = length(aspectScaled);
          vVacuumMask = smoothstep(0.36, 0.62, centerDist);

          vDepth = clamp(1.0 - ((-mvPosition.z - 5.2) / 6.8), 0.0, 1.0);
          vTier = aSeed.z;

          // 极细点阵尺寸（1.1px ~ 3.2px，绝不出现大块圆球）
          float fineSize = (1.15 + aSeed.x * 1.15 + vDepth * 0.65) * uPixelRatio;
          gl_PointSize = clamp(fineSize * (8.4 / max(2.0, -mvPosition.z)), 1.0, 3.6 * uPixelRatio);
        }
      `,
      fragmentShader: `
        varying float vDepth;
        varying float vTier;
        varying float vVacuumMask;

        void main() {
          if (vVacuumMask < 0.01) discard;

          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          if (d > 0.5) discard;

          // 锐利抗锯齿细圆点，无发光（Bloom）晕染
          float edge = smoothstep(0.5, 0.28, d);

          // 严格三档中性灰：#333333 (0.2), #666666 (0.4), #999999 (0.6)
          vec3 darkGray = vec3(0.20, 0.20, 0.20);
          vec3 midGray = vec3(0.40, 0.40, 0.40);
          vec3 lightGray = vec3(0.60, 0.60, 0.60);

          vec3 tierCol = vTier < 0.34 ? darkGray : (vTier < 0.70 ? midGray : lightGray);
          vec3 finalColor = mix(lightGray, tierCol, 0.35 + vDepth * 0.65);

          float alpha = (0.18 + vDepth * 0.48) * edge * vVacuumMask;
          gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 0.75));
        }
      `
    });

    const mainPoints = new THREE.Points(mainGeo, mainMat);
    rootGroup.add(mainPoints);

    // =========================================================================
    // Layer 2: 外围极细星云尘埃环 (2,800 极细粒子，全部位于中心真空区之外)
    // =========================================================================
    const orbitCount = 2800;
    const orbitPositions = new Float32Array(orbitCount * 3);
    const orbitMeta = new Float32Array(orbitCount * 4); // [radius, angle, speed, grayTier]

    for (let i = 0; i < orbitCount; i++) {
      let x = 0;
      let y = 0;
      let z = 0;
      let radius = 0;
      const angle = Math.random() * Math.PI * 2;
      let speed = 0.08 + Math.random() * 0.14;
      const tier = Math.random();

      if (i < 1600) {
        // 双倾角外环细点星轨
        const ringIdx = i % 2;
        radius = (ringIdx === 0 ? 3.55 : 4.15) + (Math.random() - 0.5) * 0.45;
        const yOff = (Math.random() - 0.5) * 0.22;
        const rawX = Math.cos(angle) * radius;
        const rawY = yOff;
        const rawZ = Math.sin(angle) * radius;

        const tiltX = ringIdx === 0 ? 0.55 : -0.62;
        const tiltZ = ringIdx === 0 ? -0.32 : 0.36;
        const cy1 = rawY * Math.cos(tiltX) - rawZ * Math.sin(tiltX);
        const cz1 = rawY * Math.sin(tiltX) + rawZ * Math.cos(tiltX);
        x = rawX * Math.cos(tiltZ) - cy1 * Math.sin(tiltZ);
        y = rawX * Math.sin(tiltZ) + cy1 * Math.cos(tiltZ);
        z = cz1;
        speed = ringIdx === 0 ? 0.09 + Math.random() * 0.08 : -(0.07 + Math.random() * 0.08);
      } else {
        // 外围空间悬浮极细微粒（排除中心半径 < 2.25 的真空球）
        const spreadR = 2.35 + Math.pow(Math.random(), 0.78) * 3.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        x = spreadR * Math.sin(phi) * Math.cos(theta) * 1.15;
        y = spreadR * Math.sin(phi) * Math.sin(theta) * 0.98;
        z = spreadR * Math.cos(phi) * 0.85;
        radius = spreadR;
        speed = 0.03 + Math.random() * 0.05;
      }

      orbitPositions[i * 3] = x;
      orbitPositions[i * 3 + 1] = y;
      orbitPositions[i * 3 + 2] = z;

      orbitMeta[i * 4] = radius;
      orbitMeta[i * 4 + 1] = angle;
      orbitMeta[i * 4 + 2] = speed;
      orbitMeta[i * 4 + 3] = tier;
    }

    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3));
    orbitGeo.setAttribute('aMeta', new THREE.BufferAttribute(orbitMeta, 4));

    const orbitMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uAspect: { value: initialWidth / initialHeight }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uAspect;

        attribute vec4 aMeta;

        varying float vAlpha;
        varying float vTier;
        varying float vVacuumMask;

        void main() {
          float angle = aMeta.y;
          float speed = aMeta.z;
          vTier = aMeta.w;

          float rot = uTime * speed;
          float c = cos(rot);
          float s = sin(rot);
          vec3 pos = vec3(
            position.x * c + position.z * s,
            position.y + sin(uTime * 0.7 + angle * 3.0) * 0.06,
            -position.x * s + position.z * c
          );

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vec4 clipPos = projectionMatrix * mvPosition;
          gl_Position = clipPos;

          // 同样避开中心 Logo 圆形真空区
          vec2 finalNdc = clipPos.xy / max(0.001, clipPos.w);
          vec2 aspectScaled = vec2(finalNdc.x * min(uAspect, 1.35), finalNdc.y);
          float centerDist = length(aspectScaled);
          vVacuumMask = smoothstep(0.38, 0.66, centerDist);

          float depth = clamp(1.0 - ((-mvPosition.z - 4.0) / 8.5), 0.0, 1.0);
          float breath = 0.72 + 0.28 * sin(uTime * 1.4 + angle * 4.0 + vTier * 8.0);
          vAlpha = (0.12 + depth * 0.34) * breath;

          // 极细微粒尺寸（1.0px ~ 2.6px）
          float size = (1.0 + vTier * 1.05) * uPixelRatio;
          gl_PointSize = clamp(size * (8.0 / max(2.0, -mvPosition.z)), 1.0, 2.8 * uPixelRatio);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vTier;
        varying float vVacuumMask;

        void main() {
          if (vVacuumMask < 0.01) discard;

          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          if (d > 0.5) discard;

          float edge = smoothstep(0.5, 0.28, d);

          vec3 darkGray = vec3(0.20, 0.20, 0.20);
          vec3 midGray = vec3(0.40, 0.40, 0.40);
          vec3 lightGray = vec3(0.60, 0.60, 0.60);

          vec3 col = vTier < 0.30 ? darkGray : (vTier < 0.68 ? midGray : lightGray);
          gl_FragColor = vec4(col, vAlpha * edge * vVacuumMask);
        }
      `
    });

    const orbitPoints = new THREE.Points(orbitGeo, orbitMat);
    rootGroup.add(orbitPoints);

    // =========================================================================
    // Layer 3: 极细纯灰拓扑轨道线（无任何蓝色/紫色）
    // =========================================================================
    const wireGeometries: THREE.BufferGeometry[] = [];
    const wireMaterials: THREE.Material[] = [];

    const haloPts: number[] = [];
    const haloSegs = 144;
    for (let s = 0; s <= haloSegs; s++) {
      const a = (s / haloSegs) * Math.PI * 2;
      haloPts.push(Math.cos(a) * 3.6, 0, Math.sin(a) * 3.6);
    }
    const haloGeo = new THREE.BufferGeometry();
    haloGeo.setAttribute('position', new THREE.Float32BufferAttribute(haloPts, 3));
    const haloMat = new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.14,
      depthWrite: false
    });
    wireGeometries.push(haloGeo);
    wireMaterials.push(haloMat);
    const haloLine = new THREE.Line(haloGeo, haloMat);
    haloLine.rotation.set(0.55, 0, -0.32);
    rootGroup.add(haloLine);

    // =========================================================================
    // Mouse Parallax Interaction
    // =========================================================================
    const mouseTarget = new THREE.Vector2(0, 0);
    const mouseSmooth = new THREE.Vector2(0, 0);
    let hoverTarget = 0;
    let hoverSmooth = 0;

    const hostEl = container.parentElement || container;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = hostEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTarget.set(
        THREE.MathUtils.clamp(nx, -1, 1),
        THREE.MathUtils.clamp(ny, -1, 1)
      );
      hoverTarget = 1;
    };

    const handlePointerLeave = () => {
      mouseTarget.set(0, 0);
      hoverTarget = 0;
    };

    hostEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    hostEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // =========================================================================
    // Resize Handling
    // =========================================================================
    const handleResize = () => {
      const w = container.clientWidth || Math.floor(window.innerWidth * 0.55);
      const h = container.clientHeight || window.innerHeight;
      if (w <= 0 || h <= 0) return;
      const aspect = w / h;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      const dpr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h);
      mainMat.uniforms.uPixelRatio.value = dpr;
      mainMat.uniforms.uAspect.value = aspect;
      orbitMat.uniforms.uPixelRatio.value = dpr;
      orbitMat.uniforms.uAspect.value = aspect;
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    resizeObserver?.observe(container);
    window.addEventListener('resize', handleResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // =========================================================================
    // Animation Loop (with Software-WebGL fence pacing)
    // =========================================================================
    let frameId = 0;
    let disposed = false;
    const startTime = performance.now();
    let prevTime = startTime;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext();
      if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
          if (status === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    };

    const tick = () => {
      if (disposed) return;

      const now = performance.now();
      const dt = Math.min((now - prevTime) * 0.001, 0.05);
      prevTime = now;
      const elapsed = (now - startTime) * 0.001;

      mouseSmooth.x = THREE.MathUtils.damp(mouseSmooth.x, mouseTarget.x, 4.0, dt);
      mouseSmooth.y = THREE.MathUtils.damp(mouseSmooth.y, mouseTarget.y, 4.0, dt);
      hoverSmooth = THREE.MathUtils.damp(hoverSmooth, hoverTarget, 3.5, dt);

      mainMat.uniforms.uTime.value = elapsed;
      mainMat.uniforms.uMouse.value.copy(mouseSmooth);
      mainMat.uniforms.uHoverStrength.value = hoverSmooth;
      orbitMat.uniforms.uTime.value = elapsed;

      const targetRotX = 0.42 + Math.sin(elapsed * 0.25) * 0.12 - mouseSmooth.y * 0.16;
      const targetRotZ = Math.cos(elapsed * 0.19) * 0.1 + mouseSmooth.x * 0.12;

      rootGroup.rotation.y = elapsed * 0.12 + mouseSmooth.x * 0.25;
      rootGroup.rotation.x = THREE.MathUtils.damp(rootGroup.rotation.x, targetRotX, 3.8, dt);
      rootGroup.rotation.z = THREE.MathUtils.damp(rootGroup.rotation.z, targetRotZ, 3.8, dt);

      haloLine.rotation.y = -elapsed * 0.09;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
      hostEl.removeEventListener('pointermove', handlePointerMove);
      hostEl.removeEventListener('pointerleave', handlePointerLeave);

      mainGeo.dispose();
      mainMat.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
      wireGeometries.forEach((g) => g.dispose());
      wireMaterials.forEach((m) => m.dispose());
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};
