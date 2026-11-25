import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ArrowUpRight, X, Check, Copy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FlywheelItem {
  num: string;
  title: string;
  desc: string;
  targetTab: 'training' | 'tasks' | 'creative' | 'compute';
}

const FLYWHEEL_ITEMS: FlywheelItem[] = [
  {
    num: '01',
    title: '学习',
    desc: '体系化 AI 课程与高端实训，构建大模型开发核心能力。',
    targetTab: 'training'
  },
  {
    num: '02',
    title: '认证',
    desc: '通过“AI 交付实战考试”，获取权威资质与能力背书。',
    targetTab: 'training'
  },
  {
    num: '03',
    title: '实战',
    desc: '接入任务大厅与 AI 赛事，淬炼真实场景的项目交付力。',
    targetTab: 'creative'
  },
  {
    num: '04',
    title: '创收',
    desc: '接单赚赏金，兑换海量 Token，让每一次技术实战都有回报。',
    targetTab: 'tasks'
  }
];

const PARTNER_LOGOS: { name: string; en: string; mark: React.ReactNode }[] = [
  {
    name: '天数智芯',
    en: 'ILUVATAR COREX',
    mark: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" />
        <path d="M9 9h6v6H9z" fill="currentColor" />
      </svg>
    )
  },
  {
    name: '智谱',
    en: 'ZHIPU AI',
    mark: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6h16L6 18h14" />
      </svg>
    )
  },
  {
    name: '腾讯',
    en: 'TENCENT',
    mark: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 7h16M12 7v12" />
      </svg>
    )
  },
  {
    name: '字节跳动',
    en: 'BYTEDANCE',
    mark: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 16V8M10 19V5M15 15V9M20 18V6" />
      </svg>
    )
  },
  {
    name: '阿里云',
    en: 'ALIBABA CLOUD',
    mark: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 8H4v8h3M17 8h3v8h-3M8 12h8" />
      </svg>
    )
  },
  {
    name: '华为',
    en: 'HUAWEI',
    mark: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="7" />
        <path d="M12 3v18M3 12h18" />
      </svg>
    )
  }
];

const INDUSTRY_DISTRIBUTION = [
  { label: '研发 / 互联网', percent: 45 },
  { label: '政企 / 国防安全', percent: 24 },
  { label: '高校 / 科研院所', percent: 19 },
  { label: '金融 / 能源制造', percent: 12 }
];

const CITY_DISTRIBUTION = [
  '北京 28%',
  '上海 21%',
  '深圳 18%',
  '杭州 12%',
  '成都 8%',
  '武汉 6%',
  '南京 4%',
  '西安 3%'
];

const HOT_COMPETITIONS = [
  {
    id: 'comp-xctf-llm',
    status: '进行中',
    title: '2026 XCTF·AI 大模型攻防与安全对齐挑战赛',
    reward: '奖金池 ¥300,000 · 配套百万算力券补贴',
    deadline: '距离截稿 14 天'
  },
  {
    id: 'comp-rag-enterprise',
    status: '进行中',
    title: '企业级多模态 RAG 检索增强生成工程实战赛',
    reward: '奖金池 ¥150,000 · 生态合作企业直通终面',
    deadline: '距离截稿 21 天'
  },
  {
    id: 'comp-agent-opc',
    status: '进行中',
    title: '自主智能体 (Agent) 工业交付与自动化黑客松',
    reward: '奖金池 ¥120,000 · 5,000万 Digitoken 激励',
    deadline: '距离截稿 29 天'
  }
];

interface UpcomingClassItem {
  code: string;
  name: string;
  date: string;
  location: string;
  seatsText: string;
  urgent: boolean;
}

const UPCOMING_CLASSES: UpcomingClassItem[] = [
  {
    code: 'BATCH-87',
    name: '大模型微调与企业级 RAG 交付实战高阶班',
    date: '2026.12.05',
    location: '北京 · 线上同步',
    seatsText: '仅剩 3 席',
    urgent: true
  },
  {
    code: 'BATCH-88',
    name: '360 AI 交付工程师 (FDE) 权威认证冲刺班',
    date: '2026.12.12',
    location: '上海 · 线上同步',
    seatsText: '仅剩 5 席',
    urgent: true
  },
  {
    code: 'BATCH-89',
    name: 'AI 数字孪生靶场红蓝对抗与态势推演实训营',
    date: '2026.12.19',
    location: '深圳 · 线下实训',
    seatsText: '余位 16 席',
    urgent: false
  },
  {
    code: 'BATCH-90',
    name: '智谱 GLM 大模型智能体开发架构师认证班',
    date: '2026.12.26',
    location: '杭州 · 线上同步',
    seatsText: '仅剩 2 席',
    urgent: true
  }
];

const OPC_CITY_POLICIES = [
  { city: '北京 · 中关村 AI 超级个体社区', policy: '最高 50 万算力券直补 + 6 个月免费独立工位 + 政企订单优先派发' },
  { city: '上海 · 模速空间 OPC 创新基地', policy: 'Token 调用补贴 40% + 创业免息贷款绿色通道 + 大模型备案辅导' },
  { city: '深圳 · 前海深港 AI 创客中心', policy: '跨境算力专线支持 + 最高 30 万项目交付奖励 + 产业基金直投对接' },
  { city: '杭州 · 滨江硅谷 AI 极客部落', policy: '免费 GPU 实验集群配额 + 人才公寓租金减免 + 悬赏任务佣金全免' },
  { city: '成都 / 武汉 / 南京 / 西安 等 50+ 城市节点', policy: '属地化高校实训基地开放 + 共享会议空间 + 远程交付法务与财税托管' }
];

