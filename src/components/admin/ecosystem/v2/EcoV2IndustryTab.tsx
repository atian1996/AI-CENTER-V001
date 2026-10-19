import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  Play,
  Pause,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  TrendingDown,
  Cpu,
  Layers,
  Radio,
  Compass
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  mockV2IndustryCarousels,
  mockV2EnterpriseTypes,
  mockV2SettledEnterprises,
  mockV2CostSavingCases,
  mockV2ScaledEnterprises,
  EcoV2ScaledEnterprise,
  EcoV2CostSavingCase
} from './mockEcoV2Data';
import {
  mockNanjingGeoDistricts,
  NANJING_SVG_VIEWBOX,
  YANGTZE_RIVER_SVG_PATH
} from '../nanjingGeoData';
import { EcoV2EnterpriseModal } from './EcoV2EnterpriseModal';
import { EcoV2CaseModal } from './EcoV2CaseModal';

export const EcoV2IndustryTab: React.FC = () => {
  // 当前轮播的产业链索引 (0 ~ 5)
  const [currentCarouselIdx, setCurrentCarouselIdx] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);

  // 选中的弹窗企业与案例
  const [selectedEnterprise, setSelectedEnterprise] = useState<EcoV2ScaledEnterprise | null>(null);
  const [selectedCase, setSelectedCase] = useState<EcoV2CostSavingCase | null>(null);

  // 地图悬停区县
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  // 名录搜索和筛选
  const [searchKey, setSearchKey] = useState('');
  const [filterType, setFilterType] = useState('全部');

  // 每 5 秒轮播切换一个产业链
  useEffect(() => {
    if (!isCarouselPlaying) return;
    const timer = setInterval(() => {
      setCurrentCarouselIdx(prev => (prev + 1) % mockV2IndustryCarousels.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isCarouselPlaying]);

  const currentCarousel = mockV2IndustryCarousels[currentCarouselIdx];

  // 获取当前轮播产业链在指定区县的成果数量
  const getDistrictCount = (districtName: string): number | null => {
    if (!currentCarousel || !currentCarousel.districtCounts) return null;
    for (const [k, v] of Object.entries(currentCarousel.districtCounts)) {
      if (districtName.includes(k.replace('区', '')) || k.includes(districtName.replace('区', ''))) {
        return v;
      }
    }
    return null;
  };

  // 案例状态分布数据
  const caseStatusData = [
    { name: '已落地转化', value: 56, pct: 44, color: '#10B981', newCount: '+8' },
    { name: '试点验证中', value: 42, pct: 33, color: '#06B6D4', newCount: '+4' },
    { name: '已签约合作', value: 30, pct: 23, color: '#F59E0B', newCount: '+2' },
  ];

  // 过滤后的入驻企业列表
  const filteredEnterprises = mockV2SettledEnterprises.filter(item => {
    const matchSearch = item.name.includes(searchKey) || item.district.includes(searchKey);
    const matchType = filterType === '全部' || item.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="w-full h-full text-slate-100 flex flex-col justify-between gap-3 select-none font-sans overflow-hidden">
      
      {/* 1. 顶部标题栏 */}
      <div className="flex items-center justify-between px-1 shrink-0 h-9 border-b border-slate-800/80 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
          <h2 className="text-base font-black text-white tracking-wide flex items-center gap-2">
            AI生态看板 · 产业生态成果
          </h2>
          <span className="text-xs text-slate-400 hidden md:inline font-normal">
            南京11个行政区与重点产业园 · 成果可精准回溯
          </span>
        </div>

        <div className="text-xs font-mono font-bold text-slate-300 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-800 shadow-sm flex items-center gap-2">
          <span>2026年10月12日</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            全域辖区视界
          </span>
        </div>
      </div>

      {/* 2. 顶部五个核心指标卡（高度紧凑125px，契合1080p满屏排版） */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0 h-[125px]">
        
        {/* 指标卡 1：产业成果总数 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between h-full hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">产业成果总数</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
              本季 +14
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono leading-none">128</span>
              <span className="text-xs text-slate-400">项</span>
            </div>
            <div className="text-[11px] text-blue-400 font-medium mt-1 truncate">
              赛事 67 / 实训 38 / 实验场 23
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 text-right">
            出处：案例台账
          </div>
        </div>

        {/* 指标卡 2：已落地转化 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between h-full hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">已落地转化</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
              本季 +8
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-emerald-400 font-mono leading-none">56</span>
              <span className="text-xs text-slate-400">项</span>
            </div>
            <div className="text-[11px] text-emerald-300 font-medium mt-1 truncate">
              转化率 43.8% · 标杆示范
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 text-right">
            出处：案例台账
          </div>
        </div>

        {/* 指标卡 3：试点验证中 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between h-full hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">试点验证中</span>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">
              本季 +4
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-cyan-400 font-mono leading-none">42</span>
              <span className="text-xs text-slate-400">项</span>
            </div>
            <div className="text-[11px] text-cyan-300 font-medium mt-1 truncate">
              实训入场 14 / 院校 12 / 辖区 16
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 text-right">
            出处：案例台账
          </div>
        </div>

        {/* 指标卡 4：已签约合作 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between h-full hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">已签约合作</span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded-full">
              本季 +2
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-amber-400 font-mono leading-none">30</span>
              <span className="text-xs text-slate-400">项</span>
            </div>
            <div className="text-[11px] text-amber-300 font-medium mt-1 truncate">
              校企地多方战略联营
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 text-right">
            出处：案例台账
          </div>
        </div>

        {/* 指标卡 5：覆盖产业链条 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between h-full hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">覆盖产业链条</span>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-950/60 border border-purple-500/30 px-1.5 py-0.5 rounded-full">
              本季 +1深化
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-purple-400 font-mono leading-none">6</span>
              <span className="text-xs text-slate-400">大支柱链条</span>
            </div>
            <div className="text-[10.5px] text-purple-300 font-medium mt-1 truncate" title="智造·电子·医药·新能源·文旅·农业">
              智造·电子·医药·新能源·文旅·农业
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 text-right">
            出处：案例标签
          </div>
        </div>

      </div>

      {/* 3. 主体工作区：高能效竖向双列大屏布局 (高约 740px，1920*1080 满屏呈现) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 shrink-0 h-[740px]">
        
        {/* 左侧：专属竖向高矩形「南京产业生态地图」舱体 (占 5 列，纵向南北狭长比，大尺寸展示并保证字号清晰) */}
        <div className="lg:col-span-5 p-3.5 bg-slate-900/95 border border-slate-800 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-xl h-full">
          
          {/* 地图 Header & 轮播控制 */}
          <div className="flex items-center justify-between z-10 shrink-0 pb-1.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
              <h3 className="text-xs font-black text-white tracking-wide">
                南京市全域产业生态地图
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>320100 矢量全域</span>
              </span>
            </div>

            {/* 自动巡检/轮播控制器 */}
            <div className="flex items-center gap-1.5 bg-slate-950/90 px-2.5 py-1 rounded-xl border border-slate-800 text-[10px]">
              <span className="flex items-center gap-1 text-cyan-300 font-bold">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>链条巡检</span>
              </span>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setIsCarouselPlaying(!isCarouselPlaying)}
                className="text-slate-400 hover:text-white transition cursor-pointer p-0.5"
                title={isCarouselPlaying ? '暂停轮播' : '继续自动轮播'}
              >
                {isCarouselPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* 核心竖向矩形地图渲染容器 (南北纵向0.54宽高比，垂直拉满放大，文字数字胶囊大字号清晰可见) */}
          <div className="relative flex-1 w-full my-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-hidden flex items-center justify-center p-1">
            
            {/* 科技网格与深空渐变光效 */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* 指北针与比例尺 HUD */}
            <div className="absolute top-2 left-2 z-20 flex flex-col items-center bg-slate-900/90 px-2 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 pointer-events-none shadow-md">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[9px] font-bold text-slate-200 mt-0.5">N</span>
              <div className="w-4 h-0.5 bg-slate-700 my-0.5" />
              <span className="text-[8px] font-mono text-slate-500">10km</span>
            </div>

            {/* 长江水文标识 */}
            <div className="absolute top-[37%] left-2.5 z-15 pointer-events-none text-[10px] font-bold text-cyan-400/80 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 backdrop-blur-xs flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              长江主水系贯通
            </div>

            {/* 当前产业链分布悬浮提示 */}
            <div className="absolute top-2 right-2 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs text-slate-200 shadow-xl flex items-center gap-1.5 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentCarousel.color }}></span>
              <span className="font-bold text-white text-[11px]">{currentCarousel.name}</span>
              <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-500/30">
                {currentCarousel.caseCount}项
              </span>
            </div>

            {/* 竖向高比例 420x720 矢量 SVG 画布 */}
            <svg
              viewBox={NANJING_SVG_VIEWBOX}
              className="w-full h-full max-h-[580px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] select-none"
            >
              <defs>
                <filter id="mapGlowV2" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
                </filter>
              </defs>

              {/* 1. 长江主航道水文曲线 */}
              <g className="pointer-events-none">
                <path
                  d={YANGTZE_RIVER_SVG_PATH}
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="5"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                />
                <path
                  d={YANGTZE_RIVER_SVG_PATH}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.2"
                  strokeOpacity="0.8"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              </g>

              {/* 2. 南京 11 个区划真实矢量多边形边界 */}
              <g>
                {mockNanjingGeoDistricts.map(district => {
                  const count = getDistrictCount(district.name);
                  const isDistrictActive = count !== null;
                  const isHovered = hoveredDistrict === district.name;

                  return (
                    <path
                      key={district.id}
                      d={district.svgPath}
                      fill={
                        isDistrictActive
                          ? currentCarousel.color
                          : isHovered
                          ? '#1e293b'
                          : '#0f172a'
                      }
                      fillOpacity={isDistrictActive ? (isHovered ? 1 : 0.92) : (isHovered ? 0.75 : 0.55)}
                      stroke={
                        isDistrictActive
                          ? '#ffffff'
                          : isHovered
                          ? '#38bdf8'
                          : '#334155'
                      }
                      strokeWidth={isDistrictActive ? 2.2 : isHovered ? 1.6 : 1.0}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      filter={isDistrictActive ? 'url(#mapGlowV2)' : undefined}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredDistrict(district.name)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    >
                      <title>{district.name}: {count !== null ? `${currentCarousel.name} ${count}项成果` : district.badge}</title>
                    </path>
                  );
                })}
              </g>

              {/* 3. 南京 11 个行政区名称与成果标签 (大字号清晰胶囊) */}
              <g>
                {mockNanjingGeoDistricts.map(district => {
                  const count = getDistrictCount(district.name);
                  const isDistrictActive = count !== null;
                  const isHovered = hoveredDistrict === district.name;

                  return (
                    <g
                      key={`pin-${district.id}`}
                      className="cursor-pointer transition-transform duration-200"
                      onMouseEnter={() => setHoveredDistrict(district.name)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    >
                      {/* 活跃状态涟漪光环 */}
                      {isDistrictActive && (
                        <circle
                          cx={district.svgCenter.x}
                          cy={district.svgCenter.y}
                          r="18"
                          className="animate-ping"
                          fill="none"
                          stroke={currentCarousel.color}
                          strokeWidth="2.2"
                          opacity="0.4"
                        />
                      )}

                      {/* 中心锚点点位 */}
                      <circle
                        cx={district.svgCenter.x}
                        cy={district.svgCenter.y}
                        r={isDistrictActive ? 5 : isHovered ? 4.2 : 3}
                        fill={isDistrictActive ? currentCarousel.color : isHovered ? '#38bdf8' : '#64748b'}
                        stroke="#0f172a"
                        strokeWidth={1.8}
                      />

                      {/* 胶囊徽标：区名 + 成果数量/总成果，采用大字号和高对比背景，清晰无阻碍 */}
                      <g
                        transform={`translate(${district.svgCenter.x}, ${
                          district.svgCenter.y - (isDistrictActive ? 18 : 14)
                        })`}
                        filter="url(#badgeShadow)"
                      >
                        <rect
                          x={isDistrictActive ? -32 : -26}
                          y={-11}
                          width={isDistrictActive ? 64 : 52}
                          height={22}
                          rx={11}
                          fill={isDistrictActive ? '#050b14' : isHovered ? '#1e293b' : '#090d16'}
                          stroke={isDistrictActive ? '#ffffff' : isHovered ? '#38bdf8' : '#334155'}
                          strokeWidth={isDistrictActive ? 1.8 : 1}
                          opacity={isDistrictActive ? 0.98 : 0.88}
                        />
                        {/* 呼吸状态灯 */}
                        {isDistrictActive && (
                          <circle
                            cx={-22}
                            cy={0}
                            r="3"
                            fill={currentCarousel.color}
                            className="animate-pulse"
                          />
                        )}
                        <text
                          x={isDistrictActive ? 4 : 0}
                          y={3.5}
                          textAnchor="middle"
                          fontSize={isDistrictActive ? 11 : 10}
                          fontWeight="bold"
                          fill={isDistrictActive ? '#ffffff' : isHovered ? '#f1f5f9' : '#cbd5e1'}
                          className="select-none pointer-events-none font-sans"
                        >
                          {district.name.replace('区', '')} {isDistrictActive ? `${count}项` : `${district.totalCases}`}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* 底部经纬度标尺 */}
            <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg px-2 py-0.5 text-[9px] text-slate-400 font-mono pointer-events-none">
              坐标系：南京市官方矢量界线 · 南北纵向贯通
            </div>
          </div>

          {/* 地图底部：6 大产业链条切换按钮 */}
          <div className="space-y-1 pt-1.5 border-t border-slate-800/80 shrink-0">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs">
              {mockV2IndustryCarousels.map((item, idx) => {
                const isSelected = idx === currentCarouselIdx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentCarouselIdx(idx);
                      setIsCarouselPlaying(false);
                    }}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-xl transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-white font-extrabold ring-1.5 ring-white/40 scale-[1.02] shadow-md'
                        : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-1 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="truncate text-[11px]">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-0.5 font-bold">{item.caseCount}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧：纵向多维度深耕工作台 (占 7 列，上下紧凑两层，1920*1080 满屏无空隙) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-3 h-full overflow-hidden">
          
          {/* 上半部分：当前产业链深度透视面板 (高约 345px) */}
          <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex flex-col justify-between h-[345px] shrink-0">
            {/* 面板头部 */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentCarousel.color }}></span>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>{currentCarousel.name} · 产业链深度透视</span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    {currentCarousel.caseCount} 项成果
                  </span>
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                案例分布：{currentCarousel.districts.join(' · ')}
              </span>
            </div>

            {/* 状态三段式分解 */}
            <div className="grid grid-cols-3 gap-2 my-1">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">已落地转化</span>
                  <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
                    {currentCarousel.landingCount || 18} <span className="text-[10px] text-slate-500 font-normal">项</span>
                  </span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400/60" />
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">试点验证中</span>
                  <span className="text-lg font-black text-cyan-400 font-mono mt-0.5 block">
                    {currentCarousel.testingCount || 12} <span className="text-[10px] text-slate-500 font-normal">项</span>
                  </span>
                </div>
                <Clock className="w-4 h-4 text-cyan-400/60" />
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">签约合作</span>
                  <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                    {currentCarousel.signingCount || 8} <span className="text-[10px] text-slate-500 font-normal">项</span>
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-400/60" />
              </div>
            </div>

            {/* 核心赋能场景与算力支撑 */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">核心赋能场景：</span>
                <span className="text-blue-400 font-mono font-bold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  算力消纳 {currentCarousel.computeHours || '12,400'} 卡时
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 line-clamp-2">
                {currentCarousel.desc}
              </p>
            </div>

            {/* 标杆降本增效成果 */}
            <div
              onClick={() => {
                const found = mockV2CostSavingCases.find(c => c.id === currentCarousel.keyCaseId) || mockV2CostSavingCases[0];
                setSelectedCase(found);
              }}
              className="p-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 hover:border-emerald-500/60 transition cursor-pointer group flex items-center justify-between"
            >
              <div className="flex-1 mr-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-emerald-300 transition">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">{currentCarousel.keyCaseTitle || '汽车精密压铸件AI微米级缺陷实时检测系统'}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  依托实体：{currentCarousel.topEnterprise || '南京智造精工自动化有限公司'}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-emerald-400 font-mono block">
                  {currentCarousel.keyCaseSaving || '年化降本 320 万元'}
                </span>
                <span className="text-[10px] text-blue-400 flex items-center justify-end">
                  详情 <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>

            {/* 代表集聚实体 */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
              <span className="text-slate-400 text-[11px]">代表实体：</span>
              <div className="flex items-center gap-1.5">
                {currentCarousel.enterprises.split('、').map((entName, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10.5px] text-slate-300">
                    {entName}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 下半部分：入驻企业类型 (占45%) + 辖区企业名录与案例 (占55%) (高约 380px) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-[380px] shrink-0">
            
            {/* 左侧：入驻辖区企业类型分布 (占 5 列) */}
            <div className="md:col-span-5 p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex flex-col justify-between h-full">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>入驻企业类型分布</span>
                </h4>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
                  本季 +4家
                </span>
              </div>

              {/* 环形图 + 5色列表 */}
              <div className="flex items-center justify-around my-auto">
                <div className="relative w-[110px] h-[110px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockV2EnterpriseTypes}
                        dataKey="count"
                        nameKey="type"
                        innerRadius={35}
                        outerRadius={52}
                        stroke="#0F172A"
                        strokeWidth={2}
                      >
                        {mockV2EnterpriseTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-base font-black text-white font-mono leading-none">58 家</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">总入驻</span>
                  </div>
                </div>

                {/* 5色分类指标：百分比【加粗】 */}
                <div className="space-y-1 flex-1 pl-2.5 text-xs">
                  {mockV2EnterpriseTypes.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-1 truncate">
                        <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-300 font-medium truncate text-[11px]">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono shrink-0 ml-1">
                        <span className="text-slate-200 text-[11px]">{item.count}</span>
                        <span className="font-black text-white text-[10.5px] w-7 text-right">{item.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-0.5 pt-1 border-t border-slate-800/80 text-[10px]">
                <div className="text-slate-300">涵盖OPC、高新初创与联合科研</div>
                <div className="text-amber-400/90 font-medium">
                  口径：58家为辖区总数，11家为已录入平台实体
                </div>
              </div>
            </div>

            {/* 右侧：辖区入驻企业名录 (占 7 列) */}
            <div className="md:col-span-7 p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex flex-col justify-between h-full">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>辖区入驻企业名录 (11家实体)</span>
                </h4>

                {/* 搜索与分类筛选 */}
                <div className="flex items-center gap-1">
                  <div className="relative">
                    <Search className="w-2.5 h-2.5 text-slate-400 absolute left-1.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="搜企业/区..."
                      value={searchKey}
                      onChange={e => setSearchKey(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg pl-5 pr-1 py-0.5 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-20"
                    />
                  </div>

                  <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-1 py-0.5 text-[10.5px] text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="全部">全部</option>
                    <option value="行业应用">行业</option>
                    <option value="高校合作">高校</option>
                    <option value="OPC创业">OPC</option>
                    <option value="初创团队">初创</option>
                  </select>
                </div>
              </div>

              {/* 企业可点击列表 */}
              <div className="h-[210px] overflow-y-auto space-y-1 pr-0.5">
                {filteredEnterprises.map(ent => (
                  <div
                    key={ent.id}
                    onClick={() => {
                      const matched = mockV2ScaledEnterprises.find(s => s.name === ent.name) || {
                        id: ent.id,
                        name: ent.name,
                        status: ent.status === '已入统' ? '已入统' : '培育中',
                        category: ent.type as any,
                        district: ent.district,
                        joinDate: ent.joinDate,
                        revenue: '1,200 万元',
                        targetScaleDate: '正常运营考核中',
                        computeHours: 1200,
                        highlight: `${ent.desc}，已租用场地 ${ent.rentArea}，现有技术团队 ${ent.staffCount} 人。`
                      };
                      setSelectedEnterprise(matched as EcoV2ScaledEnterprise);
                    }}
                    className="p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-blue-500/40 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex-1 mr-1 truncate">
                      <div className="text-xs font-bold text-white group-hover:text-blue-300 transition truncate">
                        {ent.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{ent.district}</span>
                        <span>·</span>
                        <span>{ent.type}</span>
                        <span>·</span>
                        <span>租用 {ent.rentArea}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${
                        ent.status === '已入统'
                          ? 'text-amber-300 bg-amber-500/10 border-amber-500/30 font-bold'
                          : 'text-blue-300 bg-blue-500/10 border-blue-500/30'
                      }`}>
                        {ent.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                <span>点击企业查看纳管详情</span>
                <span>出处：辖区运营台账 / 企业台账</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 挂载弹窗 */}
      <EcoV2EnterpriseModal
        enterprise={selectedEnterprise}
        isOpen={!!selectedEnterprise}
        onClose={() => setSelectedEnterprise(null)}
      />

      <EcoV2CaseModal
        caseItem={selectedCase}
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </div>
  );
};
