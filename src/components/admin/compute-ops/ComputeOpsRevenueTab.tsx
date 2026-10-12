import React, { useState, useEffect } from 'react';
import {
  Coins,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  PieChart,
  ShieldCheck,
  ChevronRight,
  Play,
  Pause,
  Server,
  Activity,
  Layers
} from 'lucide-react';
import {
  mockRevenueTrends,
  mockRevenueBusinessShares,
  mockSettlementDetails,
  mockReconClosedLoopStatuses
} from './mockComputeOpsData';

export const ComputeOpsRevenueTab: React.FC = () => {
  // 折线图悬停数据点
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);

  // 结算明细滚动走马灯
  const [isTickerPlaying, setIsTickerPlaying] = useState<boolean>(true);
  const [tickerOffset, setTickerOffset] = useState<number>(0);

  // 结算明细滚动计时器：每 5 秒自动向上滚动一行
  useEffect(() => {
    if (!isTickerPlaying) return;
    const interval = setInterval(() => {
      setTickerOffset(prev => (prev + 1) % mockSettlementDetails.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isTickerPlaying]);

  // 折线图坐标计算 (12 个月份)
  const maxRevenue = 14000;
  const svgWidth = 780;
  const svgHeight = 250;
  const paddingX = 50;
  const paddingY = 25;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const points = mockRevenueTrends.map((d, i) => {
    const x = paddingX + (i / (mockRevenueTrends.length - 1)) * graphWidth;
    const y = svgHeight - paddingY - (d.amount / maxRevenue) * graphHeight;
    return { x, y, data: d };
  });

  const linePath = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="w-full text-slate-100 flex flex-col gap-2.5 select-none font-sans">
      
      {/* ========================================================
          顶部标题栏 (约 60px)
          左侧: 算力运营中心 · 算力收益分成 (标题固定)
          右侧: 2026年10月12日 (当前日期，自动更新)
         ======================================================== */}
      <div className="flex items-center justify-between px-1 shrink-0 h-9">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
          <h2 className="text-base font-black text-white tracking-wide flex items-center gap-2">
            算力运营中心 · 算力收益分成
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            面向算力中心资方
          </span>
        </div>

        {/* 右侧：日期与在线标识 */}
        <div className="text-xs font-mono font-bold text-slate-300 bg-slate-900/90 px-3.5 py-1 rounded-xl border border-slate-800 shadow-sm flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>2026年10月12日</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          <span className="text-[10px] text-emerald-400 font-sans font-bold">闭环运转中</span>
        </div>
      </div>

      {/* ========================================================
          第一行：五个核心指标卡片 (横向等宽排列，高度适配1920*1080大屏)
          每个卡片包含：指标名称、主数字、副标签、环比增长
         ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0 h-[135px]">
        
        {/* 卡片 1: 累计分成收入 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-blue-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-blue-400" />
              <span>累计分成收入</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">结算模块</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">
                ¥45,200
              </span>
            </div>
            <div className="text-xs text-blue-400 font-medium mt-1">
              自2026年1月起
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>环比</span>
            <span className="font-mono text-slate-300 font-medium">—</span>
          </div>
        </div>

        {/* 卡片 2: 本月分成收入 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-emerald-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>本月分成收入</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">结算模块</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400 leading-none">
                ¥12,580
              </span>
            </div>
            <div className="text-xs text-slate-300 font-medium mt-1">
              2026年9月
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>环比</span>
            <span className="font-mono text-emerald-400 font-bold flex items-center">
              ↑18%
            </span>
          </div>
        </div>

        {/* 卡片 3: 上月分成收入 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <span>上月分成收入</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">结算模块</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-200 leading-none">
                ¥10,660
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              2026年8月
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>环比</span>
            <span className="font-mono text-slate-300 font-medium">—</span>
          </div>
        </div>

        {/* 卡片 4: 结算状态 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-cyan-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>结算状态</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">结算模块</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-cyan-400 leading-none">
                已结算
              </span>
            </div>
            <div className="text-xs text-emerald-400 font-medium mt-1">
              9月已结算
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>到账</span>
            <span className="font-semibold text-emerald-400">全额完成</span>
          </div>
        </div>

        {/* 卡片 5: 累计卡时 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-purple-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>累计卡时</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">算力工坊</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">
                45,200
              </span>
              <span className="text-xs text-slate-400 font-normal ml-1">卡时</span>
            </div>
            <div className="text-xs text-purple-400 font-medium mt-1">
              自2026年1月起
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>环比</span>
            <span className="font-mono text-slate-300 font-medium">—</span>
          </div>
        </div>

      </div>

      {/* ========================================================
          第二行：左侧：分成收入趋势 (60%)；右侧：按业务线分成贡献 (40%) - 高度适配 405px
         ======================================================== */}
      <div className="grid grid-cols-12 gap-3 shrink-0 h-[405px]">
        
        {/* 左侧：分成收入趋势（折线图） */}
        <div className="col-span-12 lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-md relative">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="text-xs font-black text-white tracking-wide">分成收入趋势</h3>
                <span className="text-[11px] text-slate-400 ml-1">（月度变化趋势）</span>
              </div>
              {/* 图例 */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                <span className="text-slate-300 text-[11px]">● 分成收入 (蓝色折线)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              展示分成收入的月度变化趋势，持续稳步攀升
            </p>
          </div>

          {/* 折线图 SVG 区域 */}
          <div className="relative flex-1 flex items-center justify-center pt-2">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="revenueLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* 背景横线 */}
              {[0, 3000, 6000, 9000, 12000].map(val => {
                const y = svgHeight - paddingY - (val / maxRevenue) * graphHeight;
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 4}
                      fill="#64748B"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      ¥{val}
                    </text>
                  </g>
                );
              })}

              {/* 渐变阴影填充面积 */}
              <path d={areaPath} fill="url(#revenueLineGrad)" />

              {/* 折线 */}
              <path d={linePath} fill="none" stroke="#2563EB" strokeWidth="2.5" />

              {/* 数据点与标签 */}
              {points.map((pt, idx) => (
                <g
                  key={pt.data.month}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredMonthIndex(idx)}
                  onMouseLeave={() => setHoveredMonthIndex(null)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredMonthIndex === idx ? 6 : 4}
                    fill={hoveredMonthIndex === idx ? '#60A5FA' : '#2563EB'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y={svgHeight - paddingY + 16}
                    fill={hoveredMonthIndex === idx ? '#F8FAFC' : '#94A3B8'}
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontWeight={hoveredMonthIndex === idx ? 'bold' : 'normal'}
                  >
                    {pt.data.month.slice(5)}月
                  </text>
                  {/* 数值悬浮展示 */}
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    fill="#E2E8F0"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    ¥{pt.data.amount}
                  </text>
                </g>
              ))}
            </svg>

            {/* 悬停浮层 */}
            {hoveredMonthIndex !== null && (
              <div className="absolute top-4 right-8 bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-xl backdrop-blur-md pointer-events-none text-xs z-20 space-y-1">
                <div className="font-bold text-white flex justify-between gap-4">
                  <span>{mockRevenueTrends[hoveredMonthIndex].month} 分成收入</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    ¥{mockRevenueTrends[hoveredMonthIndex].amount.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  较前月环比：
                  <span className="text-emerald-400 font-mono font-bold">
                    {hoveredMonthIndex > 0
                      ? `+${(((mockRevenueTrends[hoveredMonthIndex].amount - mockRevenueTrends[hoveredMonthIndex - 1].amount) / mockRevenueTrends[hoveredMonthIndex - 1].amount) * 100).toFixed(1)}%`
                      : '基准'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>X轴：近12个月（2025年11月 — 2026年10月） ｜ Y轴：分成收入（元）</span>
            <span className="font-mono text-emerald-400 font-semibold">9月分成达 ¥10,660，10月预估超 ¥12,580</span>
          </div>
        </div>

        {/* 右侧：按业务线分成贡献（饼图/环形图） */}
        <div className="col-span-12 lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <h3 className="text-xs font-black text-white tracking-wide">按业务线分成贡献</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">饼图 / 占比结构</span>
          </div>

          {/* 饼图与列表区域 */}
          <div className="flex items-center justify-between gap-5 py-2 my-auto">
            {/* 环形饼图 */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let accumulatedPercent = 0;
                  return mockRevenueBusinessShares.map(item => {
                    const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += item.percentage;
                    return (
                      <circle
                        key={item.line}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth="15"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        pathLength="100"
                        className="transition-all hover:opacity-80"
                      />
                    );
                  });
                })()}
              </svg>
              {/* 中心文字 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-medium">合计分成</span>
                <span className="text-sm font-black font-mono text-emerald-400 tracking-tight mt-0.5">¥12,580</span>
                <span className="text-[10px] text-slate-400">100%</span>
              </div>
            </div>

            {/* 右侧业务线明细 */}
            <div className="flex-1 space-y-2">
              {mockRevenueBusinessShares.map(item => (
                <div key={item.line} className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-white">{item.line}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-emerald-400 font-bold">¥{item.amount.toLocaleString()}</span>
                    <span className="font-mono text-xs text-slate-300 w-9 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>赛事贡献最高 (38%)，实验场与实训构成稳健三角</span>
            <span className="font-mono text-white font-semibold">¥12,580 (100%)</span>
          </div>
        </div>

      </div>

      {/* ========================================================
          第三行：左侧：结算明细滚动列表 (60%)；右侧：对账闭环状态 (40%) - 高度适配 405px
         ======================================================== */}
      <div className="grid grid-cols-12 gap-3 shrink-0 h-[405px]">
        
        {/* 左侧：结算明细滚动列表 (每5秒自动向上滚动一行) */}
        <div
          className="col-span-12 lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col justify-between shadow-md"
          onMouseEnter={() => setIsTickerPlaying(false)}
          onMouseLeave={() => setIsTickerPlaying(true)}
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-black text-white tracking-wide">结算明细滚动列表</h3>
              <span className="text-[11px] text-slate-400 ml-1">（每5秒自动向上滚动一行）</span>
            </div>

            <button
              onClick={() => setIsTickerPlaying(prev => !prev)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {isTickerPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isTickerPlaying ? '暂停' : '轮播'}</span>
            </button>
          </div>

          {/* 表头 */}
          <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-slate-400 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800/60 my-1">
            <span className="col-span-2">结算周期</span>
            <span className="col-span-4">资源池名称</span>
            <span className="col-span-2 font-mono">消耗卡时</span>
            <span className="col-span-2 font-mono">分成收入</span>
            <span className="col-span-2 text-right">状态</span>
          </div>

          {/* 滚动展示行 (显示 3 行) */}
          <div className="space-y-1.5 my-1 overflow-hidden">
            {[0, 1, 2].map(idx => {
              const itemIndex = (tickerOffset + idx) % mockSettlementDetails.length;
              const row = mockSettlementDetails[itemIndex];
              if (!row) return null;
              const isHighlight = idx === 0;

              return (
                <div
                  key={`${row.id}-${idx}`}
                  className={`grid grid-cols-12 gap-2 text-xs px-3 py-2 rounded-xl border transition-all items-center ${
                    isHighlight
                      ? 'bg-slate-950 border-emerald-500/50 text-white ring-1 ring-emerald-500/20'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <span className="col-span-2 font-mono text-cyan-400 font-bold">{row.period}</span>
                  <span className="col-span-4 font-semibold text-white text-xs">{row.poolName}</span>
                  <span className="col-span-2 font-mono text-slate-300">{row.hours.toLocaleString()} 卡时</span>
                  <span className="col-span-2 font-mono text-emerald-400 font-bold">¥{row.revenue.toLocaleString()}</span>
                  <div className="col-span-2 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {row.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>资方资金拨付记录：全量核销完成，资金已如期划拨至各云节点专用联营账户</span>
            <span className="font-mono text-emerald-400 font-semibold">100% 结算履约</span>
          </div>
        </div>

        {/* 右侧：对账闭环状态（列表） */}
        <div className="col-span-12 lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h3 className="text-xs font-black text-white tracking-wide">对账闭环状态</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">对账与结算状态追踪</span>
          </div>

          {/* 列表形式 */}
          <div className="space-y-1.5 py-1">
            {mockReconClosedLoopStatuses.map(item => (
              <div key={item.period} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded-lg">
                    {item.period}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">对账：</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                      <span>✅</span>
                      <span>{item.reconStatus}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">结算：</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                      <span>✅</span>
                      <span>{item.settleStatus}</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {item.remark}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>闭环校验：对账确认率 100%，拨付逾期 0%</span>
            </span>
            <span className="text-cyan-400 font-mono font-bold">全流程可追溯</span>
          </div>
        </div>

      </div>

    </div>
  );
};
