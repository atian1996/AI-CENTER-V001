import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  X,
  Copy,
  Check
} from 'lucide-react';

interface TrialProductContact {
  productName: string;
  contactPerson: string;
  phone: string;
  email: string;
  qrHint: string;
}

const TRIAL_CONTACTS: Record<string, TrialProductContact> = {
  lab: {
    productName: '大模型实验场',
    contactPerson: '陈老师（企业与高校实训架构师）',
    phone: '400-882-9100 转 1',
    email: 'llm-lab@qianji-ai.com',
    qrHint: '扫码添加专属顾问，获取「大模型实验场」专属试用环境与课时权限'
  },
  range: {
    productName: 'AI 数字孪生靶场',
    contactPerson: '周工（仿真推演解决方案专家）',
    phone: '400-882-9100 转 2',
    email: 'cyber-range@qianji-ai.com',
    qrHint: '扫码添加专属顾问，获取「AI 数字孪生靶场」定制演练沙箱试用权限'
  },
  digitoken: {
    productName: 'Digitoken 数元网关',
    contactPerson: '林工（AI 基础设施架构顾问）',
    phone: '400-882-9100 转 3',
    email: 'digitoken@qianji-ai.com',
    qrHint: '扫码添加专属顾问，领取「Digitoken 数元网关」测试 Token 与私有化部署包'
  }
};

/**
 * 极简风格矢量二维码图形（黑白灰纯矢量渲染）
 */
const MinimalQrSvg: React.FC<{ seed: string }> = ({ seed }) => {
  const size = 21;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const isFinder = (r: number, c: number) => {
    const inTopLeft = r < 7 && c < 7;
    const inTopRight = r < 7 && c >= size - 7;
    const inBottomLeft = r >= size - 7 && c < 7;
    return inTopLeft || inTopRight || inBottomLeft;
  };

  const isSeparator = (r: number, c: number) => {
    if (r === 7 && c <= 7) return true;
    if (c === 7 && r <= 7) return true;
    if (r === 7 && c >= size - 8) return true;
    if (c === size - 8 && r <= 7) return true;
    if (r === size - 8 && c <= 7) return true;
    if (c === 7 && r >= size - 8) return true;
    return false;
  };

  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isFinder(r, c) || isSeparator(r, c)) continue;
      if (r >= 9 && r <= 11 && c >= 9 && c <= 11) continue;
      const v = ((r * 37 + c * 17 + hash) ^ (r * c + 13)) % 11;
      if (v < 5) {
        cells.push({ r, c });
      }
    }
  }

  const renderFinder = (x: number, y: number) => (
    <g key={`finder-${x}-${y}`}>
      <rect x={x} y={y} width={7} height={7} rx={0.8} fill="#1a1a1a" />
      <rect x={x + 1} y={y + 1} width={5} height={5} rx={0.4} fill="#ffffff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.3} fill="#1a1a1a" />
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-36 h-36 block"
      role="img"
      aria-label="高端试用申请二维码"
    >
      <rect x={0} y={0} width={size} height={size} fill="#ffffff" />
      {renderFinder(0, 0)}
      {renderFinder(size - 7, 0)}
      {renderFinder(0, size - 7)}
      {cells.map(({ r, c }) => (
        <rect
          key={`${r}-${c}`}
          x={c}
          y={r}
          width={0.92}
          height={0.92}
          rx={0.15}
          fill="#1a1a1a"
        />
      ))}
      <rect x={9.2} y={9.2} width={2.6} height={2.6} rx={0.5} fill="#1a1a1a" />
      <rect x={10} y={10} width={1} height={1} rx={0.2} fill="#ffffff" />
    </svg>
  );
};

/**
 * 极简线框行业图标（纯 SVG 绘制）
 */
