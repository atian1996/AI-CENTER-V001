import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Calendar,
  Users,
  Award,
  Zap,
  Building2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  FileCheck,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  mockV2TimelineActivities,
  EcoV2TimelineActivity
} from './mockEcoV2Data';

export const EcoV2ActivitiesTab: React.FC = () => {
  // 活动时间轴轮播高亮索引 (0 ~ 10, 共 11 个月)
  const [activeActIndex, setActiveActIndex] = useState(0);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(true);

  // 横向滚动容器与每个卡片的 DOM 引用，用于自动滚动
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 选中的活动详情（可在时间轴内查看）
  const [selectedActivity, setSelectedActivity] = useState<EcoV2TimelineActivity | null>(null);

  // 选中的漏斗层级高亮 (hover 状态)
  const [hoveredFunnelStage, setHoveredFunnelStage] = useState<string | null>(null);

  // 每 5 秒轮播切换一个高亮活动
  useEffect(() => {
    if (!isTimelinePlaying) return;
    const timer = setInterval(() => {
      setActiveActIndex(prev => (prev + 1) % mockV2TimelineActivities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isTimelinePlaying]);

  // 当 activeActIndex 变化时，自动横向平滑滚动容器，确保当前激活卡片居中可见
  useEffect(() => {
    const activeCard = cardRefs.current[activeActIndex];
    const container = timelineContainerRef.current;
    if (activeCard && container) {
      const cardOffsetLeft = activeCard.offsetLeft;
      const cardWidth = activeCard.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScrollLeft = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }
  }, [activeActIndex]);

  // 活动类型分布环形图数据
  const activityTypeData = [
    { name: '沙龙交流', value: 4, pct: 36, color: '#3B82F6', desc: '深度技术交流与工作流切磋' },
    { name: '创新赛事', value: 3, pct: 27, color: '#F59E0B', desc: '造峰值引才引项目' },
    { name: '工程师实训', value: 2, pct: 18, color: '#10B981', desc: '稳基线培育实战骨干' },
    { name: '技术路演', value: 2, pct: 18, color: '#8B5CF6', desc: '揭榜项目长周期转化评审' },
  ];

  // 赛事成果转化与落地跟踪 - 漏斗图四级转化数据
  const funnelStages = [
    {
      id: 'stage-1',
      stepNum: '01',
      name: '报名参赛团队',
      count: 168,
      unit: '支',
      subtitle: '覆盖高校创客、科技初创与企事业创新主体',
      ratioText: '参赛总基准 100%',
      stepConversion: '168/168',
      stepRate: '100%',
      points: '15,5 305,5 277,52 43,52',
      gradientId: 'funnel-grad-1',
      fromColor: '#38BDF8', // 浅天蓝 Sky 400
      toColor: '#0EA5E9',   // 天蓝 Sky 500
      tagColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
    },
    {
      id: 'stage-2',
      stepNum: '02',
      name: '提交有效成果',
      count: 89,
      unit: '项',
      subtitle: '算法方案完备、实测数据集完整并通过形式审查',
      ratioText: '89/168，转化率 53%',
      stepConversion: '89/168',
      stepRate: '53.0%',
      points: '47,60 273,60 243,107 77,107',
      gradientId: 'funnel-grad-2',
      fromColor: '#0EA5E9', // Sky 500
      toColor: '#2563EB',   // 亮蓝 Blue 600
      tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    {
      id: 'stage-3',
      stepNum: '03',
      name: '获奖/优质项目',
      count: 32,
      unit: '项',
      subtitle: '经行业专家打分、现场路演答辩决出的优胜方案',
      ratioText: '32/89，转化率 36%',
      stepConversion: '32/89',
      stepRate: '36.0%',
      points: '81,115 239,115 211,162 109,162',
      gradientId: 'funnel-grad-3',
      fromColor: '#2563EB', // 亮蓝 Blue 600
      toColor: '#1D4ED8',   // 皇家蓝 Blue 700
      tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'stage-4',
      stepNum: '04',
      name: '实际落地孵化',
      count: 8,
      unit: '家',
      subtitle: '签署入驻园区协议，完成工商注册并进入实体运营',
      ratioText: '8/32，转化率 25%',
      stepConversion: '8/32',
      stepRate: '25.0%',
      points: '113,170 207,170 187,217 133,217',
      gradientId: 'funnel-grad-4',
      fromColor: '#1D4ED8', // 皇家蓝 Blue 700
      toColor: '#1E3A8A',   // 深海蓝 Blue 900
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    }
  ];

  const currentActiveAct = mockV2TimelineActivities[activeActIndex];

  return (
    <div className="w-full text-slate-100 space-y-4 select-none font-sans">
      
      {/* 1. 顶部标题栏（已彻底删除接待模式相关按钮） */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-2 pb-1 border-b border-slate-800/80">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            年度活动汇总
          </h1>
        </div>
      </div>

      {/* 2. 年度汇总指标卡（五个卡片横向等宽排列，高度约140px） */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* 指标卡 1：产业活动举办场次 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between h-[135px] hover:border-purple-500/40 transition">
          <div>
            <span className="text-xs text-slate-400 font-medium">产业活动举办场次</span>
            <div className="text-3xl font-black text-white font-mono mt-1">11 <span className="text-xs font-normal text-slate-400">场</span></div>
          </div>
          <div className="text-[11px] text-purple-300 font-medium truncate">
            赛事 3 / 实训 2 / 沙龙 4 / 路演 2
          </div>
        </div>

        {/* 指标卡 2：活动参与规模 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between h-[135px] hover:border-blue-500/40 transition">
          <div>
            <span className="text-xs text-slate-400 font-medium">活动参与规模</span>
            <div className="text-3xl font-black text-blue-400 font-mono mt-1">1,280 <span className="text-xs font-normal text-slate-400">人次</span></div>
          </div>
          <div className="text-[11px] text-blue-300 font-medium truncate">
            赛事 620 / 实训 320 / 沙龙 220 / 路演 120
          </div>
        </div>

        {/* 指标卡 3：产业成果产出 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between h-[135px] hover:border-emerald-500/40 transition">
          <div>
            <span className="text-xs text-slate-400 font-medium">产业成果产出</span>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-1">156 <span className="text-xs font-normal text-slate-400">项</span></div>
          </div>
          <div className="text-[11px] text-emerald-300 font-medium truncate">
            赛事 89 / 实训 45 / 其他 22
          </div>
        </div>

        {/* 指标卡 4：算力资源投入 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between h-[135px] hover:border-amber-500/40 transition">
          <div>
            <span className="text-xs text-slate-400 font-medium">算力资源投入</span>
            <div className="text-3xl font-black text-amber-400 font-mono mt-1">12,580 <span className="text-xs font-normal text-slate-400">卡时</span></div>
          </div>
          <div className="text-[11px] text-amber-300 font-medium truncate">
            赛事 3,200 / 实训 4,500 / 其他 4,880
          </div>
        </div>

        {/* 指标卡 5：活动覆盖企业 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between h-[135px] hover:border-indigo-500/40 transition">
          <div>
            <span className="text-xs text-slate-400 font-medium">活动覆盖企业</span>
            <div className="text-3xl font-black text-indigo-400 font-mono mt-1">89 <span className="text-xs font-normal text-slate-400">家</span></div>
          </div>
          <div className="text-[11px] text-indigo-300 font-medium truncate">
            参赛企业 56 / 实训企业 33
          </div>
        </div>

      </div>

      {/* 3. 活动时间轴（横向时间轴 + 活动卡片） */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3.5">
        {/* 时间轴头部控制条 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-extrabold text-white">年度全周期活动推进</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline mr-1">
              {activeActIndex + 1} / {mockV2TimelineActivities.length}
            </span>
            <button
              onClick={() => {
                setActiveActIndex(prev => (prev - 1 + mockV2TimelineActivities.length) % mockV2TimelineActivities.length);
                setIsTimelinePlaying(false);
              }}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title="上一个月活动"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setActiveActIndex(prev => (prev + 1) % mockV2TimelineActivities.length);
                setIsTimelinePlaying(false);
              }}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title="下一个月活动"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsTimelinePlaying(!isTimelinePlaying)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              {isTimelinePlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isTimelinePlaying ? '自动轮播中' : '已暂停'}</span>
            </button>
          </div>
        </div>

        {/* 横向月度节点导轨 - 自动横向滚动以确保当前轮播卡片始终完全可见 */}
        <div 
          ref={timelineContainerRef}
          className="relative pt-2 pb-3 overflow-x-auto scroll-smooth"
        >
          {/* 连接线 */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-800 -z-0"></div>

          {/* 11 个活动卡片横向卡片槽 (1月至11月) */}
          <div className="flex items-start gap-4 min-w-[3100px] z-10 relative px-2">
            {mockV2TimelineActivities.map((act, index) => {
              const isHighlight = index === activeActIndex;

              return (
                <div
                  key={act.id}
                  ref={el => { cardRefs.current[index] = el; }}
                  onClick={() => {
                    setActiveActIndex(index);
                    setIsTimelinePlaying(false);
                    setSelectedActivity(act);
                  }}
                  className={`w-[260px] p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between shrink-0 h-[250px] ${
                    isHighlight
                      ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-600/20 scale-105 z-20 ring-2 ring-indigo-400/50'
                      : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 opacity-75'
                  }`}
                >
                  {/* 月份指示与类型 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black font-mono ${
                        isHighlight
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {act.month}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {act.type}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-white line-clamp-1 mt-1">
                      {act.name}
                    </h3>
                    <div className="text-[11px] text-indigo-300 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span className="truncate">{act.serviceItem}</span>
                    </div>
                  </div>

                  {/* 核心产出与算力 */}
                  <div className="space-y-1.5 py-2 border-y border-slate-800/60 my-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">参与规模：</span>
                      <span className="text-white font-mono font-bold">{act.participants} 人次</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">产出成果：</span>
                      <span className="text-emerald-400 font-mono font-bold">{act.outputCount} 项</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">算力消耗：</span>
                      <span className="text-amber-300 font-mono font-bold">{act.computeHours} 卡时</span>
                    </div>
                  </div>

                  {/* 辖区关联 */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      {act.district}
                    </span>
                    <span className="text-[11px] text-blue-400 font-medium">点击查看</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. 媒体报道 + 活动类型分布 (左右分栏，已彻底移除接待模式相关内容) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* 左侧：赛事成果转化与落地跟踪 (垂直漏斗图，占 7 列 / 宽约 1150px) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
          {/* 标题栏 */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span>赛事成果转化与落地跟踪</span>
              </h3>
            </div>
          </div>

          {/* 漏斗图主体区：左侧垂直漏斗SVG + 右侧层级明细与转化率指标 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-1">
            {/* 垂直漏斗图 (SVG 无边框设计，由浅蓝到深蓝渐变) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full max-w-[320px] aspect-[320/224]">
                <svg
                  viewBox="0 0 320 224"
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="funnel-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>
                    <linearGradient id="funnel-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                    <linearGradient id="funnel-grad-3" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                    <linearGradient id="funnel-grad-4" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1D4ED8" />
                      <stop offset="100%" stopColor="#1E3A8A" />
                    </linearGradient>

                    <filter id="funnel-glow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0284C7" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {funnelStages.map((stage) => {
                    const isHovered = hoveredFunnelStage === stage.id;
                    return (
                      <g
                        key={stage.id}
                        onMouseEnter={() => setHoveredFunnelStage(stage.id)}
                        onMouseLeave={() => setHoveredFunnelStage(null)}
                        className="cursor-pointer transition-all duration-300"
                      >
                        {/* 梯形色块 */}
                        <polygon
                          points={stage.points}
                          fill={`url(#${stage.gradientId})`}
                          filter="url(#funnel-glow)"
                          stroke={isHovered ? '#67E8F9' : 'rgba(255,255,255,0.2)'}
                          strokeWidth={isHovered ? 2 : 0.8}
                          className="transition-all duration-300"
                          style={{
                            opacity: hoveredFunnelStage && !isHovered ? 0.6 : 1,
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                            transformOrigin: '160px 112px'
                          }}
                        />

                        {/* 梯形内部文字与数值 */}
                        {stage.id === 'stage-1' && (
                          <>
                            <text x="160" y="27" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">
                              报名参赛团队
                            </text>
                            <text x="160" y="42" textAnchor="middle" fill="#F0F9FF" fontSize="11" fontWeight="700" fontFamily="monospace">
                              168 支
                            </text>
                          </>
                        )}
                        {stage.id === 'stage-2' && (
                          <>
                            <text x="160" y="81" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="800">
                              提交有效成果
                            </text>
                            <text x="160" y="96" textAnchor="middle" fill="#DBEAFE" fontSize="11" fontWeight="700" fontFamily="monospace">
                              89 项
                            </text>
                          </>
                        )}
                        {stage.id === 'stage-3' && (
                          <>
                            <text x="160" y="136" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
                              获奖/优质项目
                            </text>
                            <text x="160" y="150" textAnchor="middle" fill="#BFDBFE" fontSize="10.5" fontWeight="700" fontFamily="monospace">
                              32 项
                            </text>
                          </>
                        )}
                        {stage.id === 'stage-4' && (
                          <>
                            <text x="160" y="191" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="800">
                              实际落地
                            </text>
                            <text x="160" y="205" textAnchor="middle" fill="#93C5FD" fontSize="10" fontWeight="700" fontFamily="monospace">
                              8 家
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>浅蓝 (基准池)</span>
                <span className="text-slate-600">→</span>
                <span className="w-2 h-2 rounded-full bg-blue-900"></span>
                <span>深蓝 (落地孵化)</span>
              </div>
            </div>

            {/* 右侧：逐层数据与转化率指标 */}
            <div className="md:col-span-7 space-y-2">
              {funnelStages.map((stage) => {
                const isHovered = hoveredFunnelStage === stage.id;
                return (
                  <div
                    key={stage.id}
                    onMouseEnter={() => setHoveredFunnelStage(stage.id)}
                    onMouseLeave={() => setHoveredFunnelStage(null)}
                    className={`p-2.5 rounded-xl transition-all duration-200 border ${
                      isHovered
                        ? 'bg-slate-800/90 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/70 hover:bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${stage.tagColor}`}>
                          {stage.stepNum}
                        </span>
                        <span className="text-xs font-bold text-white tracking-wide">
                          {stage.name}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-white font-mono">
                          {stage.count}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {stage.unit}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 truncate max-w-[210px]">
                        {stage.subtitle}
                      </span>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 text-[10.5px]">
                          {stage.ratioText}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 底部摘要小字 */}
          <div className="flex items-center justify-end text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="text-slate-500 shrink-0">数据出处：赛事成果转化台账</span>
          </div>
        </div>

        {/* 右侧：活动类型分布与成效解析 (占 5 列 / 宽约 700px) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span>活动类型分布与实施成效</span>
            </h3>
          </div>

          {/* 环形图 */}
          <div className="flex items-center justify-around py-2">
            <div className="relative w-[150px] h-[150px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityTypeData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={68}
                    stroke="#0F172A"
                    strokeWidth={3}
                  >
                    {activityTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] text-slate-400">总场次</span>
                <span className="text-xl font-black text-white font-mono">11 场</span>
              </div>
            </div>

            <div className="space-y-2 text-xs flex-1 pl-3">
              {activityTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white">{item.value} 场</span>
                    <span className="text-slate-500 text-[10px]">({item.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 活动成效机制简卡（替代原本的接待模式按钮） */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300 font-bold flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>全周期活动推进成效闭环</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-bold font-mono">100% 履约</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-white font-bold">赛事引才引企</div>
                <div className="text-slate-500 mt-0.5">3家获奖团队已落地注册</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-white font-bold">实训输出骨干</div>
                <div className="text-slate-500 mt-0.5">结业118人 / 认证96人</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-right pt-2 border-t border-slate-800/80">
            数据出处：年度活动执行与成果台账
          </div>
        </div>

      </div>

    </div>
  );
};
