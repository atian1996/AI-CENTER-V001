import React, { useState } from 'react';
import {
  Server,
  Cpu,
  Layers,
  Clock,
  DollarSign,
  Activity,
  Calendar,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import {
  mockPoolRanking,
  mockLoadCurveData,
  mockGpuModelShares
} from './mockComputeOpsData';

export const ComputeOpsOverviewTab: React.FC = () => {
  // 鼠标悬停曲线数据点
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // 堆叠曲线坐标计算 (SVG 绘制)
  const maxDayTotal = 2000;
  const svgWidth = 780;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 25;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  // 计算堆叠面积点
  const getCoordinates = () => {
    return mockLoadCurveData.map((d, i) => {
      const x = paddingX + (i / (mockLoadCurveData.length - 1)) * graphWidth;
      // 累计堆叠高度 (赛事 -> 实训 -> 实验场 -> 模型调用 -> Agent调用)
      const y0 = svgHeight - paddingY; // 基准底线
      const yCompetition = y0 - (d.competition / maxDayTotal) * graphHeight;
      const yTraining = yCompetition - (d.training / maxDayTotal) * graphHeight;
      const ySandbox = yTraining - (d.sandbox / maxDayTotal) * graphHeight;
      const yModelCall = ySandbox - (d.modelCall / maxDayTotal) * graphHeight;
      const yAgentCall = yModelCall - (d.agentCall / maxDayTotal) * graphHeight;
      return { x, y0, yCompetition, yTraining, ySandbox, yModelCall, yAgentCall, data: d };
    });
  };

  const points = getCoordinates();

  type LayerKey = 'yCompetition' | 'yTraining' | 'ySandbox' | 'yModelCall' | 'yAgentCall';
  type BaseKey = 'y0' | 'yCompetition' | 'yTraining' | 'ySandbox' | 'yModelCall';

  // 构建各个堆叠面积的 SVG path
  const buildAreaPath = (topKey: LayerKey, bottomKey: BaseKey) => {
    let path = `M ${points[0].x} ${points[0][bottomKey]}`;
    // 前进：沿顶部曲线
    for (let i = 0; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i][topKey]}`;
    }
    // 返回：沿底部曲线逆向
    for (let i = points.length - 1; i >= 0; i--) {
      path += ` L ${points[i].x} ${points[i][bottomKey]}`;
    }
    path += ' Z';
    return path;
  };

  const buildLinePath = (key: LayerKey) => {
    return points.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr[key]}` : `${acc} L ${curr.x} ${curr[key]}`;
    }, '');
  };

  return (
    <div className="w-full text-slate-100 flex flex-col gap-2.5 select-none font-sans">
      
      {/* ========================================================
          顶部标题栏 (约 60px)
          左侧: 算力运营中心 · 算力资源总览 (标题固定)
          右侧: 2026年10月12日 (当前日期，自动更新)
         ======================================================== */}
      <div className="flex items-center justify-between px-1 shrink-0 h-9">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-sm shadow-blue-500" />
          <h2 className="text-base font-black text-white tracking-wide flex items-center gap-2">
            算力运营中心 · 算力资源总览
          </h2>
        </div>
      </div>

      {/* ========================================================
          第一行：六个核心指标卡片 (横向等宽排列，高度适配1920*1080大屏)
          每个卡片包含：指标名称、主数字、副标签、环比增长
         ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 shrink-0 h-[135px]">
        
        {/* 卡片 1: 资源池总数 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-blue-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>资源池总数</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">全量在线</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono tracking-tight text-white leading-none">3</span>
              <span className="text-xs text-slate-400 font-normal ml-1">个</span>
            </div>
            <div className="text-xs text-emerald-400 font-medium mt-1">
              正常 2 / 维护 1
            </div>
          </div>
        </div>

        {/* 卡片 2: GPU总卡数 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-cyan-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>GPU总卡数</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">全网纳管</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono tracking-tight text-white leading-none">1,200</span>
              <span className="text-xs text-slate-400 font-normal ml-1">张卡</span>
            </div>
            <div className="text-xs text-cyan-400 font-medium mt-1">
              已分配 942 / 空闲 258
            </div>
          </div>
        </div>

        {/* 卡片 3: 已分配卡数 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-emerald-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>已分配卡数</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              ↑12%
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono tracking-tight text-emerald-400 leading-none">942</span>
              <span className="text-xs text-slate-400 font-normal ml-1">张卡</span>
            </div>
            <div className="text-xs text-slate-300 font-medium mt-1">
              分配率 78.5%
            </div>
          </div>
        </div>

        {/* 卡片 4: 今日调度量 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-amber-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>今日调度量</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              ↑15%
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono tracking-tight text-white leading-none">2,580</span>
              <span className="text-xs text-slate-400 font-normal ml-1">卡时</span>
            </div>
            <div className="text-xs text-amber-400 font-medium mt-1">
              日均 420卡时/天
            </div>
          </div>
        </div>

        {/* 卡片 5: 今日算力收入 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-purple-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-purple-400" />
              <span>今日算力收入</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              ↑18%
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono tracking-tight text-purple-400 leading-none">
                ¥12,580
              </span>
            </div>
            <div className="text-xs text-slate-300 font-medium mt-1">
              本月累计 ¥45,200
            </div>
          </div>
        </div>

        {/* 卡片 6: 资源池健康度 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-emerald-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>资源池健康度</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              集群在线
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono tracking-tight text-white leading-none">2/3正常</span>
            </div>
            <div className="text-xs text-amber-400 font-medium mt-1">
              1个维护中 (联通云)
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          第二行：左侧：资源池负载曲线 (7列)；右侧：各资源池负载排名 (5列) - 高度适配 405px
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 shrink-0 h-[405px]">
        
        {/* 左侧：资源池负载曲线（堆叠面积图） */}
        <div className="lg:col-span-7 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md relative">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="text-xs font-black text-white">资源池负载曲线</h3>
              </div>
            </div>
            {/* 图例 */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                <span className="text-[11px]">赛事</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[11px]">实训</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                <span className="text-[11px]">实验场</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                <span className="text-[11px]">模型调用</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-[11px]">Agent调用</span>
              </span>
            </div>
          </div>

          {/* 堆叠面积图 SVG 呈现 */}
          <div className="relative flex-1 flex items-center justify-center pt-2 min-h-[220px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full overflow-visible"
            >
              <defs>
                {/* 渐变填充 */}
                <linearGradient id="gradCompetition" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="gradTraining" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="gradSandbox" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="gradModelCall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="gradAgentCall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* 背景参考横线 */}
              {[0, 500, 1000, 1500, 2000].map(val => {
                const y = svgHeight - paddingY - (val / maxDayTotal) * graphHeight;
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
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* 堆叠层 1：赛事 (底部) */}
              <path d={buildAreaPath('yCompetition', 'y0')} fill="url(#gradCompetition)" />
              <path d={buildLinePath('yCompetition')} fill="none" stroke="#2563EB" strokeWidth="2" />

              {/* 堆叠层 2：实训 */}
              <path d={buildAreaPath('yTraining', 'yCompetition')} fill="url(#gradTraining)" />
              <path d={buildLinePath('yTraining')} fill="none" stroke="#10B981" strokeWidth="2" />

              {/* 堆叠层 3：实验场 */}
              <path d={buildAreaPath('ySandbox', 'yTraining')} fill="url(#gradSandbox)" />
              <path d={buildLinePath('ySandbox')} fill="none" stroke="#8B5CF6" strokeWidth="2" />

              {/* 堆叠层 4：模型调用 */}
              <path d={buildAreaPath('yModelCall', 'ySandbox')} fill="url(#gradModelCall)" />
              <path d={buildLinePath('yModelCall')} fill="none" stroke="#06B6D4" strokeWidth="2" />

              {/* 堆叠层 5：Agent调用 (顶部) */}
              <path d={buildAreaPath('yAgentCall', 'yModelCall')} fill="url(#gradAgentCall)" />
              <path d={buildLinePath('yAgentCall')} fill="none" stroke="#F59E0B" strokeWidth="2" />

              {/* X 轴日期标签与交互指示点 */}
              {points.map((pt, idx) => (
                <g
                  key={pt.data.date}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredDayIndex(idx)}
                  onMouseLeave={() => setHoveredDayIndex(null)}
                >
                  <line
                    x1={pt.x}
                    y1={svgHeight - paddingY}
                    x2={pt.x}
                    y2={pt.yAgentCall}
                    stroke={hoveredDayIndex === idx ? '#94A3B8' : 'transparent'}
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={pt.x}
                    y={svgHeight - paddingY + 16}
                    fill={hoveredDayIndex === idx ? '#F8FAFC' : '#94A3B8'}
                    fontSize="11"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontWeight={hoveredDayIndex === idx ? 'bold' : 'normal'}
                  >
                    {pt.data.date}
                  </text>
                  {/* 顶部总计数值点 */}
                  <circle
                    cx={pt.x}
                    cy={pt.yAgentCall}
                    r={hoveredDayIndex === idx ? 5 : 3.5}
                    fill="#FFFFFF"
                    stroke="#F59E0B"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y={pt.yAgentCall - 8}
                    fill="#E2E8F0"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {pt.data.total}
                  </text>
                </g>
              ))}
            </svg>

            {/* 鼠标悬停 Tooltip 浮层 */}
            {hoveredDayIndex !== null && (
              <div
                className="absolute top-4 right-6 bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-xl backdrop-blur-md pointer-events-none text-xs z-20 space-y-1.5"
              >
                <div className="font-bold text-white border-b border-slate-800 pb-1 flex justify-between gap-4">
                  <span>2026年{mockLoadCurveData[hoveredDayIndex].date} 调度明细</span>
                  <span className="font-mono text-cyan-400">总计 {mockLoadCurveData[hoveredDayIndex].total} 卡时</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                  <span className="text-blue-400">赛事：{mockLoadCurveData[hoveredDayIndex].competition} 卡时</span>
                  <span className="text-emerald-400">实训：{mockLoadCurveData[hoveredDayIndex].training} 卡时</span>
                  <span className="text-purple-400">实验场：{mockLoadCurveData[hoveredDayIndex].sandbox} 卡时</span>
                  <span className="text-cyan-400">模型调用：{mockLoadCurveData[hoveredDayIndex].modelCall} 卡时</span>
                  <span className="text-amber-400">Agent调用：{mockLoadCurveData[hoveredDayIndex].agentCall} 卡时</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>X轴：近7天（2026-10-06 — 2026-10-12）</span>
          </div>
        </div>

        {/* 右侧：各资源池负载排名（横向柱状图） */}
        <div className="lg:col-span-5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <h3 className="text-xs font-black text-white">各资源池负载排名</h3>
            </div>
          </div>

          <div className="space-y-3 my-auto py-2">
            {mockPoolRanking.map((pool, idx) => (
              <div key={pool.name} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black font-mono ${
                      idx === 0 ? 'bg-amber-500 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : 'bg-slate-700 text-slate-200'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-bold text-white text-xs">{pool.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                      pool.status === '正常' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {pool.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-slate-400 font-mono">
                      已分配/总卡数：<strong className="text-white">{pool.assignedCards}/{pool.totalCards}</strong>
                    </span>
                    <span className="text-sm font-black font-mono text-cyan-400">
                      {pool.utilization}%
                    </span>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 ? 'bg-gradient-to-r from-blue-600 to-cyan-400' : idx === 1 ? 'bg-gradient-to-r from-blue-700 to-blue-500' : 'bg-gradient-to-r from-slate-600 to-slate-500'
                    }`}
                    style={{ width: `${pool.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>


        </div>

      </div>

      {/* ========================================================
          第三行：左侧：GPU型号使用分布 (7列)；右侧：资源池健康状态 (5列) - 高度适配 405px
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 shrink-0 h-[405px]">
        
        {/* 左侧：GPU型号使用分布（环形图） */}
        <div className="lg:col-span-7 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <h3 className="text-xs font-black text-white">GPU型号使用分布</h3>
            </div>
          </div>

          <div className="flex items-center justify-between gap-5 py-2">
            {/* 环形图 SVG */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* 环形切片计算 */}
                {(() => {
                  let accumulatedPercent = 0;
                  return mockGpuModelShares.map(item => {
                    const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += item.percentage;
                    return (
                      <circle
                        key={item.model}
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
                <span className="text-[9px] text-slate-400 font-medium">总调度量</span>
                <span className="text-xs font-black font-mono text-white tracking-tight mt-0.5">12,580</span>
                <span className="text-[9px] text-slate-400">卡时</span>
              </div>
            </div>

            {/* 右侧列表明细 */}
            <div className="flex-1 grid grid-cols-2 gap-2.5">
              {mockGpuModelShares.map(item => (
                <div key={item.model} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div>
                      <div className="text-xs font-bold text-white">{item.model}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.hours} 卡时</div>
                    </div>
                  </div>
                  <div className="text-sm font-black font-mono text-slate-200">
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* 右侧：资源池健康状态（列表） */}
        <div className="lg:col-span-5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-black text-white">资源池健康状态</h3>
            </div>
          </div>

          {/* 列表形式 */}
          <div className="space-y-2 py-1">
            {mockPoolRanking.map(pool => (
              <div key={pool.name} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">
                    {pool.status === '正常' ? '🟢' : '🟡'}
                  </span>
                  <div>
                    <div className="font-bold text-white text-xs">{pool.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      同步时间：{pool.lastSyncTime}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                    pool.status === '正常' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {pool.status}
                  </span>
                  {pool.remark !== '—' && (
                    <div className="text-[10px] text-amber-400 mt-0.5">
                      {pool.remark}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>


        </div>

      </div>

    </div>
  );
};