const IndustryWireframeIcon: React.FC<{ type: 'defense' | 'energy' | 'industrial' | 'talent' }> = ({ type }) => {
  switch (type) {
    case 'defense':
      return (
        <svg className="w-4 h-4 text-[#1a1a1a] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z" />
          <path d="M12 8v8M8.5 12h7" />
        </svg>
      );
    case 'energy':
      return (
        <svg className="w-4 h-4 text-[#1a1a1a] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    case 'industrial':
      return (
        <svg className="w-4 h-4 text-[#1a1a1a] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'talent':
      return (
        <svg className="w-4 h-4 text-[#1a1a1a] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 4L2 9l10 5 10-5-10-5z" />
          <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
        </svg>
      );
  }
};

export const PremiumTrialView: React.FC = () => {
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const currentContact = activeModalKey ? TRIAL_CONTACTS[activeModalKey] : null;

  useEffect(() => {
    if (!activeModalKey) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalKey(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalKey]);

  const handleCopy = (val: string) => {
    try {
      navigator.clipboard?.writeText(val);
      setCopiedValue(val);
      window.setTimeout(() => {
        setCopiedValue((prev) => (prev === val ? null : prev));
      }, 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full bg-[#ffffff] text-[#1a1a1a] rounded-[12px] border border-[#eaeaea] px-6 sm:px-10 lg:px-14 py-8 sm:py-10 antialiased">
      {/* Centered Max-Width 1280px Gallery Container */}
      <div className="w-full max-w-[1280px] mx-auto">
        {/* 1. 页面头部 (Header) — 与培训认证页面头部排版保持一致 */}
        <header className="pb-8 border-b border-[#eaeaea]">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-[#1a1a1a] leading-tight">
              探索企业级 AI 基础设施
            </h1>
            <p className="text-sm text-[#666666] max-w-3xl leading-relaxed">
              从大模型实训研发到数字孪生实战推演，打通底层算力到上层应用的全链路，为院校与企业提供低门槛、高可用的 AI 落地平台。
            </p>
          </div>
        </header>

        {/* 全宽画廊陈列窗：三大平台区块（Z 字形交替，上下 120px 大留白间距） */}
        <div className="py-16 sm:py-24 space-y-24 lg:space-y-[120px]">
          {/* =====================================================================
              2. 区块一：大模型实验场（左文右图）
             ===================================================================== */}
          <section
            aria-labelledby="trial-section-lab-title"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
          >
            {/* 左侧（文字区） */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-[#666666]">
                  01 / AI TRAINING &amp; R&amp;D PLATFORM
                </div>
                <h2
                  id="trial-section-lab-title"
                  className="text-2xl sm:text-[28px] font-bold text-[#1a1a1a] tracking-tight leading-snug"
                >
                  大模型实验场
                </h2>
                <p className="text-[15px] font-medium text-[#666666]">
                  打通 AI 学习到研发全链路，赋能未来 AI 人才
                </p>
              </div>

              {/* 简介（灰色底块） */}
              <div className="bg-[#f7f7f7] border border-[#eaeaea] rounded-[10px] p-4 text-[13.5px] text-[#666666] leading-relaxed">
                传统教育理论与实践脱节、技术门槛高、缺乏实战环境。本平台旨在连接学习与产业，提供体系化实战教学能力与低门槛模型开发方案。
              </div>

              {/* 四大核心能力（2x2 极简网格卡片布局） */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-[#ffffff] border border-[#eaeaea] rounded-[10px] p-4 space-y-1.5 hover:border-[#1a1a1a] transition-colors">
                  <div className="text-[14px] font-semibold text-[#1a1a1a]">
                    AI实训
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    体系化实战教学，包含学习路径、课程训练、比赛测验、人才评估。
                  </p>
                </div>

                <div className="bg-[#ffffff] border border-[#eaeaea] rounded-[10px] p-4 space-y-1.5 hover:border-[#1a1a1a] transition-colors">
                  <div className="text-[14px] font-semibold text-[#1a1a1a]">
                    模型开发
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    覆盖数据标注、模型微调、模型评估全流程。
                  </p>
                </div>

                <div className="bg-[#ffffff] border border-[#eaeaea] rounded-[10px] p-4 space-y-1.5 hover:border-[#1a1a1a] transition-colors">
                  <div className="text-[14px] font-semibold text-[#1a1a1a]">
                    智能体开发
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    可视化搭建，包含知识库、MCP、Skill 仓库管理。
                  </p>
                </div>

                <div className="bg-[#ffffff] border border-[#eaeaea] rounded-[10px] p-4 space-y-1.5 hover:border-[#1a1a1a] transition-colors">
                  <div className="text-[14px] font-semibold text-[#1a1a1a]">
                    智能服务
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    一键部署，提供模型推理与智能体服务。
                  </p>
                </div>
              </div>

              {/* 亮点标签栏（横向排列的浅灰胶囊标签） */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {['国家职业技术技能标准', '700+ 实训课时', '60%+ 实操'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#f7f7f7] text-[#1a1a1a] border border-[#eaeaea]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 行动按钮 */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalKey('lab')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-[#1a1a1a] hover:bg-[#333333] text-[#ffffff] text-sm font-semibold transition-colors cursor-pointer"
                >
                  <span>申请免费试用</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 右侧（纯 CSS 绘制深色后台 UI 示意图） */}
            <div className="lg:col-span-6">
              <div className="w-full rounded-[12px] bg-[#1a1a1a] border border-[#2e2e2e] shadow-[0_16px_40px_rgba(0,0,0,0.08)] overflow-hidden text-[#ffffff]">
                {/* 顶部窗口栏（带三个浅灰圆点） */}
                <div className="px-4 py-3 border-b border-[#2e2e2e] bg-[#141414] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#666666]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#555555]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#444444]" />
                  </div>
                  <span className="text-[11px] font-mono text-[#999999] tracking-wider">
                    LLM-LAB STUDIO · WORKSPACE v2.4
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#262626] text-[#cccccc]">
                    GPU: 4×A100
                  </span>
                </div>

                {/* 内部三栏布局 */}
                <div className="grid grid-cols-12 min-h-[340px] divide-x divide-[#2a2a2a]">
                  {/* 左栏：极简模型列表 */}
                  <div className="col-span-3 p-3.5 space-y-2.5 bg-[#171717]">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#888888] pb-1 border-b border-[#2a2a2a]">
                      MODELS
                    </div>
                    {[
                      { name: 'GLM-4-9B-SFT', status: 'Active', active: true },
                      { name: 'Qwen-2.5-72B', status: 'Ready', active: false },
                      { name: 'DeepSeek-V3', status: 'Ready', active: false },
                      { name: 'Llama-3.3-70B', status: 'Idle', active: false },
                      { name: 'BGE-M3-Embed', status: 'Ready', active: false }
                    ].map((m) => (
                      <div
                        key={m.name}
                        className={`p-2 rounded-[6px] border text-left transition-colors ${
                          m.active
                            ? 'bg-[#262626] border-[#555555] text-[#ffffff]'
                            : 'bg-[#1c1c1c] border-[#2a2a2a] text-[#999999]'
                        }`}
                      >
                        <div className="text-[11px] font-mono font-medium truncate">
                          {m.name}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[9px] font-mono text-[#777777]">LoRA</span>
                          <span className="text-[9px] font-mono text-[#bbbbbb]">{m.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 中间：数据标注画布（配极简线框图形） */}
                  <div className="col-span-5 p-3.5 flex flex-col justify-between bg-[#1a1a1a]">
                    <div className="flex items-center justify-between pb-1 border-b border-[#2a2a2a]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                        ANNOTATION CANVAS
                      </span>
                      <span className="text-[10px] font-mono text-[#999999]">
                        #SAMPLE-0418
                      </span>
                    </div>

                    {/* 极简几何线框画布 */}
                    <div className="my-2.5 flex-1 rounded-[8px] border border-dashed border-[#3a3a3a] bg-[#141414] p-3 relative flex flex-col justify-between">
                      <svg
                        viewBox="0 0 220 150"
                        className="w-full h-36 block"
                        fill="none"
                      >
                        {/* 背景基准网格线 */}
                        <line x1="0" y1="35" x2="220" y2="35" stroke="#242424" strokeWidth="1" />
                        <line x1="0" y1="75" x2="220" y2="75" stroke="#242424" strokeWidth="1" />
                        <line x1="0" y1="115" x2="220" y2="115" stroke="#242424" strokeWidth="1" />
                        <line x1="55" y1="0" x2="55" y2="150" stroke="#242424" strokeWidth="1" />
                        <line x1="110" y1="0" x2="110" y2="150" stroke="#242424" strokeWidth="1" />
                        <line x1="165" y1="0" x2="165" y2="150" stroke="#242424" strokeWidth="1" />

                        {/* 标注框 1 */}
                        <rect
                          x="22"
                          y="20"
                          width="82"
                          height="66"
                          stroke="#e5e5e5"
                          strokeWidth="1.2"
                          strokeDasharray="3 2"
                        />
                        <rect x="22" y="10" width="44" height="10" fill="#e5e5e5" />
                        <text x="25" y="17.5" fill="#141414" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                          OBJ_01 0.98
                        </text>

                        {/* 标注中心十字与锚点 */}
                        <circle cx="63" cy="53" r="14" stroke="#888888" strokeWidth="1" />
                        <line x1="56" y1="53" x2="70" y2="53" stroke="#888888" strokeWidth="1" />
                        <line x1="63" y1="46" x2="63" y2="60" stroke="#888888" strokeWidth="1" />

                        {/* 多边形语义分割线框 2 */}
                        <polygon
                          points="126,38 192,28 202,98 140,122 118,82"
                          stroke="#999999"
                          strokeWidth="1.2"
                          fill="rgba(255,255,255,0.03)"
                        />
                        <circle cx="126" cy="38" r="2.2" fill="#ffffff" />
                        <circle cx="192" cy="28" r="2.2" fill="#ffffff" />
                        <circle cx="202" cy="98" r="2.2" fill="#ffffff" />
                        <circle cx="140" cy="122" r="2.2" fill="#ffffff" />
                        <circle cx="118" cy="82" r="2.2" fill="#ffffff" />
                      </svg>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#888888] pt-2 border-t border-[#242424]">
                        <span>BBOX: 2 · POLY: 5 PTS</span>
                        <span className="text-[#cccccc]">IAA: 99.2%</span>
                      </div>
                    </div>

                    {/* 底部指令标注条 */}
                    <div className="rounded-[6px] bg-[#141414] border border-[#2a2a2a] px-2.5 py-2 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#888888]">RLHF Reward Score</span>
                      <span className="text-[#ffffff] font-semibold">+0.942</span>
                    </div>
                  </div>

                  {/* 右栏：模型微调参数的深色折线图 */}
                  <div className="col-span-4 p-3.5 flex flex-col justify-between bg-[#171717]">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#888888] pb-1 border-b border-[#2a2a2a]">
                      FINE-TUNE METRICS
                    </div>

                    {/* 折线图 SVG */}
                    <div className="my-2 rounded-[8px] bg-[#121212] border border-[#2a2a2a] p-2.5">
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#888888] mb-1.5">
                        <span>TRAIN LOSS</span>
                        <span className="text-[#ffffff]">0.184 ↓</span>
                      </div>
                      <svg viewBox="0 0 160 84" className="w-full h-24 block" fill="none">
                        <line x1="0" y1="20" x2="160" y2="20" stroke="#222222" strokeWidth="1" />
                        <line x1="0" y1="45" x2="160" y2="45" stroke="#222222" strokeWidth="1" />
                        <line x1="0" y1="70" x2="160" y2="70" stroke="#222222" strokeWidth="1" />
                        {/* 评估基准虚线 */}
                        <polyline
                          points="4,18 32,32 60,44 88,52 116,58 154,61"
                          stroke="#666666"
                          strokeWidth="1.2"
                          strokeDasharray="2 2"
                        />
                        {/* 主训练 Loss 折线 */}
                        <polyline
                          points="4,12 28,36 54,49 82,60 112,67 136,71 154,73"
                          stroke="#ffffff"
                          strokeWidth="1.6"
                        />
                        <circle cx="154" cy="73" r="2.5" fill="#ffffff" />
                      </svg>
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#666666] mt-1">
                        <span>Step 0</span>
                        <span>Step 2.4k</span>
                        <span>Step 5.0k</span>
                      </div>
                    </div>

                    {/* 微调超参数列表 */}
                    <div className="space-y-1.5 text-[10px] font-mono">
                      <div className="flex items-center justify-between py-1 px-2 rounded bg-[#1f1f1f]">
                        <span className="text-[#888888]">Learning Rate</span>
                        <span className="text-[#e5e5e5]">2.0e-5</span>
                      </div>
                      <div className="flex items-center justify-between py-1 px-2 rounded bg-[#1f1f1f]">
                        <span className="text-[#888888]">LoRA Rank / Alpha</span>
                        <span className="text-[#e5e5e5]">64 / 128</span>
                      </div>
                      <div className="flex items-center justify-between py-1 px-2 rounded bg-[#1f1f1f]">
                        <span className="text-[#888888]">Epoch Progress</span>
                        <span className="text-[#ffffff]">3 / 3 (100%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              3. 区块二：AI 数字孪生靶场（左图右文）
             ===================================================================== */}
          <section
            aria-labelledby="trial-section-range-title"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
          >
            {/* 左侧（AI 数字孪生靶场架构图） */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="w-full rounded-[12px] bg-[#ffffff] border border-[#eaeaea] p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                <img
                  src="/assets/aistudio/image_a815fd5f.png"
                  alt="AI 数字孪生靶场架构图"
                  className="w-full h-auto block rounded-[8px] object-contain"
                />
              </div>
            </div>

            {/* 右侧（文字区） */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-[#666666]">
                  02 / DIGITAL TWIN CYBER RANGE
                </div>
                <h2
                  id="trial-section-range-title"
                  className="text-2xl sm:text-[28px] font-bold text-[#1a1a1a] tracking-tight leading-snug"
                >
                  AI 数字孪生靶场
                </h2>
                <p className="text-[15px] font-medium text-[#666666]">
                  以数字之身，铸实战之能
                </p>
              </div>

              {/* 简介 */}
              <p className="text-[14px] text-[#666666] leading-relaxed">
                基于底层云平台，通过高精度仿真推演与多场景构建，为各行业提供全维度的实战演练与科学评测。
              </p>

              {/* 适用行业（采用两列网格展示，每个行业配一个极简线框图标） */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                  适用行业场景
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    { label: '国防军工', type: 'defense' as const, desc: '复杂电磁与攻防态势推演' },
                    { label: '能源电力', type: 'energy' as const, desc: '电网关键设施数字孪生防护' },
                    { label: '工业控制', type: 'industrial' as const, desc: '工控协议仿真与应急演练' },
                    { label: '人才培养', type: 'talent' as const, desc: '高校与企业攻防实训考核' }
                  ].map((ind) => (
                    <div
                      key={ind.label}
                      className="bg-[#ffffff] border border-[#eaeaea] rounded-[10px] p-4 flex items-start gap-3 hover:border-[#1a1a1a] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-[#f7f7f7] border border-[#eaeaea] flex items-center justify-center shrink-0 mt-0.5">
                        <IndustryWireframeIcon type={ind.type} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-[#1a1a1a]">
                          {ind.label}
                        </div>
                        <div className="text-xs text-[#666666] mt-0.5 truncate">
                          {ind.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 行动按钮 */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalKey('range')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-[#1a1a1a] hover:bg-[#333333] text-[#ffffff] text-sm font-semibold transition-colors cursor-pointer"
                >
                  <span>申请免费试用</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* =====================================================================
              4. 区块三：Digitoken 数元网关（左文右图）
             ===================================================================== */}
          <section
            aria-labelledby="trial-section-digitoken-title"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
          >
            {/* 左侧（文字区） */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-[#666666]">
                  03 / UNIFIED ENTERPRISE AI GATEWAY
                </div>
                <h2
                  id="trial-section-digitoken-title"
                  className="text-2xl sm:text-[28px] font-bold text-[#1a1a1a] tracking-tight leading-snug"
                >
                  Digitoken 数元网关
                </h2>
                <p className="text-[15px] font-medium text-[#666666]">
                  统一 API 网关，服务于海量 AI 模型
                </p>
              </div>

              {/* 简介（灰色底块） */}
              <div className="bg-[#f7f7f7] border border-[#eaeaea] rounded-[10px] p-4 text-[13.5px] text-[#666666] leading-relaxed">
                基于 New API 深度开发的企业级 AI 资产基座。通过统一、标准的接口协议接入全网主流大模型，高效管理数字资产，为 AI 应用提供极速、安全、透明的 Token 分发与调用服务。
              </div>

              {/* 三大核心特性（横向排列的极简卡片） */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-[#ffffff] border border-[#eaeaea] rounded-[10px] p-4 space-y-1.5 hover:border-[#1a1a1a] transition-colors">
                  <div className="text-[14px] font-semibold text-[#1a1a1a]">
                    极速接入与路由
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    兼容 OpenAI、Claude、Gemini 等多协议，支持自动负载均衡与失败重试，毫秒级响应。
                  </p>
                </div>

                <div className="bg-[#ffffff] border border-[#eaeaea] rounded-[10px] p-4 space-y-1.5 hover:border-[#1a1a1a] transition-colors">
                  <div className="text-[14px] font-semibold text-[#1a1a1a]">
                    透明计费与管控
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    按 Token 用量实时计费，提供细粒度的速率限制、成本跟踪与多用户团队权限管理。
                  </p>
                </div>

                <div className="bg-[#ffffff] border border-[#eaeaea] rounded-[10px] p-4 space-y-1.5 hover:border-[#1a1a1a] transition-colors">
                  <div className="text-[14px] font-semibold text-[#1a1a1a]">
                    开源生态与自托管
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    社区驱动，支持完全私有化部署与灵活扩展，保障企业数据资产安全。
                  </p>
                </div>
              </div>

              {/* 行动按钮 */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalKey('digitoken')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-[#1a1a1a] hover:bg-[#333333] text-[#ffffff] text-sm font-semibold transition-colors cursor-pointer"
                >
                  <span>申请免费试用</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 右侧（纯 CSS 绘制极简代码终端窗口 Terminal） */}
            <div className="lg:col-span-6">
              <div className="w-full rounded-[12px] bg-[#141414] border border-[#2e2e2e] shadow-[0_16px_40px_rgba(0,0,0,0.08)] overflow-hidden text-[#e5e5e5]">
                {/* 顶部窗口栏（带三个圆点） */}
                <div className="px-4 py-3 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#666666]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#555555]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#444444]" />
                  </div>
                  <span className="text-[11px] font-mono text-[#999999]">
                    digitoken-gateway — bash — 80×24
                  </span>
                  <span className="text-[10px] font-mono text-[#777777]">
                    HTTPS / TLS 1.3
                  </span>
                </div>

                {/* 终端代码主体 */}
                <div className="p-5 sm:p-6 font-mono text-xs sm:text-[12.5px] leading-relaxed space-y-4">
                  <div className="text-[#888888]">
                    # Unified OpenAI-Compatible Endpoint Request
                  </div>

                  <pre className="text-[#e5e5e5] overflow-x-auto whitespace-pre leading-relaxed">
{`POST /v1/chat/completions HTTP/1.1
Host: api.digitoken.internal
Content-Type: application/json
Authorization: Bearer sk-digitoken-8f92a7c4e1b0...

{
  "model": "your-model",
  "messages": [
    {
      "role": "system",
      "content": "You are an enterprise AI assistant."
    },
    {
      "role": "user",
      "content": "Summarize Q4 compute token utilization."
    }
  ],
  "temperature": 0.2,
  "stream": false
}`}
                  </pre>

                  {/* 代码下方状态栏：展示 200 OK 状态码与 142ms 耗时 */}
                  <div className="pt-4 border-t border-[#262626] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#262626] text-[#ffffff] font-semibold border border-[#3a3a3a]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffffff]" />
                        200 OK
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#1f1f1f] text-[#cccccc] border border-[#2e2e2e]">
                        142ms
                      </span>
                    </div>
                    <div className="text-[11px] text-[#888888]">
                      Route: <span className="text-[#cccccc]">auto-lb → node-03</span> · Tokens: <span className="text-[#cccccc]">128</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* =====================================================================
          5. 弹窗交互（复用极简弹窗）：点击任意“申请免费试用”按钮触发
         ===================================================================== */}
      {currentContact && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-fade-in"
          onClick={() => setActiveModalKey(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="trial-contact-modal-title"
        >
          <div
            className="relative w-full max-w-[440px] bg-[#ffffff] border border-[#eaeaea] rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.16)] p-7 sm:p-8 text-[#1a1a1a]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 右上角极简关闭按钮 */}
            <button
              type="button"
              onClick={() => setActiveModalKey(null)}
              aria-label="关闭弹窗"
              className="absolute top-5 right-5 p-1.5 rounded-lg text-[#999999] hover:text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>

            {/* 弹窗标题 */}
            <div className="pr-8">
              <h2
                id="trial-contact-modal-title"
                className="text-xl font-semibold text-[#1a1a1a] tracking-tight"
              >
                申请免费试用
              </h2>
              <p className="text-xs text-[#666666] mt-1.5 truncate">
                意向平台：{currentContact.productName}
              </p>
            </div>

            {/* 联系人、电话、邮箱列表 */}
            <div className="mt-6 border-t border-b border-[#eaeaea] divide-y divide-[#eaeaea]">
              {[
                { label: '联系人', value: currentContact.contactPerson, copyable: false },
                { label: '联系电话', value: currentContact.phone, copyable: true },
                { label: '电子邮箱', value: currentContact.email, copyable: true }
              ].map((item) => (
                <div
                  key={item.label}
                  className="py-3.5 flex items-center justify-between gap-4 text-[14px]"
                >
                  <span className="text-[#666666] shrink-0 w-20 font-normal">
                    {item.label}
                  </span>
                  <div className="flex items-center justify-end gap-2 min-w-0">
                    <span className="text-[#1a1a1a] font-medium truncate tabular-nums">
                      {item.value}
                    </span>
                    {item.copyable && (
                      <button
                        type="button"
                        onClick={() => handleCopy(item.value)}
                        title="复制"
                        aria-label={`复制${item.label}`}
                        className="p-1 rounded text-[#999999] hover:text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors cursor-pointer shrink-0"
                      >
                        {copiedValue === item.value ? (
                          <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 二维码占位符区域 */}
            <div className="mt-6 bg-[#f7f7f7] border border-[#eaeaea] rounded-[12px] p-6 flex flex-col items-center justify-center text-center">
              <div className="bg-[#ffffff] p-3 rounded-[10px] border border-[#eaeaea]">
                <MinimalQrSvg seed={`trial-${currentContact.productName}`} />
              </div>
              <p className="text-xs text-[#666666] mt-3.5 leading-relaxed">
                {currentContact.qrHint}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
