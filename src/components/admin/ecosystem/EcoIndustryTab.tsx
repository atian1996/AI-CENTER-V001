import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MapPin,
  Radio,
  Sparkles,
  ArrowUpRight,
  Compass,
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import {
  mockEcosystemCases,
  mockIndustryCaseStatusBreakdown,
  EcoCaseItem
} from './mockEcoData';
import {
  mockNanjingGeoDistricts,
  NANJING_SVG_VIEWBOX,
  YANGTZE_RIVER_SVG_PATH,
  NanjingDistrictGeoItem
} from './nanjingGeoData';

interface EcoIndustryTabProps {
  onSelectCase?: (caseItem: EcoCaseItem) => void;
}

export const EcoIndustryTab: React.FC<EcoIndustryTabProps> = ({
  onSelectCase
}) => {
  // 地图自动轮播状态 (共 11 个行政区划)
  const [activeDistrictIndex, setActiveDistrictIndex] = useState<number>(0);
  const [isMapAutoPlaying, setIsMapAutoPlaying] = useState<boolean>(true);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);

  // 典型案例轮播状态 (每组3个，共2组)
  const [casePageIndex, setCasePageIndex] = useState<number>(0);
  const [isCaseAutoPlaying, setIsCaseAutoPlaying] = useState<boolean>(true);

  // 地图 4.5 秒轮播巡检切换
  useEffect(() => {
    if (!isMapAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveDistrictIndex(prev => (prev + 1) % mockNanjingGeoDistricts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isMapAutoPlaying]);

  // 典型案例 6 秒自动翻页轮播
  useEffect(() => {
    if (!isCaseAutoPlaying) return;
    const timer = setInterval(() => {
      setCasePageIndex(prev => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, [isCaseAutoPlaying]);

  const currentDistrict: NanjingDistrictGeoItem =
    mockNanjingGeoDistricts[activeDistrictIndex] || mockNanjingGeoDistricts[0];

  const currentCases = mockEcosystemCases.slice(casePageIndex * 3, casePageIndex * 3 + 3);

  return (
    <div className="w-full text-slate-100 flex flex-col gap-2.5 select-none h-full">
      
      {/* 1. 顶部标题栏 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-2 pb-1 border-b border-slate-800/80">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            产业生态成果
          </h1>
        </div>
      </div>

      {/* 2. 第一行：五个核心指标卡片 (横向等宽排列，高度适配1920*1080) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0 h-[135px]">
        
        {/* 卡片 1：产业成果总数 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-blue-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">产业成果总数</span>
            <span className="p-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-white tracking-tight leading-none">128</span>
              <span className="text-xs text-slate-400 font-normal ml-1">项</span>
            </div>
            <div className="text-xs text-blue-400 font-medium mt-1">
              硬核产业落地转化
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
            赛事 <span className="font-mono text-slate-200">67</span> / 实训 <span className="font-mono text-slate-200">38</span> / 实验场 <span className="font-mono text-slate-200">23</span>
          </div>
        </div>

        {/* 卡片 2：已落地转化 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-emerald-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">已落地转化</span>
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-emerald-400 tracking-tight leading-none">56</span>
              <span className="text-xs text-slate-400 font-normal ml-1">项</span>
            </div>
            <div className="text-xs text-emerald-300 font-medium mt-1">
              成果转化率 43.8%
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
            智造 <span className="font-mono text-slate-200">18</span> / 电子 <span className="font-mono text-slate-200">15</span> / 医药 <span className="font-mono text-slate-200">10</span>
          </div>
        </div>

        {/* 卡片 3：试点验证中 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-amber-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">试点验证中</span>
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-amber-400 tracking-tight leading-none">42</span>
              <span className="text-xs text-slate-400 font-normal ml-1">项</span>
            </div>
            <div className="text-xs text-amber-300 font-medium mt-1">
              场景验证提速推进
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
            智造 <span className="font-mono text-slate-200">14</span> / 电子 <span className="font-mono text-slate-200">12</span> / 医药 <span className="font-mono text-slate-200">8</span>
          </div>
        </div>

        {/* 卡片 4：已签约合作 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-cyan-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">已签约合作</span>
            <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Award className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-cyan-400 tracking-tight leading-none">30</span>
              <span className="text-xs text-slate-400 font-normal ml-1">项</span>
            </div>
            <div className="text-xs text-cyan-300 font-medium mt-1">
              校企地多方联营
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
            智造 <span className="font-mono text-slate-200">10</span> / 电子 <span className="font-mono text-slate-200">8</span> / 医药 <span className="font-mono text-slate-200">6</span>
          </div>
        </div>

        {/* 卡片 5：覆盖产业链条 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-purple-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">覆盖产业链条</span>
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-purple-400 tracking-tight leading-none">6</span>
              <span className="text-xs text-slate-400 font-normal ml-1">大链</span>
            </div>
            <div className="text-xs text-purple-300 font-medium mt-1 truncate">
              智造 / 电子 / 医药 / 低空
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate" title="智能制造、电子信息、生物医药、新能源等">
            智能制造、电子信息、生物医药、新能源等
          </div>
        </div>

      </div>

      {/* 3. 主体工作区：高能效竖向双列大屏布局 (高度扩展至 805px，严密适配 1920*1080 满屏呈现) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[805px] shrink-0">
        
        {/* 左侧：专属竖向高矩形「南京产业生态地图」舱体 (占 5 列，纵向贯穿全部 635px 高度，极大化南京竖长地理轮廓展示) */}
        <div className="lg:col-span-5 p-3.5 bg-slate-900/95 border border-slate-800 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-xl">
          
          {/* 地图 Header & 巡检控制 */}
          <div className="flex items-center justify-between z-10 shrink-0 pb-1.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
              <h3 className="text-xs font-black text-white tracking-wide">
                南京产业生态地图
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>320100 官方矢量</span>
              </span>
            </div>

            {/* 自动巡检控制器 */}
            <div className="flex items-center gap-1.5 bg-slate-950/90 px-2.5 py-1 rounded-xl border border-slate-800 text-[10px]">
              <span className="flex items-center gap-1 text-cyan-300 font-bold">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>自动巡检</span>
              </span>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setIsMapAutoPlaying(!isMapAutoPlaying)}
                className="text-slate-400 hover:text-white transition cursor-pointer p-0.5"
                title={isMapAutoPlaying ? '暂停巡检' : '继续巡检'}
              >
                {isMapAutoPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* 核心竖向矩形地图渲染容器 (利用南京南北狭长 0.54 宽高比特质，大幅度垂直放大) */}
          <div className="relative flex-1 w-full my-2 rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-hidden flex items-center justify-center p-1">
            
            {/* 科技网格与深空渐变光效 */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* 指北针与比例尺 HUD */}
            <div className="absolute top-2.5 left-2.5 z-20 flex flex-col items-center bg-slate-900/90 px-2 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 pointer-events-none shadow-md">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-[9px] font-bold text-slate-200 mt-0.5">N</span>
              <div className="w-4 h-0.5 bg-slate-700 my-1" />
              <span className="text-[8px] font-mono text-slate-500">10km</span>
            </div>

            {/* 长江水文标识 */}
            <div className="absolute top-[38%] left-3 z-15 pointer-events-none text-[10px] font-bold text-cyan-400/70 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20 backdrop-blur-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              长江水系
            </div>

            {/* 竖向高比例 420x720 矢量 SVG 画布 */}
            <svg
              viewBox={NANJING_SVG_VIEWBOX}
              className="w-full h-full max-h-[660px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
            >
              <defs>
                {/* 活跃区域渐变 */}
                <linearGradient id="vertDistrictActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#0e7490" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
                </linearGradient>

                {/* 悬停区域渐变 */}
                <linearGradient id="vertDistrictHoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" />
                </linearGradient>

                {/* 默认普通区域渐变 */}
                <linearGradient id="vertDistrictDefaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.92" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.96" />
                </linearGradient>

                {/* 霓虹发光滤镜 */}
                <filter id="vertDistrictGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. 长江主航道水文曲线 */}
              <g className="pointer-events-none">
                <path
                  d={YANGTZE_RIVER_SVG_PATH}
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="6"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                />
                <path
                  d={YANGTZE_RIVER_SVG_PATH}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeOpacity="0.75"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              </g>

              {/* 2. 南京 11 个区划真实矢量多边形边界 */}
              <g>
                {mockNanjingGeoDistricts.map((d, idx) => {
                  const isActive = idx === activeDistrictIndex;
                  const isHovered = d.id === hoveredDistrictId;

                  return (
                    <path
                      key={d.id}
                      d={d.svgPath}
                      fill={
                        isActive
                          ? 'url(#vertDistrictActiveGrad)'
                          : isHovered
                          ? 'url(#vertDistrictHoverGrad)'
                          : 'url(#vertDistrictDefaultGrad)'
                      }
                      stroke={
                        isActive
                          ? '#22d3ee'
                          : isHovered
                          ? '#38bdf8'
                          : '#334155'
                      }
                      strokeWidth={isActive ? 2.5 : isHovered ? 2.0 : 1.1}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      filter={isActive ? 'url(#vertDistrictGlow)' : undefined}
                      className="transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setActiveDistrictIndex(idx);
                        setIsMapAutoPlaying(false);
                      }}
                      onMouseEnter={() => setHoveredDistrictId(d.id)}
                      onMouseLeave={() => setHoveredDistrictId(null)}
                    >
                      <title>{d.name}: {d.totalCases}项产业成果 ({d.industry})</title>
                    </path>
                  );
                })}
              </g>

              {/* 3. 各区质心交互锚点与名称徽标 */}
              <g>
                {mockNanjingGeoDistricts.map((d, idx) => {
                  const isActive = idx === activeDistrictIndex;
                  const isHovered = d.id === hoveredDistrictId;

                  return (
                    <g
                      key={`pin-${d.id}`}
                      className="cursor-pointer transition-transform duration-200"
                      onClick={() => {
                        setActiveDistrictIndex(idx);
                        setIsMapAutoPlaying(false);
                      }}
                      onMouseEnter={() => setHoveredDistrictId(d.id)}
                      onMouseLeave={() => setHoveredDistrictId(null)}
                    >
                      {/* 活跃状态涟漪光环 */}
                      {isActive && (
                        <circle
                          cx={d.svgCenter.x}
                          cy={d.svgCenter.y}
                          r="18"
                          className="animate-ping"
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth="2.2"
                          opacity="0.5"
                        />
                      )}

                      {/* 中心锚点点位 */}
                      <circle
                        cx={d.svgCenter.x}
                        cy={d.svgCenter.y}
                        r={isActive ? 5.5 : isHovered ? 4.5 : 3.2}
                        fill={isActive ? '#06b6d4' : isHovered ? '#38bdf8' : '#64748b'}
                        stroke="#0f172a"
                        strokeWidth={1.8}
                      />

                      {/* 区划地名 + 案例数量胶囊徽标 */}
                      <g transform={`translate(${d.svgCenter.x}, ${d.svgCenter.y - (isActive ? 18 : 15)})`}>
                        <rect
                          x={-28}
                          y={-10}
                          width={56}
                          height={20}
                          rx={10}
                          fill={isActive ? '#083344' : isHovered ? '#1e293b' : '#090d16'}
                          stroke={isActive ? '#22d3ee' : isHovered ? '#38bdf8' : '#334155'}
                          strokeWidth={isActive ? 1.8 : 1}
                          opacity={isActive ? 0.96 : 0.88}
                        />
                        <text
                          x={0}
                          y={3.5}
                          textAnchor="middle"
                          fontSize={isActive ? 10 : 9}
                          fontWeight="bold"
                          fill={isActive ? '#ffffff' : isHovered ? '#f1f5f9' : '#cbd5e1'}
                          className="select-none pointer-events-none"
                        >
                          {d.name.replace('区', '')} {d.totalCases}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* 浮动遥测看板 HUD：当前巡检区域精准解析 */}
            <div className="absolute top-2.5 right-2.5 w-60 bg-slate-900/95 border border-cyan-500/40 rounded-xl p-2.5 shadow-2xl backdrop-blur-md z-25 text-xs space-y-1.5 pointer-events-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-black text-white text-xs">{currentDistrict.name}</span>
                  <span className="text-[10px] text-cyan-300 bg-cyan-500/20 px-1.5 py-0.2 rounded border border-cyan-500/30 font-bold">
                    {currentDistrict.totalCases} 项
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeDistrictIndex + 1}/{mockNanjingGeoDistricts.length}
                </span>
              </div>

              <div className="text-[11px] text-slate-300 font-medium flex items-center justify-between">
                <span className="text-slate-400">主导产业：</span>
                <span className="text-cyan-200 font-bold truncate max-w-[130px]" title={currentDistrict.industry}>
                  {currentDistrict.industry}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 truncate">
                <span className="text-slate-500">产业定位：</span>
                <span className="text-slate-300">{currentDistrict.badge}</span>
              </div>

              {/* 三大状态拆解 */}
              <div className="grid grid-cols-3 gap-1 py-1 text-center font-mono">
                <div className="bg-slate-950 p-1 rounded border border-slate-800/80">
                  <div className="text-[9px] text-slate-400">已落地</div>
                  <div className="text-xs font-bold text-emerald-400">{currentDistrict.deployedCount}</div>
                </div>
                <div className="bg-slate-950 p-1 rounded border border-slate-800/80">
                  <div className="text-[9px] text-slate-400">验证中</div>
                  <div className="text-xs font-bold text-amber-400">{currentDistrict.pilotCount}</div>
                </div>
                <div className="bg-slate-950 p-1 rounded border border-slate-800/80">
                  <div className="text-[9px] text-slate-400">已签约</div>
                  <div className="text-xs font-bold text-cyan-400">{currentDistrict.signedCount}</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 truncate">
                <span>代表企业：</span>
                <span className="text-slate-200" title={currentDistrict.representativeEnterprise}>
                  {currentDistrict.representativeEnterprise}
                </span>
              </div>

              <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                <span>代码: {currentDistrict.adcode}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  GeoJSON 320100
                </span>
              </div>
            </div>

          </div>

          {/* 地图底部快速区划切换 Pill 条 (11 个行政区划完整呈现) */}
          <div className="flex items-center justify-between text-[11px] pt-1 z-10 shrink-0">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 max-w-[82%]">
              {mockNanjingGeoDistricts.map((d, idx) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setActiveDistrictIndex(idx);
                    setIsMapAutoPlaying(false);
                  }}
                  className={`px-1.5 py-0.5 rounded-lg font-bold text-[10px] transition cursor-pointer whitespace-nowrap shrink-0 ${
                    idx === activeDistrictIndex
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {d.name.replace('区', '')} <span className="font-mono text-[9px] opacity-75">{d.totalCases}</span>
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
              全市 128 项
            </span>
          </div>

        </div>

        {/* 右侧：纵向堆叠双模块 (占 7 列，高度 805px，包含案例状态分布与典型案例自动轮播) */}
        <div className="lg:col-span-7 flex flex-col gap-3 h-full">
          
          {/* 右上：案例状态分布 (高度 330px) */}
          <div className="p-4 bg-slate-900/95 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md h-[330px] shrink-0">
            
            {/* Header 标题 */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-black text-white tracking-wide">
                  案例状态分布
                </h3>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                主导产业链成果转化推进
              </div>
            </div>

            {/* 状态总体占比指示栏 (落地 56 / 试点 42 / 签约 30) */}
            <div className="grid grid-cols-3 gap-3 py-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 my-1">
              <div className="text-center">
                <div className="text-xs text-slate-400 font-medium">已落地转化</div>
                <div className="text-lg font-black font-mono text-emerald-400">
                  56 <span className="text-xs font-normal text-slate-400">项 (43.8%)</span>
                </div>
              </div>
              <div className="text-center border-x border-slate-800">
                <div className="text-xs text-slate-400 font-medium">试点验证中</div>
                <div className="text-lg font-black font-mono text-amber-400">
                  42 <span className="text-xs font-normal text-slate-400">项 (32.8%)</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400 font-medium">已签约合作</div>
                <div className="text-lg font-black font-mono text-cyan-400">
                  30 <span className="text-xs font-normal text-slate-400">项 (23.4%)</span>
                </div>
              </div>
            </div>

            {/* 各产业链堆叠柱状图 */}
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockIndustryCaseStatusBreakdown}
                  margin={{ top: 12, right: 10, left: -22, bottom: 0 }}
                >
                  <XAxis
                    dataKey="industry"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={false}
                    domain={[0, 48]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: '#f8fafc'
                    }}
                    formatter={(value: any, name: any) => {
                      const labelMap: Record<string, string> = {
                        deployed: '已落地转化',
                        pilot: '试点验证中',
                        signed: '已签约合作'
                      };
                      return [`${value} 项`, labelMap[name] || name];
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    iconSize={7}
                    wrapperStyle={{ fontSize: '10px', paddingBottom: '4px' }}
                    formatter={(value: string) => {
                      if (value === 'deployed') return '已落地转化';
                      if (value === 'pilot') return '试点验证中';
                      if (value === 'signed') return '已签约合作';
                      return value;
                    }}
                  />
                  <Bar dataKey="deployed" stackId="a" fill="#10B981" name="deployed" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="pilot" stackId="a" fill="#F59E0B" name="pilot" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="signed" stackId="a" fill="#06B6D4" name="signed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* 右下：典型案例（自动轮播） (高度 325px，充满剩余高度) */}
          <div className="p-3.5 bg-slate-900/95 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md flex-1 min-h-[320px]">
            
            {/* 案例轮播 Header 控制条 */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <h3 className="text-xs font-black text-white tracking-wide">
                  典型案例
                </h3>
                <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  标杆示范样本 · 自动轮播展示
                </span>
              </div>

              {/* 轮播页签与翻页按钮 */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  第 {casePageIndex + 1} / 2 组 (共 6 项标杆)
                </span>

                {/* 播放/暂停控制 */}
                <button
                  onClick={() => setIsCaseAutoPlaying(!isCaseAutoPlaying)}
                  className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title={isCaseAutoPlaying ? '暂停案例轮播' : '继续案例轮播'}
                >
                  {isCaseAutoPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                </button>

                {/* 上下翻页 */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setCasePageIndex(prev => (prev === 0 ? 1 : 0));
                      setIsCaseAutoPlaying(false);
                    }}
                    className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCasePageIndex(prev => (prev === 0 ? 1 : 0));
                      setIsCaseAutoPlaying(false);
                    }}
                    className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3 个并排案例卡片 (在 7 列宽度中水平铺开，排版舒适从容) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 my-1.5 flex-1 items-stretch">
              {currentCases.map(c => {
                const isDeployed = c.status === '已落地转化' || c.status === '已落地';
                const isPilot = c.status === '试点验证中' || c.status === '试点中';

                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCase && onSelectCase(c)}
                    className="p-3 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-sm"
                  >
                    {/* 顶部企业与状态 */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="font-bold text-white text-xs truncate">
                          {c.enterpriseName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                          {c.industry}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isDeployed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : isPilot
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    </div>

                    {/* 标题 */}
                    <h4 className="text-xs font-black text-white group-hover:text-indigo-300 transition line-clamp-1 my-1">
                      {c.title}
                    </h4>

                    {/* 核心问题与成效 */}
                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                      <strong className="text-slate-300">解决问题：</strong>
                      {c.problemSolved}
                    </p>

                    {/* 底部信息栏 */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        来源：{c.source}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                          <Cpu className="w-3 h-3" />
                          {c.computeConsumed} 卡时
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
