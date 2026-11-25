import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useApp } from '../../context/AppContext';
import { FeedPost } from '../../types';
import { AdvisorContactModal } from '../training/AdvisorContactModal';
import { ArrowRight, ArrowUpRight, Folder, Puzzle, Eye, ThumbsUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FlywheelItem {
  num: string;
  title: string;
  desc: string;
  targetTab: 'training' | 'tasks' | 'creative' | 'compute' | 'community';
}

const FLYWHEEL_ITEMS: FlywheelItem[] = [
  {
    num: '01',
    title: '培训',
    desc: '体系化 AI 课程与前沿实训，筑牢大模型开发与工程化底座。',
    targetTab: 'training'
  },
  {
    num: '02',
    title: '实战',
    desc: '直连真实企业需求与 AI 赛事，淬炼高价值场景的项目交付力。',
    targetTab: 'creative'
  },
  {
    num: '03',
    title: '社区',
    desc: '聚合全网 AI 赛事、厂商动态与前沿资讯，打造极客技术交流圈。',
    targetTab: 'community'
  },
  {
    num: '04',
    title: '兑现',
    desc: '接单赚赏金，兑海量 Token，直通 OPC 生态，技术价值高效变现。',
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

const DEFAULT_FIVE_BOARDS = ['技术前沿', '极客圆桌', '厂商动态', '行业快讯', '活动速递'];

function extractPlainSummary(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_~|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFeaturedSnippet(post: FeedPost): { label: string; lines: string[] } {
  const codeMatch = post.content.match(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/);
  if (codeMatch) {
    const lang = (codeMatch[1] || 'CODE').toUpperCase();
    const rawLines = codeMatch[2]
      .split('\n')
      .map((l) => l.trimEnd())
      .filter((l) => l.trim().length > 0)
      .slice(0, 4);
    if (rawLines.length > 0) {
      return { label: `${lang} · EXCERPT`, lines: rawLines };
    }
  }

  // Fallback: crisp monospace key-point digest extracted from the featured post
  const bulletLines = post.content
    .split('\n')
    .map((line) => line.replace(/^[\s>*#\-\d.]+/, '').replace(/\*\*/g, '').trim())
    .filter((line) => line.length >= 12 && !line.startsWith('```'))
    .slice(0, 3);

  const tagsLine =
    post.tags && post.tags.length > 0
      ? post.tags.slice(0, 3).map((t) => `#${t}`).join('  ')
      : `#${post.board}  #实战精选`;

  return {
    label: `${post.board} · DIGEST`,
    lines: [
      `$ topic --board "${post.board}" --author "${post.author}"`,
      ...(bulletLines.length > 0
        ? bulletLines.slice(0, 2).map((l) => `> ${l.length > 54 ? `${l.slice(0, 54)}...` : l}`)
        : ['> 深度拆解核心架构演进与生产级工程落地实践']),
      `tags: ${tagsLine}`
    ]
  };
}

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

export const HomeView06: React.FC = () => {
  const {
    setActiveTab,
    posts,
    communityBoards,
    openPostDetailWithOrigin,
    setSelectedPostIdForDetail
  } = useApp();

  // 从 5 个社区板块各挑选 1 条互动量最高的热门帖子，按热度排序（第 1 条为头条大卡，后 4 条为紧凑列表）
  const { featuredCommunityPost, compactCommunityPosts, featuredSnippet } = useMemo(() => {
    const enabledBoardNames = communityBoards
      .filter((b) => b.status === '已启用')
      .sort((a, b) => a.sortWeight - b.sortWeight)
      .map((b) => b.name);

    const targetBoards = (enabledBoardNames.length > 0 ? enabledBoardNames : DEFAULT_FIVE_BOARDS).slice(0, 5);
    const validPosts = posts.filter((p) => p.status !== '已驳回' && p.status !== '待审核');

    const calcScore = (p: FeedPost) =>
      (p.likesCount || 0) * 3 + (p.commentsCount || 0) * 5 + (p.viewsCount || 0) * 0.02;

    const pickedByBoard: FeedPost[] = [];
    const usedIds = new Set<string>();

    for (const boardName of targetBoards) {
      const candidates = validPosts
        .filter((p) => p.board === boardName && !usedIds.has(p.id))
        .sort((a, b) => calcScore(b) - calcScore(a));
      if (candidates.length > 0) {
        pickedByBoard.push(candidates[0]);
        usedIds.add(candidates[0].id);
      }
    }

    // 若不足 5 条，从全站最热帖子补齐至 5 条
    if (pickedByBoard.length < 5) {
      const remaining = validPosts
        .filter((p) => !usedIds.has(p.id))
        .sort((a, b) => calcScore(b) - calcScore(a));
      for (const p of remaining) {
        if (pickedByBoard.length >= 5) break;
        pickedByBoard.push(p);
        usedIds.add(p.id);
      }
    }

    const sortedTop5 = [...pickedByBoard].sort((a, b) => calcScore(b) - calcScore(a));
    const topOne = sortedTop5[0] || null;
    return {
      featuredCommunityPost: topOne,
      compactCommunityPosts: sortedTop5.slice(1, 5),
      featuredSnippet: topOne ? extractFeaturedSnippet(topOne) : null
    };
  }, [posts, communityBoards]);

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

  const section3Ref = useRef<HTMLElement | null>(null);
  const opcCardsContainerRef = useRef<HTMLDivElement | null>(null);
  const opcUserCountSpanRef = useRef<HTMLSpanElement | null>(null);

  const section4Ref = useRef<HTMLElement | null>(null);
  const footerCanvasMountRef = useRef<HTMLDivElement | null>(null);

  // Scroll progress shared with Three.js render loop
  const heroScrollProgressRef = useRef<number>(0);

  // Flywheel hover state
  const [hoveredFlywheelIdx, setHoveredFlywheelIdx] = useState<number | null>(null);

  // Modals state
  const [opcPartnerModalOpen, setOpcPartnerModalOpen] = useState(false);
  const [selectedClassForSignup, setSelectedClassForSignup] = useState<UpcomingClassItem | null>(null);

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

      // 4) Section 2 uses clean Swiss grid alignment without vertical parallax offset

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

          {/* 主标题（单行不折行，流体字号自适应视口） */}
          <h1 className="mt-[24px] text-[clamp(24px,4.2vw,60px)] font-bold text-[#1a1a1a] leading-[1.15] tracking-tight whitespace-nowrap">
            让 AI 能力可见，让技术价值兑现。
          </h1>

          {/* 副标题（单行不折行，流体字号自适应视口） */}
          <p className="mt-[20px] text-[clamp(12px,1.15vw,16px)] font-normal text-[#666666] leading-[1.6] sm:whitespace-nowrap mx-auto">
            融合 AI 培训认证、热门赛事、社区共享、资源协作、供需对接及 OPC 合作的一站式 AI 实战与交付运营服务平台。
          </p>

          {/* CTA 按钮组（距副标题 40px，横向排列，间距 24px） */}
          <div className="mt-[40px] flex flex-wrap items-center justify-center gap-[24px]">
            <button
              type="button"
              onClick={() => setActiveTab('training')}
              className="px-7 py-3.5 bg-[#1a1a1a] hover:bg-[#333333] text-[#ffffff] text-[14px] font-semibold rounded-[4px] inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>开启课程培训</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className="py-1.5 bg-transparent text-[#1a1a1a] hover:opacity-65 text-[14px] font-semibold border-b border-[#1a1a1a] transition-opacity cursor-pointer whitespace-nowrap"
            >
              探索任务大厅
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
          📊 栏目二：数据与生态概览（社区五大板块精选热帖 + 热门赛事与开班动态）
          纯白背景 (#ffffff)，瑞士极简 48:52 均衡双栏布局，无冗余底色与边框
         ===================================================================== */}
      <section
        ref={section2Ref}
        className="w-full bg-[#ffffff] border-b border-[#eaeaea] py-[112px]"
      >
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8">
          {/* 栏目顶部标题 */}
          <div className="gsap-fade-up pb-10 border-b border-[#eaeaea] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[13px] font-mono uppercase tracking-[2px] text-[#666666]">
                02 / LIVE &amp; TRENDING
              </div>
              <h2 className="mt-2 text-[32px] font-semibold text-[#1a1a1a] tracking-tight leading-tight">
                开发者生态前沿
              </h2>
            </div>
            <p className="text-[14px] text-[#666666] max-w-md">
              从最新技术探讨到实战竞技，一站式获取高质量技术成长资源。
            </p>
          </div>

          {/* 48:52 瑞士极简双栏布局：顶部基线与左右边界严格对齐，留白+细线取代多余框线 */}
          <div className="mt-12 flex flex-col lg:flex-row items-stretch">
            {/* 左侧 48%：社区板块精选（纯白无边框，靠顶部细线与留白建立层级） */}
            <div
              ref={section2LeftRef}
              className="gsap-fade-up w-full lg:w-[48%] shrink-0 flex flex-col justify-between lg:pr-12 lg:border-r lg:border-[#f0f0f0]"
            >
              <div>
                {/* 左侧子标题：与右侧「近期热门赛事」高度与基线严格对齐 */}
                <div className="h-7 flex items-baseline justify-between mb-5">
                  <h3 className="text-[16px] font-semibold text-[#000000] leading-none">
                    社区板块精选
                  </h3>
                  <span className="text-[11px] font-mono tracking-wider text-[#999999]">
                    TOP 5 BOARDS
                  </span>
                </div>

                {/* 1. 头条热帖（弱化代码块为浅灰底细边框，确保标题始终是第一视觉焦点） */}
                {featuredCommunityPost && (
                  <article
                    onClick={() => openPostDetailWithOrigin(featuredCommunityPost.id, 'home')}
                    className="group cursor-pointer border-t border-[#eaeaea] pt-6 pb-8 -mx-3 px-3 rounded-[4px] transition-colors duration-200 hover:bg-[#fafafa]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-[#f4f4f4] text-[#555555] rounded-[3px] leading-tight">
                        {featuredCommunityPost.board}
                      </span>
                      <span className="text-[11px] font-mono text-[#999999] tabular-nums">
                        头条精选 · {featuredCommunityPost.time}
                      </span>
                    </div>

                    <h4 className="mt-3.5 text-[20px] sm:text-[21px] font-bold text-[#000000] leading-[1.4] tracking-tight transition-transform duration-200 group-hover:translate-x-[2px]">
                      {featuredCommunityPost.title ||
                        extractPlainSummary(featuredCommunityPost.content).slice(0, 42)}
                    </h4>

                    <p className="mt-2.5 text-[13.5px] text-[#666666] leading-[1.7] line-clamp-2">
                      {extractPlainSummary(featuredCommunityPost.content)}
                    </p>

                    {/* 轻量化极简浅灰代码摘要区（替代沉重黑块，保留极客质感与呼吸感） */}
                    {featuredSnippet && (
                      <div className="mt-4 bg-[#f7f7f7] border border-[#eaeaea] rounded-[4px] overflow-hidden">
                        <div className="px-3.5 py-1.5 border-b border-[#efefef] flex items-center justify-between text-[10.5px] font-mono text-[#888888]">
                          <span>{featuredSnippet.label}</span>
                          <span className="text-[#a3a3a3]">DIGEST</span>
                        </div>
                        <pre className="px-3.5 py-3 text-[11.5px] font-mono leading-[1.7] overflow-hidden">
                          <code className="block truncate">
                            {featuredSnippet.lines.map((line, i) => (
                              <span
                                key={i}
                                className={`block truncate ${
                                  i === 0
                                    ? 'text-[#1e3a5f] font-medium'
                                    : i === 1
                                      ? 'text-[#0f5e56]'
                                      : 'text-[#52525b]'
                                }`}
                              >
                                {line}
                              </span>
                            ))}
                          </code>
                        </pre>
                      </div>
                    )}

                    {/* 底部作者与互动数据（右边界与下方列表严格对齐） */}
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={featuredCommunityPost.authorAvatar}
                          alt={featuredCommunityPost.author}
                          className="w-5 h-5 rounded-full object-cover grayscale border border-[#eaeaea] shrink-0"
                        />
                        <span className="text-[12px] font-medium text-[#1a1a1a] truncate">
                          {featuredCommunityPost.author}
                        </span>
                        {featuredCommunityPost.authorTag && (
                          <span className="hidden sm:inline text-[11px] text-[#999999] truncate">
                            · {featuredCommunityPost.authorTag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3.5 text-[12px] font-mono text-[#999999] tabular-nums shrink-0">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" strokeWidth={1.6} />
                          <span>
                            {(
                              featuredCommunityPost.viewsCount ??
                              Math.max(1280, featuredCommunityPost.likesCount * 9)
                            ).toLocaleString('en-US')}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.6} />
                          <span>{featuredCommunityPost.likesCount}</span>
                        </span>
                      </div>
                    </div>
                  </article>
                )}

                {/* 2. 列表热帖（上方留白解耦，极淡虚线分隔，去方括号标签，右边界严格对齐） */}
                <div className="mt-2 border-t border-[#eaeaea] divide-y divide-dashed divide-[#ececec]">
                  {compactCommunityPosts.map((post) => {
                    const displayTitle =
                      post.title || extractPlainSummary(post.content).slice(0, 48);
                    return (
                      <div
                        key={post.id}
                        onClick={() => openPostDetailWithOrigin(post.id, 'home')}
                        className="group py-4 -mx-3 px-3 rounded-[4px] transition-colors duration-200 hover:bg-[#fafafa] cursor-pointer flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="shrink-0 inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-[#f4f4f4] text-[#555555] rounded-[3px] leading-tight">
                            {post.board}
                          </span>
                          <span className="text-[14px] font-medium text-[#000000] truncate transition-transform duration-200 group-hover:translate-x-[2px]">
                            {displayTitle}
                          </span>
                          <ArrowRight
                            className="w-3.5 h-3.5 text-[#1a1a1a] shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                            strokeWidth={1.75}
                          />
                        </div>

                        <div className="shrink-0 flex items-center justify-end gap-1.5 text-[12px] font-mono text-[#999999] tabular-nums">
                          <ThumbsUp className="w-3 h-3" strokeWidth={1.6} />
                          <span>{post.likesCount}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. 底部信息解耦：独立右对齐操作链接 + 最底部克制微型活跃数据 */}
              <div className="mt-8">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPostIdForDetail(null);
                      setActiveTab('community');
                    }}
                    className="group text-[13px] font-medium text-[#1a1a1a] hover:opacity-65 inline-flex items-center gap-1.5 transition-opacity cursor-pointer"
                  >
                    <span>探索更多社区干货</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </div>

                <div className="mt-6 pt-5 border-t border-[#f0f0f0] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[11.5px] text-[#a3a3a3] font-mono tabular-nums">
                  <div className="flex items-center gap-3.5">
                    <span>
                      今日新增帖子 <span className="text-[#666666] font-medium">128</span> 篇
                    </span>
                    <span className="text-[#e5e5e5]">/</span>
                    <span>
                      在线开发者 <span className="text-[#666666] font-medium">2,400</span> 人
                    </span>
                  </div>
                  <span className="text-[#b0b0b0]">实时同步</span>
                </div>
              </div>
            </div>

            {/* 右侧 52%：近期热门赛事 + 近期开班计划（去外框、用细线与 40px 留白建立节奏） */}
            <div
              ref={section2RightRef}
              className="w-full lg:w-[52%] flex flex-col justify-between lg:pl-12 pt-12 lg:pt-0"
            >
              {/* 上方：3 个热门赛事（去卡片边框，顶部细线+淡分割线，圆点状态标识） */}
              <div className="gsap-fade-up">
                <div className="h-7 flex items-baseline justify-between mb-5">
                  <h3 className="text-[16px] font-semibold text-[#000000] leading-none">
                    近期热门赛事
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('creative')}
                    className="text-[12.5px] text-[#666666] hover:text-[#000000] inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>全部赛事</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="border-t border-[#eaeaea] divide-y divide-[#f0f0f0]">
                  {HOT_COMPETITIONS.map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => setActiveTab('creative')}
                      className="group -mx-3 px-3 py-5 rounded-[4px] hover:bg-[#fafafa] transition-colors duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2.5 text-[12px]">
                          <span className="inline-flex items-center gap-1.5 font-medium text-[#1a1a1a]">
                            <span
                              aria-hidden="true"
                              className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"
                            />
                            <span>{comp.status}</span>
                          </span>
                          <span className="text-[#d4d4d4]" aria-hidden="true">·</span>
                          <span className="font-mono text-[#999999] tabular-nums">
                            {comp.deadline}
                          </span>
                        </div>
                        <div className="text-[15px] font-semibold text-[#000000] truncate transition-transform duration-200 group-hover:translate-x-[2px]">
                          {comp.title}
                        </div>
                        <div className="text-[13px] text-[#666666]">
                          {comp.reward}
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#1a1a1a] group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                          <span>查看赛事</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 下方：近期开班计划（与上方赛事保持 40px 充裕留白，瘦身批次号与余位标识） */}
              <div className="gsap-fade-up mt-10">
                <div className="h-7 flex items-baseline justify-between mb-5">
                  <h3 className="text-[16px] font-semibold text-[#000000] leading-none">
                    近期开班计划
                  </h3>
                  <span className="text-[11px] font-mono tracking-wider text-[#999999]">
                    LIVE ENROLLMENT BOARD
                  </span>
                </div>

                <div className="border-t border-[#eaeaea] divide-y divide-[#f0f0f0]">
                  {UPCOMING_CLASSES.map((cls) => (
                    <div
                      key={cls.code}
                      onClick={() => setSelectedClassForSignup(cls)}
                      className="group -mx-3 px-3 py-4 rounded-[4px] hover:bg-[#fafafa] transition-colors duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <span className="text-[10.5px] font-mono text-[#a3a3a3] tracking-wide w-[66px] shrink-0 pt-0.5 sm:pt-0">
                          {cls.code}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[14px] font-medium text-[#000000] truncate transition-transform duration-200 group-hover:translate-x-[2px]">
                            {cls.name}
                          </div>
                          <div className="text-[12px] text-[#888888] font-mono mt-0.5 tabular-nums">
                            {cls.date} · {cls.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <span
                          className={`text-[11.5px] font-medium px-2 py-0.5 rounded-[3px] whitespace-nowrap tabular-nums ${
                            cls.urgent
                              ? 'bg-[#fff1f2] text-[#9f1239]'
                              : 'bg-[#f5f5f5] text-[#737373]'
                          }`}
                        >
                          {cls.seatsText}
                        </span>

                        <span className="text-[12.5px] font-medium text-[#1a1a1a] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
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
        className="w-full bg-[#ffffff] pt-[120px] pb-[96px] overflow-hidden"
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
            {/* 模块 1：覆盖区域（新窗口打开独立页 OPC 生态社区与政策网络） */}
            <a
              href={`${typeof window !== 'undefined' ? window.location.pathname : '/'}?standalone=opc-network`}
              target="_blank"
              rel="noopener noreferrer"
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
                <span>查询OPC政策</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* 模块 2：生态伙伴 */}
            <div
              onClick={() => setOpcPartnerModalOpen(true)}
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
                <span>寻求商务合作</span>
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
                <span>前往大厅接单</span>
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
          🛒 栏目四：资源枢纽与生态集市（黑底 #111111，左右等宽双卡，gap 24px）
         ===================================================================== */}
      <section
        ref={section4Ref}
        className="relative w-full bg-[#111111] border-t border-[#2A2A2A] text-[#FFFFFF] pt-[96px] pb-[120px] overflow-hidden"
      >
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-8">
          {/* 栏目头部 */}
          <div className="gsap-fade-up pb-12 border-b border-[#262626] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[13px] font-mono uppercase tracking-[2px] text-[#999999]">
                04 / RESOURCE HUB &amp; ECOSYSTEM MARKETPLACE
              </div>
              <h2 className="mt-2 text-[32px] font-semibold text-[#FFFFFF] tracking-tight leading-tight">
                资源枢纽与生态集市
              </h2>
            </div>
            <p className="text-[14px] text-[#999999] max-w-md">
              统一大模型 API 网关与高质量 AI 资产市场，打通底层推理供给与上层应用研发。
            </p>
          </div>

          {/* 左右双卡等宽分布，中间 gap: 24px */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-[24px] items-stretch">
            {/* 🃏 卡片一（左）：数安词源 · 模型 API 网关 */}
            <div className="gsap-fade-up bg-[#161616] border border-[#2C2C2C] hover:border-[#4A4A4A] rounded-[6px] p-8 sm:p-10 flex flex-col justify-between transition-colors">
              <div>
                {/* 顶部眉标与右上角标签 */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-mono uppercase tracking-[2px] text-[#999999]">
                    DIGITOKEN GATEWAY
                  </span>
                  <span className="px-2.5 py-0.5 rounded-[4px] border border-[#333333] bg-[#1A1A1A] text-[#FFFFFF] text-[12px] font-medium">
                    官方直连
                  </span>
                </div>

                {/* 主标题 */}
                <h3 className="mt-4 text-[24px] sm:text-[26px] font-semibold text-[#FFFFFF] tracking-tight leading-snug">
                  数安词源 · 大模型 API
                </h3>

                {/* 正文描述 */}
                <p className="mt-3 text-[14px] text-[#999999] leading-[1.7]">
                  统一接入全网主流大模型（DeepSeek / Qwen / GLM 等），兼容 OpenAI 标准接口，支持高并发与自动重试。按 Token 实际用量计费。
                </p>

                {/* 视觉替代区：核心模型极简文字行 + 极简代码终端框 */}
                <div className="mt-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] font-mono text-[#888888]">
                    <span className="text-[#FFFFFF]">DeepSeek-V3</span>
                    <span className="text-[#444444]">/</span>
                    <span>Qwen-2.5</span>
                    <span className="text-[#444444]">/</span>
                    <span>GLM-4</span>
                    <span className="text-[#444444]">/</span>
                    <span>OpenAI Compatible</span>
                  </div>

                  <div className="bg-[#0B0B0B] border border-[#333333] rounded-[6px] overflow-hidden">
                    <div className="px-4 py-2 border-b border-[#242424] bg-[#141414] flex items-center justify-between text-[11px] font-mono text-[#777777]">
                      <span>API REQUEST · HTTPS</span>
                      <span className="text-[#888888]">200 OK</span>
                    </div>
                    <pre className="p-5 text-[13px] font-mono leading-[1.85] overflow-x-auto select-text">
                      <code>
                        <span className="text-[#86EFAC]">POST</span>{' '}
                        <span className="text-[#FFFFFF]">/v1/chat/completions</span>
                        {'\n'}
                        <span className="text-[#888888]">Authorization:</span>{' '}
                        <span className="text-[#D4D4D4]">Bearer sk-xxx</span>
                        {'\n'}
                        <span className="text-[#888888]">&quot;model&quot;:</span>{' '}
                        <span className="text-[#86EFAC]">&quot;deepseek-v3&quot;</span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* 底部操作区 */}
              <div className="mt-8 pt-6 border-t border-[#2A2A2A] flex flex-wrap items-center justify-between gap-4">
                <span className="text-[12px] font-mono text-[#999999]">
                  按量计费 · 秒级弹性
                </span>
                <a
                  href="https://digitoken.cyberpeace.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#FFFFFF] hover:opacity-85 text-[#111111] text-[13px] font-semibold rounded-[4px] inline-flex items-center gap-1.5 transition-opacity whitespace-nowrap"
                >
                  <span>前往数安词源</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* 🃏 卡片二（右）：AI 资产集市 */}
            <div className="gsap-fade-up bg-[#161616] border border-[#2C2C2C] hover:border-[#4A4A4A] rounded-[6px] p-8 sm:p-10 flex flex-col justify-between transition-colors">
              <div>
                {/* 顶部眉标与右上角标签 */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-mono uppercase tracking-[2px] text-[#999999]">
                    DEVELOPER ASSETS
                  </span>
                  <span className="px-2.5 py-0.5 rounded-[4px] border border-[#333333] bg-[#1A1A1A] text-[#CCCCCC] text-[12px] font-medium">
                    独立运营
                  </span>
                </div>

                {/* 主标题 */}
                <h3 className="mt-4 text-[24px] sm:text-[26px] font-semibold text-[#FFFFFF] tracking-tight leading-snug">
                  数据集与 Skill 市场
                </h3>

                {/* 正文描述 */}
                <p className="mt-3 text-[14px] text-[#999999] leading-[1.7]">
                  汇聚高质量行业数据集与开箱即用的 AI Skill 插件。支持数据安全脱敏审核与沙盒试用，加速您的模型微调与应用开发。
                </p>

                {/* 视觉替代区：两个极简线框图标卡片横向并排展示 (#1A1A1A 背景 + #333 边框) */}
                <div className="mt-8 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#1A1A1A] border border-[#333333] rounded-[6px] p-5 flex flex-col justify-between min-h-[138px]">
                    <div className="w-9 h-9 rounded-[4px] border border-[#333333] bg-[#141414] flex items-center justify-center text-[#FFFFFF]">
                      <Folder className="w-5 h-5" strokeWidth={1.6} />
                    </div>
                    <div className="mt-5">
                      <div className="text-[24px] font-semibold text-[#FFFFFF] font-mono tabular-nums leading-none">
                        1,200+
                      </div>
                      <div className="mt-2 text-[13px] text-[#999999]">
                        高质量数据集
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A] border border-[#333333] rounded-[6px] p-5 flex flex-col justify-between min-h-[138px]">
                    <div className="w-9 h-9 rounded-[4px] border border-[#333333] bg-[#141414] flex items-center justify-center text-[#FFFFFF]">
                      <Puzzle className="w-5 h-5" strokeWidth={1.6} />
                    </div>
                    <div className="mt-5">
                      <div className="text-[24px] font-semibold text-[#FFFFFF] font-mono tabular-nums leading-none">
                        800+
                      </div>
                      <div className="mt-2 text-[13px] text-[#999999]">
                        开箱即用 Skill
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部操作区 */}
              <div className="mt-8 pt-6 border-t border-[#2A2A2A] flex flex-wrap items-center justify-between gap-4">
                <span className="text-[12px] font-mono text-[#999999]">
                  安全审计 · 极速交付
                </span>
                <a
                  href={`${typeof window !== 'undefined' ? window.location.pathname : '/'}?standalone=marketplace`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-transparent hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#111111] border border-[#FFFFFF]/60 hover:border-[#FFFFFF] text-[13px] font-medium rounded-[4px] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <span>进入 AI 集市</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
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
          弹窗 1：OPC 生态伙伴商务合作联系人弹窗（与认证详情联系人弹窗完全一致）
         ===================================================================== */}
      <AdvisorContactModal
        isOpen={opcPartnerModalOpen}
        onClose={() => setOpcPartnerModalOpen(false)}
        title="联系商务顾问"
        subtitlePrefix="合作方向："
        certification={{
          id: 'opc-partner-contact',
          systemId: 'aigc',
          name: 'XCTF·AI 生态合作与企业级商务对接',
          advisorContacts: [
            { label: '联系人', value: '赵总监（生态合作负责人）' },
            { label: '联系电话', value: '400-882-9100', copyable: true },
            { label: '电子邮箱', value: 'partner@xctf-ai.com', copyable: true },
            { label: '服务时段', value: '工作日 09:00 - 19:00' }
          ],
          advisorQrHint: '扫码添加专属商务顾问洽谈合作'
        }}
      />

      {/* =====================================================================
          弹窗 3：近期开班直接报名联系人弹窗（与认证详情「立即开通」弹窗完全一致）
         ===================================================================== */}
      {selectedClassForSignup && (
        <AdvisorContactModal
          isOpen={true}
          onClose={() => setSelectedClassForSignup(null)}
          subtitlePrefix="咨询班次："
          certification={{
            id: selectedClassForSignup.code,
            systemId: 'aigc',
            name: `${selectedClassForSignup.name}（${selectedClassForSignup.date} · ${selectedClassForSignup.location}）`,
            advisorContacts: [
              { label: '联系人', value: '林顾问（认证服务中心）' },
              { label: '联系电话', value: '400-886-2026 转 802', copyable: true },
              { label: '电子邮箱', value: 'certification@qianji-ai.cn', copyable: true },
              { label: '服务时段', value: '工作日 09:00 - 19:00' }
            ],
            advisorQrHint: '扫码添加专属顾问获取报名通道'
          }}
        />
      )}
    </div>
  );
};
