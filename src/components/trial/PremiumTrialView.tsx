import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  X,
  Copy,
  Check
} from 'lucide-react';
import trialLlmLabImg from '../../assets/images/trial_llm_lab_1795744499153.jpg';
import trialCyberRangeImg from '../../assets/images/trial_cyber_range_1795744497428.jpg';

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
    productName: '数安词源',
    contactPerson: '林工（AI 基础设施架构顾问）',
    phone: '400-882-9100 转 3',
    email: 'digitoken@qianji-ai.com',
    qrHint: '扫码添加专属顾问，领取「数安词源」测试 Token 与私有化部署包'
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
 * 统一平台截图展示外框（极简 Mac 浏览器窗口外壳 + 16:9 画面比例）
 */
const PlatformWindowFrame: React.FC<{
  src: string;
  alt: string;
  urlLabel: string;
}> = ({ src, alt, urlLabel }) => (
  <div className="w-full rounded-[8px] border border-[#EAEAEA] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] bg-[#FFFFFF]">
    {/* Mac 风格极简顶部窗口栏 */}
    <div className="h-9 px-3.5 bg-[#FAFAFA] border-b border-[#EAEAEA] flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
        <span className="w-2.5 h-2.5 rounded-full bg-[#D8D8D8]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#E2E2E2]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA]" />
      </div>
      <span className="text-[11px] font-mono text-[#888888] tracking-wide truncate">
        {urlLabel}
      </span>
      <div className="w-10 shrink-0" aria-hidden="true" />
    </div>
    {/* 16:9 平台实景截图 */}
    <img
      src={src}
      alt={alt}
      className="w-full aspect-video object-cover block"
    />
  </div>
);

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
    <div className="w-full max-w-[1320px] mx-auto pb-16 pt-2 antialiased text-[var(--text-main)]">
      <div className="w-full">
        {/* 1. 页面头部 (Header) */}
        <header className="pb-8 border-b border-[var(--border-light)]">
          <div className="space-y-2">
            <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[var(--text-main)] leading-tight">
              探索企业级 AI 基础设施
            </h1>
            <p className="text-[14px] text-[var(--text-sub)] leading-[1.6]">
              从大模型实训研发到数字孪生实战推演，打通底层算力到上层应用的全链路，为院校与企业提供低门槛、高可用的 AI 落地平台。
            </p>
          </div>
        </header>

        {/* 全宽画廊陈列窗：三大平台区块（Z 字形交替，大留白间距） */}
        <div className="py-12 sm:py-16 space-y-20 lg:space-y-[104px]">
          {/* =====================================================================
              2. 区块一：大模型实验场（左 45% 文字区，右 55% 16:9 截图区）
             ===================================================================== */}
          <section
            aria-labelledby="trial-section-lab-title"
            className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-10 lg:gap-12 items-center"
          >
            {/* 左侧（45% 文字区） */}
            <div className="min-w-0 space-y-5">
              <div className="space-y-2">
                <div className="text-[12px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                  01 / AI TRAINING &amp; R&amp;D PLATFORM
                </div>
                <h2
                  id="trial-section-lab-title"
                  className="text-[24px] sm:text-[28px] font-semibold text-[var(--text-main)] tracking-tight leading-snug"
                >
                  大模型实验场
                </h2>
                <p className="text-[14px] font-medium text-[var(--text-sub)]">
                  打通 AI 学习到研发全链路，赋能未来 AI 人才
                </p>
              </div>

              {/* 简介 */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[6px] p-4 text-[14px] text-[var(--text-sub)] leading-[1.6]">
                传统教育理论与实践脱节、技术门槛高、缺乏实战环境。本平台旨在连接学习与产业，提供体系化实战教学能力与低门槛模型开发方案。
              </div>

              {/* 四大核心能力（2x2 极简网格卡片布局，零阴影） */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[6px] p-4 space-y-1.5 hover:border-[var(--border-dark)] transition-colors">
                  <div className="text-[15px] font-semibold text-[var(--text-main)]">
                    AI实训
                  </div>
                  <p className="text-[13px] text-[var(--text-sub)] leading-[1.6]">
                    体系化实战教学，包含学习路径、课程训练、比赛测验、人才评估。
                  </p>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[6px] p-4 space-y-1.5 hover:border-[var(--border-dark)] transition-colors">
                  <div className="text-[15px] font-semibold text-[var(--text-main)]">
                    模型开发
                  </div>
                  <p className="text-[13px] text-[var(--text-sub)] leading-[1.6]">
                    覆盖数据标注、模型微调、模型评估全流程。
                  </p>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[6px] p-4 space-y-1.5 hover:border-[var(--border-dark)] transition-colors">
                  <div className="text-[15px] font-semibold text-[var(--text-main)]">
                    智能体开发
                  </div>
                  <p className="text-[13px] text-[var(--text-sub)] leading-[1.6]">
                    可视化搭建，包含知识库、MCP、Skill 仓库管理。
                  </p>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[6px] p-4 space-y-1.5 hover:border-[var(--border-dark)] transition-colors">
                  <div className="text-[15px] font-semibold text-[var(--text-main)]">
                    智能服务
                  </div>
                  <p className="text-[13px] text-[var(--text-sub)] leading-[1.6]">
                    一键部署，提供模型推理与智能体服务。
                  </p>
                </div>
              </div>

              {/* 亮点标签栏 */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {['国家职业技术技能标准', '700+ 实训课时', '60%+ 实操'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-[4px] text-[12px] font-normal bg-transparent text-[var(--text-main)] border border-[var(--border-dark)]"
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] bg-[var(--brand-color)] hover:opacity-80 text-[#FFFFFF] text-[14px] font-medium transition-opacity cursor-pointer"
                >
                  <span>申请免费试用</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 右侧（55% 16:9 平台截图区，统一 Mac 窗口外壳） */}
            <div className="min-w-0">
              <PlatformWindowFrame
                src={trialLlmLabImg}
                alt="大模型实验场平台工作台界面截图"
                urlLabel="lab.qianji-ai.com / workspace"
              />
            </div>
          </section>

          {/* =====================================================================
              3. 区块二：AI 数字孪生靶场（左 55% 16:9 截图区，右 45% 数据与文字区）
             ===================================================================== */}
          <section
            aria-labelledby="trial-section-range-title"
            className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-12 items-center"
          >
            {/* 左侧（55% 16:9 平台截图区，统一 Mac 窗口外壳） */}
            <div className="min-w-0 order-2 lg:order-1">
              <PlatformWindowFrame
                src={trialCyberRangeImg}
                alt="AI 数字孪生靶场网络拓扑与实战演练界面截图"
                urlLabel="range.qianji-ai.com / digital-twin"
              />
            </div>

            {/* 右侧（45% 数据与文字区：标题简介 -> 2x3 数据网格 -> 极细横线 -> 领域文字 -> 按钮） */}
            <div className="min-w-0 order-1 lg:order-2 flex flex-col">
              {/* 1. 标题与简介 */}
              <div className="space-y-2">
                <div className="text-[12px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                  02 / DIGITAL TWIN CYBER RANGE
                </div>
                <h2
                  id="trial-section-range-title"
                  className="text-[24px] sm:text-[28px] font-semibold text-[var(--text-main)] tracking-tight leading-snug"
                >
                  AI 数字孪生靶场
                </h2>
                <p className="text-[14px] font-medium text-[var(--text-sub)]">
                  以数字之身，铸实战之能
                </p>
              </div>

              <p className="mt-4 text-[14px] text-[var(--text-sub)] leading-[1.65]">
                基于底层云平台与高精度仿真引擎，内置千余个核心靶标与海量实战资源，为院校与企业提供全维度的实战演练环境。
              </p>

              {/* 2. 数据网格：2列 x 3行极简无边框网格 */}
              <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { value: '6000+', title: '教学课时', desc: '理论、视频与实验全覆盖' },
                  { value: '3500+', title: '竞赛赛题', desc: '涵盖理论题库与专项挑战' },
                  { value: '290+', title: '实战靶标', desc: '基础、应用与网络设备' },
                  { value: '60+', title: '综合场景', desc: '单兵/团队训练与红蓝对抗' },
                  { value: '1500+', title: '攻防资产', desc: '千余活体漏洞与安全工具' },
                  { value: '5大', title: '标准体系', desc: '教指委/高职/工控/NIST等' }
                ].map((metric) => (
                  <div key={metric.title} className="min-w-0">
                    <div className="text-[28px] font-bold text-[#000000] tracking-[-0.03em] leading-none tabular-nums">
                      {metric.value}
                    </div>
                    <div className="mt-2 text-[13px] font-medium text-[#333333] leading-snug">
                      {metric.title}
                    </div>
                    <p className="mt-0.5 text-[13px] text-[#777777] leading-[1.5]">
                      {metric.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* 3. 极细横线 + 4. 技术领域覆盖独立一行 */}
              <div className="mt-6 pt-4 border-t border-[#EAEAEA]">
                <p className="text-[13px] text-[#666666] leading-[1.65]">
                  <span className="text-[#333333] font-medium">技术领域覆盖：</span>
                  大模型 · 工控安全 · 车联网 · 数据安全 · 密码学 · 漏洞实战 等 13 大领域。
                </p>
              </div>

              {/* 5. 行动按钮（与上方领域说明保持舒展间距） */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setActiveModalKey('range')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] bg-[var(--brand-color)] hover:opacity-80 text-[#FFFFFF] text-[14px] font-medium transition-opacity cursor-pointer"
                >
                  <span>申请免费试用</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* =====================================================================
              4. 区块三：数安词源（左 45% 文字区，右 55% 代码框区）
             ===================================================================== */}
          <section
            aria-labelledby="trial-section-digitoken-title"
            className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-10 lg:gap-12 items-center"
          >
            {/* 左侧（45% 文字区） */}
            <div className="min-w-0 space-y-6">
              <div className="space-y-2">
                <div className="text-[12px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                  03 / UNIFIED ENTERPRISE AI GATEWAY
                </div>
                <h2
                  id="trial-section-digitoken-title"
                  className="text-[24px] sm:text-[28px] font-semibold text-[var(--text-main)] tracking-tight leading-snug"
                >
                  数安词源
                </h2>
                <p className="text-[14px] font-medium text-[var(--text-sub)]">
                  统一 API 网关，服务于海量 AI 模型
                </p>
              </div>

              {/* 简介 */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[6px] p-4 text-[14px] text-[var(--text-sub)] leading-[1.6]">
                基于 New API 深度开发的企业级 AI 资产基座。通过统一、标准的接口协议接入全网主流大模型，高效管理数字资产，为 AI 应用提供极速、安全、透明的 Token 分发与调用服务。
              </div>

              {/* 三大核心特性 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[6px] p-4 space-y-1.5 hover:border-[var(--border-dark)] transition-colors">
                  <div className="text-[14px] font-semibold text-[var(--text-main)]">
                    极速接入与路由
                  </div>
                  <p className="text-[12px] text-[var(--text-sub)] leading-[1.6]">
                    兼容 OpenAI、Claude、Gemini 等多协议，支持自动负载均衡与失败重试，毫秒级响应。
                  </p>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[6px] p-4 space-y-1.5 hover:border-[var(--border-dark)] transition-colors">
                  <div className="text-[14px] font-semibold text-[var(--text-main)]">
                    透明计费与管控
                  </div>
                  <p className="text-[12px] text-[var(--text-sub)] leading-[1.6]">
                    按 Token 用量实时计费，提供细粒度的速率限制、成本跟踪与多用户团队权限管理。
                  </p>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[6px] p-4 space-y-1.5 hover:border-[var(--border-dark)] transition-colors">
                  <div className="text-[14px] font-semibold text-[var(--text-main)]">
                    开源生态与自托管
                  </div>
                  <p className="text-[12px] text-[var(--text-sub)] leading-[1.6]">
                    社区驱动，支持完全私有化部署与灵活扩展，保障企业数据资产安全。
                  </p>
                </div>
              </div>

              {/* 行动按钮 */}
              <div className="pt-2">
                <a
                  href="https://digitoken.cyberpeace.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] bg-[var(--brand-color)] hover:opacity-80 text-[#FFFFFF] text-[14px] font-medium transition-opacity cursor-pointer"
                >
                  <span>前往免费试用</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* 右侧（55% 代码终端窗口，与截图外壳保持一致圆角与轻阴影） */}
            <div className="min-w-0">
              <div className="w-full rounded-[8px] bg-[#141414] border border-[#2E2E2E] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-[#E5E5E5]">
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
            className="relative w-full max-w-[440px] bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] p-7 sm:p-8 text-[#1A1A1A]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 右上角极简关闭按钮 */}
            <button
              type="button"
              onClick={() => setActiveModalKey(null)}
              aria-label="关闭弹窗"
              className="absolute top-5 right-5 p-1.5 rounded-[4px] text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F1F3F5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>

            {/* 弹窗标题 */}
            <div className="pr-8">
              <h2
                id="trial-contact-modal-title"
                className="text-[20px] font-semibold text-[#1A1A1A] tracking-tight"
              >
                申请免费试用
              </h2>
              <p className="text-[12px] text-[#666666] mt-1.5 truncate">
                意向平台：{currentContact.productName}
              </p>
            </div>

            {/* 联系人、电话、邮箱列表 */}
            <div className="mt-6 border-t border-b border-[#EAEAEA] divide-y divide-[#EAEAEA]">
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
                    <span className="text-[#1A1A1A] font-medium truncate tabular-nums">
                      {item.value}
                    </span>
                    {item.copyable && (
                      <button
                        type="button"
                        onClick={() => handleCopy(item.value)}
                        title="复制"
                        aria-label={`复制${item.label}`}
                        className="p-1 rounded-[4px] text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F1F3F5] transition-colors cursor-pointer shrink-0"
                      >
                        {copiedValue === item.value ? (
                          <Check className="w-3.5 h-3.5 text-[#1A1A1A]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 二维码区域 */}
            <div className="mt-6 bg-[#F8F9FA] border border-[#EAEAEA] rounded-[6px] p-6 flex flex-col items-center justify-center text-center">
              <div className="bg-[#FFFFFF] p-3 rounded-[6px] border border-[#EAEAEA]">
                <MinimalQrSvg seed={`trial-${currentContact.productName}`} />
              </div>
              <p className="text-[12px] text-[#666666] mt-3.5 leading-relaxed">
                {currentContact.qrHint}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