export const HomeView06: React.FC = () => {
  const { setActiveTab, showToast } = useApp();

  // Root & section refs
  const pageRootRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroCanvasMountRef = useRef<HTMLDivElement | null>(null);
  const heroTopTextRef = useRef<HTMLDivElement | null>(null);
  const heroFlywheelRef = useRef<HTMLDivElement | null>(null);
  const heroLogosRef = useRef<HTMLDivElement | null>(null);

  const section2Ref = useRef<HTMLElement | null>(null);
  const section2LeftRef = useRef<HTMLDivElement | null>(null);
  const section2RightRef = useRef<HTMLDivElement | null>(null);
  const certCountSpanRef = useRef<HTMLSpanElement | null>(null);
  const classCountSpanRef = useRef<HTMLSpanElement | null>(null);

  const section3Ref = useRef<HTMLElement | null>(null);
  const opcCardsContainerRef = useRef<HTMLDivElement | null>(null);
  const opcUserCountSpanRef = useRef<HTMLSpanElement | null>(null);

  const section4Ref = useRef<HTMLElement | null>(null);
  const footerCanvasMountRef = useRef<HTMLDivElement | null>(null);

  // Scroll progress shared with Three.js render loop
  const heroScrollProgressRef = useRef<number>(0);

  // Flywheel hover state
  const [hoveredFlywheelIdx, setHoveredFlywheelIdx] = useState<number | null>(null);

  // 3D Tilt state for Section 4 large discount card
  const [cardTilt, setCardTilt] = useState<{ rx: number; ry: number; active: boolean }>({
    rx: 0,
    ry: 0,
    active: false
  });

  // Modals state
  const [opcCityModalOpen, setOpcCityModalOpen] = useState(false);
  const [opcPartnerModalOpen, setOpcPartnerModalOpen] = useState(false);
  const [selectedClassForSignup, setSelectedClassForSignup] = useState<UpcomingClassItem | null>(null);
  const [discountHubModalOpen, setDiscountHubModalOpen] = useState(false);

  // Partner Cooperation Form state
  const [partnerForm, setPartnerForm] = useState({
    company: '',
    contact: '',
    phone: '',
    type: '算力与模型供给合作',
    note: ''
  });
  const [partnerFormSubmitted, setPartnerFormSubmitted] = useState(false);

  // Class Signup Form state
  const [classSignupForm, setClassSignupForm] = useState({
    name: '',
    phone: '',
    org: ''
  });
  const [copiedPhone, setCopiedPhone] = useState(false);

  // =========================================================================
  // 1. Three.js Hero 3D Particle Matrix (Wave / Dome + Mouse Repulsion + Scroll Dispersion)
  // =========================================================================
  useEffect(() => {
    const mountEl = heroCanvasMountRef.current;
    if (!mountEl) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = mountEl.clientWidth || window.innerWidth;
    const height = mountEl.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
    camera.position.set(0, 11, 26);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0);

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    // Create procedural crisp circular dot texture
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 64;
    dotCanvas.height = 64;
    const ctx = dotCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 64, 64);
      ctx.beginPath();
      ctx.arc(32, 32, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    const dotTexture = new THREE.CanvasTexture(dotCanvas);
    dotTexture.colorSpace = THREE.SRGBColorSpace;

    // Build wave/dome grid of particles
    const cols = 64;
    const rows = 44;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scatterDirs = new Float32Array(count * 3);

    const darkBlack = new THREE.Color('#1a1a1a');
    const midGray = new THREE.Color('#666666');
    const lightGray = new THREE.Color('#999999');
    const tempColor = new THREE.Color();

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const u = (c / (cols - 1) - 0.5) * 38;
        const v = (r / (rows - 1) - 0.5) * 24;
        // Dome curvature
        const distFromCenter = Math.sqrt(u * u + v * v);
        const domeY = Math.cos(Math.min(distFromCenter * 0.11, Math.PI * 0.5)) * 4.2 - 1.5;

        const i3 = idx * 3;
        basePositions[i3] = u;
        basePositions[i3 + 1] = domeY;
        basePositions[i3 + 2] = v;

        positions[i3] = u;
        positions[i3 + 1] = domeY;
        positions[i3 + 2] = v;

        // Deterministic scatter direction for scroll deconstruction
        const angle = (idx * 1.6180339) % (Math.PI * 2);
        scatterDirs[i3] = Math.cos(angle) * (4 + (idx % 7));
        scatterDirs[i3 + 1] = 3 + ((idx * 13) % 11) * 0.8;
        scatterDirs[i3 + 2] = Math.sin(angle) * (4 + (idx % 5));

        // Monochrome palette mix (#1a1a1a and #666666)
        const mixRatio = (Math.sin(u * 0.35) + Math.cos(v * 0.35) + 2) * 0.25;
        if (mixRatio > 0.62) {
          tempColor.copy(darkBlack);
        } else if (mixRatio > 0.28) {
          tempColor.copy(midGray);
        } else {
          tempColor.copy(lightGray);
        }
        colors[i3] = tempColor.r;
        colors[i3 + 1] = tempColor.g;
        colors[i3 + 2] = tempColor.b;

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.24,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.58,
      alphaTest: 0.05,
      depthWrite: false
    });

    const pointsMesh = new THREE.Points(geometry, material);
    scene.add(pointsMesh);

    // Mouse parallax & repulsion tracking
    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = mountEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      mouseTarget.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseTarget.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!mountEl) return;
      const w = mountEl.clientWidth || window.innerWidth;
      const h = mountEl.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      mouseCurrent.x = THREE.MathUtils.damp(mouseCurrent.x, mouseTarget.x, 4.5, delta);
      mouseCurrent.y = THREE.MathUtils.damp(mouseCurrent.y, mouseTarget.y, 4.5, delta);

      const scrollP = heroScrollProgressRef.current;

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      const pointerWorldX = mouseCurrent.x * 16;
      const pointerWorldZ = -mouseCurrent.y * 10;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const bx = basePositions[i3];
        const by = basePositions[i3 + 1];
        const bz = basePositions[i3 + 2];

        // Gentle organic wave undulation
        const waveY =
          Math.sin(bx * 0.28 + elapsed * 0.85) * 0.75 +
          Math.cos(bz * 0.32 + elapsed * 0.65) * 0.65;

        // Mouse repulsion effect
        const dx = bx - pointerWorldX;
        const dz = bz - pointerWorldZ;
        const distSq = dx * dx + dz * dz;
        const repel = distSq < 36 ? (1 - distSq / 36) * 2.1 : 0;

        // Scroll dispersion
        const scatterX = scatterDirs[i3] * scrollP * 2.2;
        const scatterY = scatterDirs[i3 + 1] * scrollP * 2.4;
        const scatterZ = scatterDirs[i3 + 2] * scrollP * 2.2;

        posArr[i3] = bx + scatterX + (dx * repel * 0.18);
        posArr[i3 + 1] = by + waveY + repel + scatterY;
        posArr[i3 + 2] = bz + scatterZ + (dz * repel * 0.18);
      }
      posAttr.needsUpdate = true;

      // Gentle dome rotation + mouse parallax
      pointsMesh.rotation.y = elapsed * 0.045 + mouseCurrent.x * 0.18;
      pointsMesh.rotation.x = mouseCurrent.y * 0.1;

      // Fade opacity as user scrolls down
      material.opacity = Math.max(0.04, 0.58 * (1 - scrollP * 1.15));

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      dotTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // =========================================================================
  // 2. Lenis Smooth Scrolling + GSAP ScrollTrigger Orchestration
  // =========================================================================
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // 1) Initial Hero Partner Logo Stagger Fade-In
      if (heroLogosRef.current) {
        const logoNodes = heroLogosRef.current.querySelectorAll('.partner-logo-item');
        gsap.fromTo(
          logoNodes,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 0.4,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.25,
            clearProps: 'opacity,transform'
          }
        );
      }

      // 2) Hero Scroll Deconstruction
      if (heroSectionRef.current) {
        ScrollTrigger.create({
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            heroScrollProgressRef.current = self.progress;
          }
        });

        if (heroTopTextRef.current) {
          gsap.to(heroTopTextRef.current, {
            y: -70,
            opacity: 0.15,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: 'top top',
              end: '65% top',
              scrub: true
            }
          });
        }

        if (heroFlywheelRef.current) {
          gsap.to(heroFlywheelRef.current, {
            y: -36,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          });
        }
      }

      // 3) Fade-in-up reveal blocks
      const revealBlocks = gsap.utils.toArray<HTMLElement>('.gsap-fade-up');
      revealBlocks.forEach((block) => {
        gsap.fromTo(
          block,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 86%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // 4) Section 2: Count-up numbers & asymmetric parallax
      if (section2Ref.current) {
        const certCounter = { val: 0 };
        gsap.to(certCounter, {
          val: 12850,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section2Ref.current,
            start: 'top 78%',
            once: true
          },
          onUpdate: () => {
            if (certCountSpanRef.current) {
              certCountSpanRef.current.textContent =
                Math.round(certCounter.val).toLocaleString('en-US') + '+';
            }
          }
        });

        const classCounter = { val: 0 };
        gsap.to(classCounter, {
          val: 86,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section2Ref.current,
            start: 'top 78%',
            once: true
          },
          onUpdate: () => {
            if (classCountSpanRef.current) {
              classCountSpanRef.current.textContent = String(Math.round(classCounter.val));
            }
          }
        });

        // Subtle parallax speed difference between left 40% and right 60%
        if (section2LeftRef.current && section2RightRef.current) {
          gsap.to(section2LeftRef.current, {
            y: 24,
            ease: 'none',
            scrollTrigger: {
              trigger: section2Ref.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          });
        }
      }

      // 5) Section 3: OPC Horizontal Drawer Slide-out + 45W+ count-up
      if (section3Ref.current && opcCardsContainerRef.current) {
        const opcCols = opcCardsContainerRef.current.querySelectorAll('.opc-drawer-col');
        gsap.fromTo(
          opcCols,
          { x: -72, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section3Ref.current,
              start: 'top 76%',
              toggleActions: 'play none none none'
            }
          }
        );

        const opcUserCounter = { val: 0 };
        gsap.to(opcUserCounter, {
          val: 45,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section3Ref.current,
            start: 'top 76%',
            once: true
          },
          onUpdate: () => {
            if (opcUserCountSpanRef.current) {
              opcUserCountSpanRef.current.textContent = `${Math.round(opcUserCounter.val)}W+`;
            }
          }
        });
      }
    }, pageRootRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  // 3D Tilt handlers for Section 4 Large Card
  const handleDiscountCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({
      rx: -y * 7,
      ry: x * 7,
      active: true
    });
  };

  const handleDiscountCardLeave = () => {
    setCardTilt({ rx: 0, ry: 0, active: false });
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.company.trim() || !partnerForm.contact.trim() || !partnerForm.phone.trim()) {
      showToast('请填写企业名称、联系人与联系电话');
      return;
    }
    setPartnerFormSubmitted(true);
    showToast('已提交生态伙伴合作意向，专属BD将在1个工作日内与您联系');
  };

  const handleClassSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classSignupForm.name.trim() || !classSignupForm.phone.trim()) {
      showToast('请填写学员姓名与联系电话');
      return;
    }
    showToast(`已成功锁定「${selectedClassForSignup?.name}」席位，教务顾问将尽快联系您`);
    setSelectedClassForSignup(null);
    setClassSignupForm({ name: '', phone: '', org: '' });
  };

  const handleCopyAdvisorPhone = () => {
    try {
      navigator.clipboard?.writeText('400-882-9100');
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div
      ref={pageRootRef}
      className="-mx-8 -my-6 bg-[#ffffff] text-[#1a1a1a] antialiased selection:bg-[#1a1a1a] selection:text-[#ffffff]"
    >
      {/* =====================================================================
          栏目一：Hero 首屏区（升级版 · 三段式 100vh 空间划分 + Three.js 粒子穹顶）
         ===================================================================== */}
      <section
        ref={heroSectionRef}
        className="relative w-full min-h-[calc(100vh-64px)] overflow-hidden bg-[#ffffff] flex flex-col justify-between border-b border-[#eaeaea]"
      >
        {/* Three.js 3D 粒子矩阵 Canvas 容器（z-0 置于文字后方） */}
        <div
          ref={heroCanvasMountRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[62%] z-0 opacity-90"
        />

        {/* 1. 顶部视觉焦点区 (Top 48%, 高度约 460px, 居中排版) */}
        <div
          ref={heroTopTextRef}
          className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-8 flex-[0_0_48%] min-h-[430px] flex flex-col items-center justify-start text-center"
        >
          {/* Eyebrow（距顶部 80px） */}
          <div className="pt-[80px] text-[13px] font-medium text-[#666666] tracking-[2px]">
            XCTF·AI | 一站式 AI 生态运营服务平台
          </div>

          {/* 主标题（距顶部小字 24px，字号 64-68px，行高 1.1） */}
          <h1 className="mt-[24px] text-4xl sm:text-5xl lg:text-[68px] font-bold text-[#1a1a1a] leading-[1.1] tracking-tight max-w-5xl">
            让 AI 能力可见，让技术价值兑现。
          </h1>

          {/* 副标题（距主标题 20px，字号 16px，最大宽度 800px 居中） */}
          <p className="mt-[20px] text-[16px] font-normal text-[#666666] leading-[1.6] max-w-[800px] mx-auto">
            融合 AI 培训认证、热门赛事、算力交易、社区共享、资源协作及 OPC 合作的一站式 AI 实战与交付运营服务平台。
          </p>

          {/* CTA 按钮组（距副标题 40px，横向排列，间距 24px） */}
          <div className="mt-[40px] flex flex-wrap items-center justify-center gap-[24px]">
            <button
              type="button"
              onClick={() => setActiveTab('training')}
              className="px-7 py-3.5 bg-[#1a1a1a] hover:bg-[#333333] text-[#ffffff] text-[14px] font-semibold rounded-[4px] inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>开启认证之旅</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className="py-1.5 bg-transparent text-[#1a1a1a] hover:opacity-65 text-[14px] font-semibold border-b border-[#1a1a1a] transition-opacity cursor-pointer whitespace-nowrap"
            >
              探索企业任务大厅
            </button>
          </div>
        </div>

        {/* 2. 中部业务飞轮区 (Middle 32%, 高度约 300px, 距上方按钮组约 60px) */}
        <div
          ref={heroFlywheelRef}
          className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-8 flex-[0_0_32%] mt-[60px] flex items-center"
        >
          <div
            onMouseLeave={() => setHoveredFlywheelIdx(null)}
            className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FLYWHEEL_ITEMS.map((item, idx) => {
              const isHovered = hoveredFlywheelIdx === idx;
              const isDimmed = hoveredFlywheelIdx !== null && hoveredFlywheelIdx !== idx;

              return (
                <div
                  key={item.num}
                  onMouseEnter={() => setHoveredFlywheelIdx(idx)}
                  onClick={() => setActiveTab(item.targetTab)}
                  className={`relative px-6 lg:px-8 py-6 cursor-pointer transition-opacity duration-300 ${
                    isDimmed ? 'opacity-30' : 'opacity-100'
                  }`}
                >
                  {/* 四列之间 1px 极浅灰竖线 (#eaeaea)，高度占飞轮区 60% */}
                  {idx > 0 && (
                    <span
                      aria-hidden="true"
                      className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-[60%] bg-[#eaeaea]"
                    />
                  )}

                  <div className="max-w-[240px] mx-auto text-left">
                    {/* 序号：字号 14px，字重 600，浅灰 #999999 */}
                    <div className="text-[14px] font-semibold text-[#999999] font-mono">
                      {item.num}
                    </div>

                    {/* 主词：字号 28px，字重 600，深黑 #1a1a1a，距序号 8px */}
                    <div
                      className={`mt-[8px] text-[28px] font-semibold text-[#1a1a1a] leading-tight transition-transform duration-300 origin-left ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    >
                      {item.title}
                    </div>

                    {/* 补充描述：字号 14px，深灰 #666666，行高 1.8，距主词 12px */}
                    <p className="mt-[12px] text-[14px] text-[#666666] leading-[1.8]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. 底部合作厂商墙 (Bottom 20%, 垂直靠下居中对齐，留出 40px 底部安全边距) */}
        <div
          ref={heroLogosRef}
          className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-8 flex-1 flex flex-col justify-end pb-[40px] mt-[40px]"
        >
          {/* 顶部过渡语 */}
          <div className="text-center text-[12px] font-medium text-[#999999] tracking-[4px] mb-7">
            // 携手全球顶尖 AI 生态伙伴
          </div>

          {/* Logo 展示区：横向一行等距排列，初始透明度 0.4，悬浮平滑过渡到 1 */}
          <div className="w-full flex flex-wrap items-center justify-between gap-6 sm:gap-10">
            {PARTNER_LOGOS.map((partner) => (
              <div
                key={partner.name}
                className="partner-logo-item flex items-center gap-2.5 text-[#1a1a1a] opacity-40 hover:opacity-100 transition-opacity duration-300 select-none cursor-default"
              >
                {partner.mark}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[16px] font-semibold tracking-tight">
                    {partner.name}
                  </span>
                  <span className="hidden xl:inline text-[10px] font-mono tracking-widest uppercase">
                    {partner.en}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          📊 栏目二：数据与生态概览（信任背书 + 热门动态）
          背景：极浅灰 (#fafafa)，左右非对称分栏（左 40% 数据，右 60% 列表）
         ===================================================================== */}
      <section
        ref={section2Ref}
        className="w-full bg-[#fafafa] border-b border-[#eaeaea] py-[120px]"
      >
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8">
          {/* 栏目顶部标题 */}
          <div className="gsap-fade-up pb-12 border-b border-[#eaeaea] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[13px] font-mono uppercase tracking-[2px] text-[#666666]">
                02 / ECOSYSTEM TELEMETRY &amp; LIVE DYNAMICS
              </div>
              <h2 className="mt-2 text-[32px] font-semibold text-[#1a1a1a] tracking-tight leading-tight">
                数据与生态概览
              </h2>
            </div>
            <p className="text-[14px] text-[#666666] max-w-md">
              真实可验证的人才认证规模、高频实战赛事与即将开课的交付实训班次。
            </p>
          </div>

          {/* 左右非对称分栏：左 40% 数据，右 60% 列表 */}
          <div className="mt-14 flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            {/* 左侧 40%：宏观数据与人员分布 */}
            <div
              ref={section2LeftRef}
              className="w-full lg:w-[40%] shrink-0 space-y-12"
            >
              {/* 超大数字指标 */}
              <div className="gsap-fade-up grid grid-cols-2 gap-8 pb-10 border-b border-[#eaeaea]">
                <div>
                  <div className="text-[13px] text-[#666666] font-medium">
                    已认证 AI 工程师
                  </div>
                  <div className="mt-2 text-5xl sm:text-[64px] font-semibold text-[#1a1a1a] leading-none tabular-nums tracking-tight">
                    <span ref={certCountSpanRef}>12,850+</span>
                  </div>
                  <div className="mt-3 text-[12px] text-[#999999]">
                    覆盖大模型研发、FDE 交付与安全攻防
                  </div>
                </div>

                <div>
                  <div className="text-[13px] text-[#666666] font-medium">
                    累计开班班次
                  </div>
                  <div className="mt-2 text-5xl sm:text-[64px] font-semibold text-[#1a1a1a] leading-none tabular-nums tracking-tight">
                    <span ref={classCountSpanRef}>86</span>
                  </div>
                  <div className="mt-3 text-[12px] text-[#999999]">
                    平均完课率 96.4% · 实操占比 &gt; 60%
                  </div>
                </div>
              </div>

              {/* 人员分布：行业占比（极简细长条形图） */}
              <div className="gsap-fade-up space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#1a1a1a]">
                    认证人员行业占比
                  </h3>
                  <span className="text-[12px] font-mono text-[#999999]">
                    INDUSTRY BREAKDOWN
                  </span>
                </div>

                <div className="space-y-4">
                  {INDUSTRY_DISTRIBUTION.map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-[#1a1a1a] font-medium">{item.label}</span>
                        <span className="text-[#666666] font-mono tabular-nums">{item.percent}%</span>
                      </div>
                      <div className="w-full h-[3px] bg-[#eaeaea] overflow-hidden">
                        <div
                          className="h-full bg-[#1a1a1a] transition-all duration-700"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 人员分布：城市分布（浅灰极简标签） */}
              <div className="gsap-fade-up space-y-4 pt-4 border-t border-[#eaeaea]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#1a1a1a]">
                    核心城市分布
                  </h3>
                  <span className="text-[12px] font-mono text-[#999999]">
                    TOP CITIES
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {CITY_DISTRIBUTION.map((city) => (
                    <span
                      key={city}
                      className="px-3 py-1.5 bg-[#ffffff] border border-[#eaeaea] text-[13px] text-[#666666] font-mono"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧 60%：近期热门（上方 3 个热门赛事 + 下方近期开班信息牌） */}
            <div
              ref={section2RightRef}
              className="w-full lg:w-[60%] space-y-12"
            >
              {/* 上方：3 个热门赛事 */}
              <div className="gsap-fade-up space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#1a1a1a]">
                    近期热门赛事
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('creative')}
                    className="text-[13px] text-[#666666] hover:text-[#1a1a1a] inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>全部赛事</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {HOT_COMPETITIONS.map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => setActiveTab('creative')}
                      className="group bg-[#fafafa] hover:bg-[#ffffff] border border-[#eaeaea] hover:border-[#1a1a1a] p-5 transition-colors duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-[#1a1a1a] text-[#ffffff] text-[11px] font-mono">
                            [{comp.status}]
                          </span>
                          <span className="text-[12px] font-mono text-[#999999]">
                            {comp.deadline}
                          </span>
                        </div>
                        <div className="text-[16px] font-semibold text-[#1a1a1a] truncate">
                          {comp.title}
                        </div>
                        <div className="text-[14px] text-[#666666]">
                          {comp.reward}
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1a1a1a] group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                          <span>查看赛事</span>
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 下方：近期开班（类似航班信息牌的列表） */}
              <div className="gsap-fade-up space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#1a1a1a]">
                    近期开班计划（实时席位看板）
                  </h3>
                  <span className="text-[12px] font-mono text-[#999999]">
                    LIVE ENROLLMENT BOARD
                  </span>
                </div>

                <div className="border-t border-[#eaeaea] divide-y divide-[#eaeaea]">
                  {UPCOMING_CLASSES.map((cls) => (
                    <div
                      key={cls.code}
                      onClick={() => setSelectedClassForSignup(cls)}
                      className="group bg-[#fafafa] hover:bg-[#ffffff] px-4 py-4 border-x border-transparent hover:border-[#1a1a1a] transition-colors duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        <span className="text-[12px] font-mono text-[#999999] shrink-0 pt-0.5 sm:pt-0">
                          {cls.code}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[15px] font-semibold text-[#1a1a1a] truncate">
                            {cls.name}
                          </div>
                          <div className="text-[12px] text-[#666666] font-mono mt-0.5">
                            {cls.date} · {cls.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                        <span
                          className={`text-[12px] font-mono px-2.5 py-0.5 border ${
                            cls.urgent
                              ? 'bg-[#1a1a1a] text-[#ffffff] border-[#1a1a1a] font-semibold'
                              : 'bg-[#ffffff] text-[#666666] border-[#eaeaea]'
                          }`}
                        >
                          {cls.seatsText}
                        </span>

                        <span className="text-[13px] font-semibold text-[#1a1a1a] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                          <span>直接报名</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          🏢 栏目三：OPC 生态协作平台（超级个体创业）
          白底，横向 4 列布局，列与列之间用竖线隔开，底部点缀一行极简功能标签
         ===================================================================== */}
      <section
        ref={section3Ref}
        className="w-full bg-[#ffffff] border-b border-[#eaeaea] py-[120px] overflow-hidden"
      >
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8">
          {/* 栏目头部 */}
          <div className="gsap-fade-up pb-12 border-b border-[#eaeaea] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[13px] font-mono uppercase tracking-[2px] text-[#666666]">
                03 / ONE-PERSON COMPANY (OPC) COLLABORATION NETWORK
              </div>
              <h2 className="mt-2 text-[32px] font-semibold text-[#1a1a1a] tracking-tight leading-tight">
                OPC 生态协作平台 · 超级个体创业
              </h2>
            </div>
            <p className="text-[14px] text-[#666666] max-w-md">
              不仅提供高质量就业通道，更为独立 AI 开发者构建“单人成军”的创业与副业变现基础设施。
            </p>
          </div>

          {/* 横向 4 列抽屉滑出布局，列与列之间用 1px 竖线隔开 */}
          <div
            ref={opcCardsContainerRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#eaeaea] border-b border-[#eaeaea]"
          >
            {/* 模块 1：覆盖区域 */}
            <div
              onClick={() => setOpcCityModalOpen(true)}
              className="opc-drawer-col group p-8 lg:p-10 bg-[#ffffff] hover:bg-[#fafafa] transition-colors cursor-pointer flex flex-col justify-between min-h-[290px]"
            >
              <div>
                <div className="text-[13px] font-mono text-[#999999]">
                  01 / COVERAGE
                </div>
                <div className="mt-4 text-5xl font-semibold text-[#1a1a1a] tabular-nums tracking-tight">
                  54+ <span className="text-[16px] font-normal text-[#666666]">城市</span>
                </div>
                <h3 className="mt-5 text-[18px] font-semibold text-[#1a1a1a]">
                  覆盖区域
                </h3>
                <p className="mt-2 text-[14px] text-[#666666] leading-relaxed">
                  全国核心科创城市 OPC 节点网络，提供属地化算力补贴与免租工位政策。
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#eaeaea] flex items-center justify-between text-[13px] font-semibold text-[#1a1a1a]">
                <span>查看社区地图与政策</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 模块 2：生态伙伴 */}
            <div
              onClick={() => {
                setPartnerFormSubmitted(false);
                setOpcPartnerModalOpen(true);
              }}
              className="opc-drawer-col group p-8 lg:p-10 bg-[#ffffff] hover:bg-[#fafafa] transition-colors cursor-pointer flex flex-col justify-between min-h-[290px]"
            >
              <div>
                <div className="text-[13px] font-mono text-[#999999]">
                  02 / PARTNERS
                </div>
                <div className="mt-4 text-5xl font-semibold text-[#1a1a1a] tabular-nums tracking-tight">
                  300+ <span className="text-[16px] font-normal text-[#666666]">企业</span>
                </div>
                <h3 className="mt-5 text-[18px] font-semibold text-[#1a1a1a]">
                  生态伙伴
                </h3>
                <p className="mt-2 text-[14px] text-[#666666] leading-relaxed">
                  连接头部大模型厂商、政企需求方与产业资本，持续释放真实交付订单。
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#eaeaea] flex items-center justify-between text-[13px] font-semibold text-[#1a1a1a]">
                <span>留下合作意向</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 模块 3：用户数量 */}
            <div
              onClick={() => setActiveTab('community')}
              className="opc-drawer-col group p-8 lg:p-10 bg-[#ffffff] hover:bg-[#fafafa] transition-colors cursor-pointer flex flex-col justify-between min-h-[290px]"
            >
              <div>
                <div className="text-[13px] font-mono text-[#999999]">
                  03 / SUPER INDIVIDUALS
                </div>
                <div className="mt-4 text-5xl font-semibold text-[#1a1a1a] tabular-nums tracking-tight">
                  <span ref={opcUserCountSpanRef}>45W+</span>{' '}
                  <span className="text-[16px] font-normal text-[#666666]">超级个体</span>
                </div>
                <h3 className="mt-5 text-[18px] font-semibold text-[#1a1a1a]">
                  用户数量
                </h3>
                <p className="mt-2 text-[14px] text-[#666666] leading-relaxed">
                  汇聚全栈 AI 工程师、智能体创作者与算法极客，以个人或微团队完成商业交付。
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#eaeaea] flex items-center justify-between text-[13px] font-semibold text-[#1a1a1a]">
                <span>探索极客社区</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 模块 4：资源对接 */}
            <div
              onClick={() => setActiveTab('tasks')}
              className="opc-drawer-col group p-8 lg:p-10 bg-[#ffffff] hover:bg-[#fafafa] transition-colors cursor-pointer flex flex-col justify-between min-h-[290px]"
            >
              <div>
                <div className="text-[13px] font-mono text-[#999999]">
                  04 / MONETIZATION
                </div>
                <div className="mt-4 text-5xl font-semibold text-[#1a1a1a] tabular-nums tracking-tight">
                  100% <span className="text-[16px] font-normal text-[#666666]">托管保障</span>
                </div>
                <h3 className="mt-5 text-[18px] font-semibold text-[#1a1a1a]">
                  资源对接
                </h3>
                <p className="mt-2 text-[14px] text-[#666666] leading-relaxed">
                  直通企业悬赏任务大厅，资金与积分双重托管冻结，验收即刻自动清算打款。
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#eaeaea] flex items-center justify-between text-[13px] font-semibold text-[#1a1a1a]">
                <span>跳转任务大厅接单变现</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* 底部长尾标签 */}
          <div className="gsap-fade-up pt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[14px] font-medium text-[#666666] tracking-wider">
            <span>政策速配</span>
            <span className="text-[#eaeaea]">·</span>
            <span>算力补贴</span>
            <span className="text-[#eaeaea]">·</span>
            <span>订单撮合</span>
            <span className="text-[#eaeaea]">·</span>
            <span>免费工位</span>
            <span className="text-[#eaeaea]">·</span>
            <span>投资对接</span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          🛒 栏目四：资源枢纽与生态集市（资源推广与转化）
          深色背景 (#1a1a1a) + 顶部平滑过渡 + “一大两小”非对称卡片 + 底部粒子汇聚呼应首屏
         ===================================================================== */}
      <div
        aria-hidden="true"
        className="w-full h-24 bg-gradient-to-b from-[#ffffff] via-[#f0f0f0] to-[#1a1a1a]"
      />

      <section
        ref={section4Ref}
        className="relative w-full bg-[#1a1a1a] text-[#ffffff] py-[120px] overflow-hidden"
      >
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-8">
          {/* 栏目头部 */}
          <div className="gsap-fade-up pb-12 border-b border-[#2e2e2e] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[13px] font-mono uppercase tracking-[2px] text-[#999999]">
                04 / RESOURCE HUB &amp; ECOSYSTEM MARKETPLACE
              </div>
              <h2 className="mt-2 text-[32px] font-semibold text-[#ffffff] tracking-tight leading-tight">
                资源枢纽与生态集市
              </h2>
            </div>
            <p className="text-[14px] text-[#999999] max-w-md">
              打通高性价比模型路由、独立 AI 资产交易集市与弹性 GPU 算力底座。
            </p>
          </div>

          {/* “一大两小”非对称卡片布局 */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 左侧大卡（近期模型优惠 · 3D Tilt 倾斜 + 发光折线图） */}
            <div
              onMouseMove={handleDiscountCardMove}
              onMouseLeave={handleDiscountCardLeave}
              style={{
                transform: cardTilt.active
                  ? `perspective(1000px) rotateX(${cardTilt.rx.toFixed(2)}deg) rotateY(${cardTilt.ry.toFixed(2)}deg)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                transition: cardTilt.active ? 'transform 80ms linear' : 'transform 400ms ease-out'
              }}
              className="gsap-fade-up lg:col-span-7 bg-[#141414] border border-[#2e2e2e] hover:border-[#666666] p-8 sm:p-10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono uppercase tracking-[2px] text-[#999999]">
                    FEATURED OFFER · TOKEN GATEWAY
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#ffffff] text-[#1a1a1a] text-[11px] font-mono font-semibold">
                    限时阶梯折扣
                  </span>
                </div>

                <h3 className="text-[28px] sm:text-[32px] font-semibold text-[#ffffff] tracking-tight">
                  数安次元 · 模型折扣
                </h3>

                <p className="text-[14px] text-[#999999] leading-relaxed max-w-xl">
                  基于 Digitoken 数元网关统一 API 接入全网主流旗舰大模型（DeepSeek-V3 / Qwen-2.5 / GLM-4 / Claude），认证极客与 OPC 团队享专属 Token 路由阶梯折扣，综合推理成本直降 42%。
                </p>
              </div>

              {/* 极简折线图线框（鼠标悬浮时线条产生发光动效） */}
              <div className="my-8 p-5 bg-[#1a1a1a] border border-[#2a2a2a]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#999999] mb-3">
                  <span>TOKEN THROUGHPUT &amp; COST INDEX</span>
                  <span className="text-[#ffffff]">AVG COST -42.0% ↓</span>
                </div>

                <svg
                  viewBox="0 0 520 140"
                  className="w-full h-36 block overflow-visible"
                  fill="none"
                >
                  {/* 网格线 */}
                  <line x1="0" y1="25" x2="520" y2="25" stroke="#262626" strokeWidth="1" />
                  <line x1="0" y1="70" x2="520" y2="70" stroke="#262626" strokeWidth="1" />
                  <line x1="0" y1="115" x2="520" y2="115" stroke="#262626" strokeWidth="1" />

                  {/* 传统直连成本参考虚线 */}
                  <polyline
                    points="10,95 110,88 210,82 310,76 410,72 510,68"
                    stroke="#555555"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />

                  {/* 数安次元吞吐与折扣曲线（悬浮高亮发光） */}
                  <polyline
                    points="10,118 95,102 185,78 275,64 365,38 450,26 510,16"
                    stroke="#ffffff"
                    strokeWidth={cardTilt.active ? '2.4' : '1.6'}
                    style={{
                      filter: cardTilt.active
                        ? 'drop-shadow(0 0 8px rgba(255,255,255,0.85))'
                        : 'none',
                      transition: 'filter 250ms ease, stroke-width 250ms ease'
                    }}
                  />
                  {[
                    [10, 118],
                    [95, 102],
                    [185, 78],
                    [275, 64],
                    [365, 38],
                    [450, 26],
                    [510, 16]
                  ].map(([cx, cy], i) => (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={cardTilt.active ? 3.5 : 2.5}
                      fill="#ffffff"
                    />
                  ))}
                </svg>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#666666] mt-2">
                  <span>Tier 1 (10M Tokens)</span>
                  <span>Tier 2 (100M Tokens)</span>
                  <span>Enterprise (1B+ Tokens)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="text-[12px] font-mono text-[#999999]">
                  兼容 OpenAI 标准接口 · 毫秒级自动故障切换
                </div>
                <button
                  type="button"
                  onClick={() => setDiscountHubModalOpen(true)}
                  className="px-6 py-3 bg-[#ffffff] hover:bg-[#e5e5e5] text-[#1a1a1a] text-[14px] font-semibold rounded-[4px] inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>前往数安次元</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 右侧两小卡（右上：AI 集市；右下：算力与 Token） */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              {/* 右上卡：AI 集市 */}
              <div className="gsap-fade-up flex-1 bg-[#141414] border border-[#2e2e2e] hover:border-[#666666] p-8 flex flex-col justify-between transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-mono uppercase tracking-[2px] text-[#999999]">
                      INDEPENDENT ECOSYSTEM
                    </span>
                    <span className="text-[11px] font-mono text-[#999999] border border-[#333333] px-2 py-0.5">
                      独立运营中心
                    </span>
                  </div>
                  <h3 className="text-[24px] font-semibold text-[#ffffff] tracking-tight">
                    AI 集市
                  </h3>
                  <p className="text-[14px] text-[#999999] leading-relaxed">
                    模型 · 数据集 · Skill 插件一站式交易。现已升级为独立生态集市运营，支持在线免配置沙盒试用与开发者 85% 固定高比例分润。
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#262626] flex items-center justify-between">
                  <span className="text-[12px] font-mono text-[#666666]">
                    2,400+ 经过安全审计的 AI 资产
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('marketplace')}
                    className="px-5 py-2.5 bg-transparent hover:bg-[#ffffff] text-[#ffffff] hover:text-[#1a1a1a] border border-[#ffffff] text-[13px] font-semibold rounded-[4px] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>进入集市</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 右下卡：算力与 Token */}
              <div className="gsap-fade-up flex-1 bg-[#141414] border border-[#2e2e2e] hover:border-[#666666] p-8 flex flex-col justify-between transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-mono uppercase tracking-[2px] text-[#999999]">
                      ELASTIC GPU &amp; TOKENS
                    </span>
                    <span className="text-[11px] font-mono text-[#999999] border border-[#333333] px-2 py-0.5">
                      秒级就绪
                    </span>
                  </div>
                  <h3 className="text-[24px] font-semibold text-[#ffffff] tracking-tight">
                    算力与 Token
                  </h3>
                  <p className="text-[14px] text-[#999999] leading-relaxed">
                    按需购买，弹性 GPU 集群（NVIDIA A100 / H800 / RTX 4090）一键拉起 JupyterLab 与 SSH 容器，支持平台积分直接抵扣算力账单。
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#262626] flex items-center justify-between">
                  <span className="text-[12px] font-mono text-[#666666]">
                    低至 ¥2.80 / GPU 时 · 按分钟计费
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('compute')}
                    className="px-5 py-2.5 bg-[#ffffff] hover:bg-[#e5e5e5] text-[#1a1a1a] text-[13px] font-semibold rounded-[4px] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>立即选购</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 底部细小粒子汇聚条：呼应首屏粒子矩阵，完成首尾视觉闭环 */}
          <div
            ref={footerCanvasMountRef}
            className="mt-24 pt-10 border-t border-[#262626] flex flex-col items-center justify-center text-center"
          >
            <svg
              viewBox="0 0 640 42"
              className="w-full max-w-[640px] h-10 block opacity-60"
              fill="none"
            >
              {Array.from({ length: 48 }).map((_, i) => {
                const x = (i / 47) * 620 + 10;
                const distFromMid = Math.abs(i - 23.5) / 23.5;
                const y = 21 + Math.sin(i * 0.55) * (1 - distFromMid) * 12;
                const r = (1 - distFromMid * 0.6) * 2.1;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={r}
                    fill={i % 2 === 0 ? '#ffffff' : '#777777'}
                  />
                );
              })}
            </svg>
            <div className="mt-3 text-[12px] font-mono tracking-[3px] text-[#666666]">
              XCTF·AI · FROM CAPABILITY TO VALUE REALIZATION
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          弹窗 1：OPC 覆盖区域（54+ 城市社区地图与属地政策弹窗）
         ===================================================================== */}
      {opcCityModalOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setOpcCityModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-[580px] bg-[#ffffff] border border-[#eaeaea] p-8 text-[#1a1a1a]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpcCityModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-[#999999] hover:text-[#1a1a1a] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-[12px] font-mono text-[#666666] tracking-[2px]">
              OPC NODE CITIES &amp; POLICIES
            </div>
            <h3 className="mt-1 text-[22px] font-semibold text-[#1a1a1a]">
              全国 54+ 城市 OPC 超级个体社区与政策速配
            </h3>
            <p className="mt-1.5 text-[13px] text-[#666666]">
              通过平台能力认证的开发者，可免押金申请入驻各地 OPC 实体空间并申领属地算力补贴。
            </p>

            <div className="mt-6 border-t border-b border-[#eaeaea] divide-y divide-[#eaeaea] max-h-[340px] overflow-y-auto">
              {OPC_CITY_POLICIES.map((item) => (
                <div key={item.city} className="py-4 space-y-1">
                  <div className="text-[14px] font-semibold text-[#1a1a1a]">
                    {item.city}
                  </div>
                  <div className="text-[13px] text-[#666666] leading-relaxed">
                    {item.policy}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-[12px] text-[#666666]">
                咨询入驻专线：400-882-9100
              </span>
              <button
                type="button"
                onClick={() => {
                  setOpcCityModalOpen(false);
                  setActiveTab('training');
                }}
                className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#333333] text-[#ffffff] text-[13px] font-semibold rounded-[4px] cursor-pointer"
              >
                前往获取认证准入资格 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          弹窗 2：OPC 生态伙伴（300+ 企业合作意向与联系方式弹窗）
         ===================================================================== */}
      {opcPartnerModalOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setOpcPartnerModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-[520px] bg-[#ffffff] border border-[#eaeaea] p-8 text-[#1a1a1a]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpcPartnerModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-[#999999] hover:text-[#1a1a1a] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-[12px] font-mono text-[#666666] tracking-[2px]">
              ECOSYSTEM PARTNERSHIP
            </div>
            <h3 className="mt-1 text-[22px] font-semibold text-[#1a1a1a]">
              成为 XCTF·AI 生态合作伙伴
            </h3>
            <p className="mt-1.5 text-[13px] text-[#666666]">
              连接 45W+ 超级个体与 12,850+ 认证工程师，支持企业外包发包、联合认证及算力供给合作。
            </p>

            {/* 平台合作直联信息 */}
            <div className="mt-5 p-4 bg-[#fafafa] border border-[#eaeaea] flex items-center justify-between text-[13px]">
              <div>
                <div className="text-[#666666]">生态合作负责人：赵总监</div>
                <div className="text-[#1a1a1a] font-mono mt-0.5">
                  电话：400-882-9100 · 邮箱：partner@xctf-ai.com
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyAdvisorPhone}
                className="px-2.5 py-1.5 border border-[#eaeaea] bg-[#ffffff] hover:border-[#1a1a1a] text-[12px] inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPhone ? '已复制' : '复制电话'}</span>
              </button>
            </div>

            {partnerFormSubmitted ? (
              <div className="mt-6 p-6 bg-[#fafafa] border border-[#eaeaea] text-center space-y-3">
                <div className="text-[16px] font-semibold text-[#1a1a1a]">
                  合作意向已成功登记
                </div>
                <p className="text-[13px] text-[#666666]">
                  我们已收到「{partnerForm.company}」的合作申请，生态合作团队将在 1 个工作日内与您对接。
                </p>
                <button
                  type="button"
                  onClick={() => setOpcPartnerModalOpen(false)}
                  className="px-5 py-2 bg-[#1a1a1a] text-[#ffffff] text-[13px] font-semibold rounded-[4px] cursor-pointer"
                >
                  完成
                </button>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#666666] mb-1">
                    企业 / 机构名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.company}
                    onChange={(e) => setPartnerForm({ ...partnerForm, company: e.target.value })}
                    placeholder="请输入企业或机构全称"
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#eaeaea] focus:border-[#1a1a1a] outline-none text-[14px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-[#666666] mb-1">
                      联系人姓名 *
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerForm.contact}
                      onChange={(e) => setPartnerForm({ ...partnerForm, contact: e.target.value })}
                      placeholder="您的姓名"
                      className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#eaeaea] focus:border-[#1a1a1a] outline-none text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#666666] mb-1">
                      联系电话 *
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerForm.phone}
                      onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                      placeholder="手机或座机号码"
                      className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#eaeaea] focus:border-[#1a1a1a] outline-none text-[14px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#666666] mb-1">
                    合作方向
                  </label>
                  <select
                    value={partnerForm.type}
                    onChange={(e) => setPartnerForm({ ...partnerForm, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#eaeaea] focus:border-[#1a1a1a] outline-none text-[14px]"
                  >
                    <option value="算力与模型供给合作">算力与模型供给合作</option>
                    <option value="企业AI项目悬赏发包">企业 AI 项目悬赏发包</option>
                    <option value="联合培训认证与赛事">联合培训认证与赛事共建</option>
                    <option value="OPC园区与创投对接">OPC 园区入驻与创投对接</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#666666] mb-1">
                    合作需求简述
                  </label>
                  <textarea
                    rows={2}
                    value={partnerForm.note}
                    onChange={(e) => setPartnerForm({ ...partnerForm, note: e.target.value })}
                    placeholder="选填：简要描述您的合作诉求"
                    className="w-full px-3.5 py-2 bg-[#ffffff] border border-[#eaeaea] focus:border-[#1a1a1a] outline-none text-[14px] resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpcPartnerModalOpen(false)}
                    className="px-4 py-2.5 border border-[#eaeaea] text-[#666666] hover:text-[#1a1a1a] text-[13px] cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#333333] text-[#ffffff] text-[13px] font-semibold rounded-[4px] cursor-pointer"
                  >
                    提交合作意向
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          弹窗 3：近期开班直接报名弹窗
         ===================================================================== */}
      {selectedClassForSignup && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedClassForSignup(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-[460px] bg-[#ffffff] border border-[#eaeaea] p-8 text-[#1a1a1a]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedClassForSignup(null)}
              className="absolute top-5 right-5 p-1.5 text-[#999999] hover:text-[#1a1a1a] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-[12px] font-mono text-[#666666]">
              {selectedClassForSignup.code} · {selectedClassForSignup.seatsText}
            </div>
            <h3 className="mt-1 text-[20px] font-semibold text-[#1a1a1a]">
              锁定开班席位
            </h3>
            <p className="mt-1 text-[13px] text-[#666666]">
              {selectedClassForSignup.name}（{selectedClassForSignup.date} · {selectedClassForSignup.location}）
            </p>

            <form onSubmit={handleClassSignupSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#666666] mb-1">
                  学员姓名 *
                </label>
                <input
                  type="text"
                  required
                  value={classSignupForm.name}
                  onChange={(e) => setClassSignupForm({ ...classSignupForm, name: e.target.value })}
                  placeholder="请输入您的姓名"
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#eaeaea] focus:border-[#1a1a1a] outline-none text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#666666] mb-1">
                  联系电话 *
                </label>
                <input
                  type="text"
                  required
                  value={classSignupForm.phone}
                  onChange={(e) => setClassSignupForm({ ...classSignupForm, phone: e.target.value })}
                  placeholder="用于接收开班通知与实训账号"
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#eaeaea] focus:border-[#1a1a1a] outline-none text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#666666] mb-1">
                  所在单位 / 院校（选填）
                </label>
                <input
                  type="text"
                  value={classSignupForm.org}
                  onChange={(e) => setClassSignupForm({ ...classSignupForm, org: e.target.value })}
                  placeholder="企业或高校名称"
                  className="w-full px-3.5 py-2.5 bg-[#ffffff] border border-[#eaeaea] focus:border-[#1a1a1a] outline-none text-[14px]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedClassForSignup(null)}
                  className="px-4 py-2.5 border border-[#eaeaea] text-[#666666] text-[13px] cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#333333] text-[#ffffff] text-[13px] font-semibold rounded-[4px] cursor-pointer"
                >
                  确认报名锁席
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          弹窗 4：数安次元 · 模型折扣独立预览与跳转弹窗
         ===================================================================== */}
      {discountHubModalOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setDiscountHubModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-[520px] bg-[#ffffff] border border-[#eaeaea] p-8 text-[#1a1a1a]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDiscountHubModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-[#999999] hover:text-[#1a1a1a] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-[12px] font-mono text-[#666666] tracking-[2px]">
              SHU&apos;AN DIMENSION · MODEL DISCOUNT SCHEDULE
            </div>
            <h3 className="mt-1 text-[22px] font-semibold text-[#1a1a1a]">
              数安次元 · 企业级大模型折扣清单
            </h3>
            <p className="mt-1.5 text-[13px] text-[#666666]">
              通过 Digitoken 数元网关统一分发，支持按 Token 实时计费与多模型负载均衡。
            </p>

            <div className="mt-5 border-t border-b border-[#eaeaea] divide-y divide-[#eaeaea] text-[13px]">
              {[
                { model: 'DeepSeek-V3 / R1 满血版', official: '¥2.00 / 1M', discount: '¥1.15 / 1M (-42%)' },
                { model: 'GLM-4-Plus 企业增强版', official: '¥5.00 / 1M', discount: '¥2.90 / 1M (-42%)' },
                { model: 'Qwen-2.5-72B-Instruct', official: '¥4.00 / 1M', discount: '¥2.40 / 1M (-40%)' },
                { model: 'Claude-3.7-Sonnet 路由专线', official: '¥21.00 / 1M', discount: '¥14.50 / 1M (-31%)' }
              ].map((row) => (
                <div key={row.model} className="py-3.5 flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#1a1a1a]">{row.model}</span>
                  <div className="text-right font-mono">
                    <span className="text-[#999999] line-through mr-2.5">{row.official}</span>
                    <span className="text-[#1a1a1a] font-semibold">{row.discount}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDiscountHubModalOpen(false)}
                className="px-4 py-2.5 border border-[#eaeaea] text-[#666666] text-[13px] cursor-pointer"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={() => {
                  setDiscountHubModalOpen(false);
                  setActiveTab('trial');
                }}
                className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#333333] text-[#ffffff] text-[13px] font-semibold rounded-[4px] cursor-pointer"
              >
                前往 Digitoken 数元网关申请试用 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
