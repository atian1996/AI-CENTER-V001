import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  TrendingUp,
  Layers,
  ChevronRight,
  ExternalLink,
  Play,
  Pause,
  Award,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Clock,
  TrendingDown,
  Cpu,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
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
    <div className="w-full text-slate-100 space-y-4 select-none font-sans">
      
      {/* 1. 顶部标题栏 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-2 pb-1 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight">
              产业生态成果
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-600/20 text-blue-400 border border-blue-500/30">
              全域辖区视界
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            2026年10月12日 · 覆盖南京11个行政区与重点产业园
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center gap-2 self-start md:self-auto shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>按辖区展现产业集聚与实体可追溯成果</span>
        </div>
      </div>

      {/* 2. 顶部五个指标卡（全部增加环比趋势小字，产业链副标签改具体名称） */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* 指标卡 1：产业成果总数 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between h-[138px] hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">产业成果总数</span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
              本季 +14
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-white font-mono mt-0.5">128</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] text-blue-400 font-medium truncate">
              赛事 67 / 实训 38 / 实验场 23
            </div>
            <div className="text-[10px] text-slate-500 text-right">出处：案例台账</div>
          </div>
        </div>

        {/* 指标卡 2：已落地转化 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between h-[138px] hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">已落地转化</span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
              本季 +8
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-0.5">56</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] text-emerald-300 font-medium truncate">
              行业应用 18 / 高校 15 / 其他 23
            </div>
            <div className="text-[10px] text-slate-500 text-right">出处：案例台账</div>
          </div>
        </div>

        {/* 指标卡 3：试点验证中 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between h-[138px] hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">试点验证中</span>
            <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">
              本季 +4
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-cyan-400 font-mono mt-0.5">42</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] text-cyan-300 font-medium truncate">
              行业应用 14 / 高校 12 / 其他 16
            </div>
            <div className="text-[10px] text-slate-500 text-right">出处：案例台账</div>
          </div>
        </div>

        {/* 指标卡 4：已签约合作 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between h-[138px] hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">已签约合作</span>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded-full">
              本季 +2
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-amber-400 font-mono mt-0.5">30</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] text-amber-300 font-medium truncate">
              行业应用 10 / 高校 8 / 其他 12
            </div>
            <div className="text-[10px] text-slate-500 text-right">出处：案例台账</div>
          </div>
        </div>

        {/* 指标卡 5：覆盖产业链条 (具体支柱名称) */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between h-[138px] hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">覆盖产业链条</span>
            <span className="text-[11px] font-bold text-purple-400 bg-purple-950/60 border border-purple-500/30 px-1.5 py-0.5 rounded-full">
              本季 +1深化
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-purple-400 font-mono mt-0.5">
              6 <span className="text-xs font-normal text-slate-400">大重点链条</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[10.5px] text-purple-300 font-medium truncate" title="智造 · 电子 · 医药 · 新能源 · 文旅 · 农业">
              智造·电子·医药·新能源·文旅·农业
            </div>
            <div className="text-[10px] text-slate-500 text-right">出处：案例标签</div>
          </div>
        </div>

      </div>

      {/* ================= 第一行：左侧地图 (占 60% 宽度，突出 C 位) + 右侧当前轮播数据面板 (占 40%) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* 左侧：南京行政区划纵向地图核心视觉 (占 7 列 / 约 60% 宽度) */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-900/95 border border-slate-800/90 shadow-2xl flex flex-col justify-between space-y-3 relative overflow-hidden">
          
          {/* 地图上方：当前轮播的产业链标签 + 轮播控制 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: currentCarousel.color }}></span>
              <span className="text-xs text-slate-400 font-medium">当前轮播聚焦：</span>
              <span className="text-lg font-black text-white">{currentCarousel.name}</span>
              <span className="text-xs font-bold text-amber-400 font-mono bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded-md">
                {currentCarousel.caseCount} 项成果
              </span>
            </div>

            {/* 轮播暂停/播放控制 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCarouselPlaying(!isCarouselPlaying)}
                className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-inner"
                title={isCarouselPlaying ? '暂停轮播' : '继续自动轮播'}
              >
                {isCarouselPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isCarouselPlaying ? '5秒自动轮播' : '已暂停'}</span>
              </button>
            </div>
          </div>

          {/* 南京行政区划纵向地图容器 (宽阔大尺寸，高约 480px，充分展现纵向舒展) */}
          <div className="relative w-full h-[470px] flex items-center justify-center bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800/80 p-2">
            <svg
              viewBox={NANJING_SVG_VIEWBOX}
              className="w-full h-full max-h-[460px] select-none"
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

              {/* 长江水文线示意 */}
              <path
                d={YANGTZE_RIVER_SVG_PATH}
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.8"
                strokeDasharray="5 3"
                opacity="0.75"
              />

              {/* 南京 11 个行政区矢量路径与成果标签 */}
              {mockNanjingGeoDistricts.map(district => {
                const count = getDistrictCount(district.name);
                const isDistrictActive = count !== null;
                const isHovered = hoveredDistrict === district.name;

                return (
                  <g
                    key={district.id}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredDistrict(district.name)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                  >
                    <path
                      d={district.svgPath}
                      fill={isDistrictActive ? currentCarousel.color : isHovered ? '#334155' : '#1E293B'}
                      fillOpacity={isDistrictActive ? (isHovered ? 1 : 0.92) : (isHovered ? 0.7 : 0.45)}
                      stroke={isDistrictActive ? '#FFFFFF' : isHovered ? '#94A3B8' : '#334155'}
                      strokeWidth={isDistrictActive ? 2 : 0.9}
                      filter={isDistrictActive ? 'url(#mapGlowV2)' : undefined}
                      className="transition-all duration-300"
                    />

                    {isDistrictActive ? (
                      // 轮播活跃区域：显示区名 + 成果数量标签
                      <g key={`active-badge-${district.id}`} className="transition-all duration-300 pointer-events-none">
                        {/* 行政区名称（稍向上偏移） */}
                        <text
                          x={district.svgCenter.x}
                          y={district.svgCenter.y - 7}
                          fill="#FFFFFF"
                          fontSize="9.5"
                          fontWeight="900"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="drop-shadow-md select-none tracking-wider"
                        >
                          {district.name}
                        </text>

                        {/* 成果数量胶囊标签 */}
                        <g filter="url(#badgeShadow)">
                          <rect
                            x={district.svgCenter.x - 20}
                            y={district.svgCenter.y + 3}
                            width="40"
                            height="16"
                            rx="8"
                            fill="#050B14"
                            fillOpacity="0.95"
                            stroke={currentCarousel.color}
                            strokeWidth="1.6"
                          />
                          {/* 呼吸状态灯 */}
                          <circle
                            cx={district.svgCenter.x - 11}
                            y={district.svgCenter.y + 11}
                            r="2.5"
                            fill={currentCarousel.color}
                            className="animate-pulse"
                          />
                          {/* 成果数量 */}
                          <text
                            x={district.svgCenter.x + 5}
                            y={district.svgCenter.y + 11.5}
                            fill="#FFFFFF"
                            fontSize="9"
                            fontWeight="900"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono font-black select-none"
                          >
                            {count}项
                          </text>
                        </g>
                      </g>
                    ) : (
                      // 非活跃区域：仅显示标准区名
                      <text
                        x={district.svgCenter.x}
                        y={district.svgCenter.y}
                        fill={isHovered ? '#FFFFFF' : '#94A3B8'}
                        fontSize="9.5"
                        fontWeight={isHovered ? '800' : '600'}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="pointer-events-none drop-shadow select-none transition-colors"
                      >
                        {district.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* 地图悬浮小指示：显示当前链条在各区域的具体成果分布 */}
            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 shadow-xl flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>
                案例分布：
                <strong className="text-white font-bold ml-1">
                  {currentCarousel.districts.map(d => {
                    const cnt = getDistrictCount(d);
                    return cnt ? `${d}(${cnt}项)` : d;
                  }).join(' · ')}
                </strong>
              </span>
            </div>

            {/* 悬浮区县提示（带成果数量） */}
            {hoveredDistrict && (
              <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-blue-500/40 rounded-xl px-3 py-1.5 text-xs text-blue-300 shadow-xl flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getDistrictCount(hoveredDistrict) ? currentCarousel.color : '#64748B' }}
                ></span>
                <span>
                  {hoveredDistrict}：
                  {getDistrictCount(hoveredDistrict) ? (
                    <strong className="text-white font-bold ml-1">
                      {currentCarousel.name}成果 {getDistrictCount(hoveredDistrict)} 项
                    </strong>
                  ) : (
                    <span className="text-slate-400 ml-1">非当前链条集聚区</span>
                  )}
                </span>
              </div>
            )}
            
            <div className="absolute bottom-2.5 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] text-slate-400 font-mono">
              经纬度基准：南京市地理空间分布 · 长江水文贯通
            </div>
          </div>

          {/* 地图底部：6 大产业链条切换按钮 */}
          <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
              {mockV2IndustryCarousels.map((item, idx) => {
                const isSelected = idx === currentCarouselIdx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentCarouselIdx(idx);
                      setIsCarouselPlaying(false);
                    }}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-white font-extrabold ring-2 ring-white/30 scale-[1.03] shadow-lg'
                        : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-1 font-bold">{item.caseCount}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧：当前轮播产业链数据面板 (占 5 列 / 约 40% 宽度，深挖聚焦当前产业链) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-900/95 border border-slate-800/90 shadow-2xl flex flex-col justify-between space-y-3">
          
          {/* 面板标题 */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentCarousel.color }}></span>
              <h2 className="text-base font-extrabold text-white">
                {currentCarousel.name} · 产业链深度透视
              </h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              案例总数 {currentCarousel.caseCount} 项
            </span>
          </div>

          {/* 状态三段式分解 */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">已落地转化</span>
              <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">
                {currentCarousel.landingCount || 18} <span className="text-[10px] text-slate-500 font-normal">项</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">试点验证中</span>
              <span className="text-xl font-black text-cyan-400 font-mono mt-0.5 block">
                {currentCarousel.testingCount || 12} <span className="text-[10px] text-slate-500 font-normal">项</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">签约合作</span>
              <span className="text-xl font-black text-amber-400 font-mono mt-0.5 block">
                {currentCarousel.signingCount || 8} <span className="text-[10px] text-slate-500 font-normal">项</span>
              </span>
            </div>
          </div>

          {/* 重点场景与算力支撑 */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">核心赋能场景：</span>
              <span className="text-blue-400 font-mono font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                算力消纳 {currentCarousel.computeHours || '12,400'} 卡时
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              {currentCarousel.desc}
            </p>
          </div>

          {/* 标杆降本增效案例（可直接点击打开详情） */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                标杆降本增效成果（可精准追溯）
              </span>
              <span className="text-[11px] font-mono font-black text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                {currentCarousel.keyCaseSaving || '年化降本 320 万元'}
              </span>
            </div>
            
            <div
              onClick={() => {
                const found = mockV2CostSavingCases.find(c => c.id === currentCarousel.keyCaseId) || mockV2CostSavingCases[0];
                setSelectedCase(found);
              }}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group"
            >
              <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                {currentCarousel.keyCaseTitle || '汽车精密压铸件AI微米级缺陷实时检测系统'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                <span>依托实体：{currentCarousel.topEnterprise || '南京智造精工自动化有限公司'}</span>
                <span className="text-blue-400 group-hover:text-blue-300 flex items-center gap-0.5 font-medium">
                  查看台账 <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* 代表企业集聚 */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-400 font-medium">代表集聚实体（支持点击查看）：</span>
            <div className="flex flex-wrap gap-1.5">
              {currentCarousel.enterprises.split('、').map((entName, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const matched = mockV2ScaledEnterprises.find(s => s.name.includes(entName) || entName.includes(s.name.slice(0, 4))) || {
                      id: `ent-carousel-${i}`,
                      name: entName,
                      status: '培育中',
                      category: '行业应用',
                      district: currentCarousel.districts[0] || '江宁区',
                      joinDate: '2026-04-15',
                      revenue: '1,680 万元',
                      targetScaleDate: '正常运营考核中',
                      computeHours: 2400,
                      highlight: `南京${currentCarousel.name}重点培育骨干实体，已完成场景落地验证与模型接入。`
                    };
                    setSelectedEnterprise(matched as EcoV2ScaledEnterprise);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-xs text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <Building2 className="w-3 h-3 text-blue-400" />
                  <span>{entName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 出处标注 */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            <span>链条协同：多学科融合赋能</span>
            <span>出处：案例台账 / 企业台账</span>
          </div>

        </div>

      </div>

      {/* ================= 第二行：左侧入驻企业类型 + 中间案例状态与成效 + 右侧企业名录 ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* 左侧：入驻辖区企业类型分布 (占 4 列) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>入驻辖区企业类型分布</span>
            </h3>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              本季度新增 4 家
            </span>
          </div>

          {/* 环形图 + 5色列表 */}
          <div className="flex items-center justify-around py-1">
            <div className="relative w-[130px] h-[130px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockV2EnterpriseTypes}
                    dataKey="count"
                    nameKey="type"
                    innerRadius={42}
                    outerRadius={62}
                    stroke="#0F172A"
                    strokeWidth={2.5}
                  >
                    {mockV2EnterpriseTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-lg font-black text-white font-mono">58 家</span>
                <span className="text-[10px] text-slate-400">总入驻</span>
              </div>
            </div>

            {/* 5色分类指标：百分比【加粗】 */}
            <div className="space-y-1.5 flex-1 pl-3 text-xs">
              {mockV2EnterpriseTypes.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-300 font-medium truncate">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono shrink-0 ml-1">
                    <span className="text-slate-200">{item.count}</span>
                    <span className="font-black text-white text-[11px] w-8 text-right">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 优化点：底部加说明 + 标注口径说明 */}
          <div className="space-y-1 pt-2 border-t border-slate-800/80 text-[11px]">
            <div className="text-slate-300 font-medium">涵盖OPC、高新初创与联合科研</div>
            <div className="text-amber-400/90 font-medium">
              口径说明：58家为辖区入驻总数，11家为已录入平台实体
            </div>
            <div className="text-slate-500 text-right text-[10px]">出处：辖区运营台账</div>
          </div>
        </div>

        {/* 中间：案例状态分布与降本增效标杆 (占 4 列) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>典型降本增效案例（24项）</span>
            </h3>
            <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
              可精准追溯
            </span>
          </div>

          {/* 案例状态小横条 */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs py-0.5">
            {caseStatusData.map((st, i) => (
              <div key={i} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400">{st.name}</span>
                <span className="font-black text-sm font-mono mt-0.5" style={{ color: st.color }}>
                  {st.value} <span className="text-[9px] font-normal text-slate-500">({st.pct}%)</span>
                </span>
              </div>
            ))}
          </div>

          {/* 降本案例列表 */}
          <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
            {mockV2CostSavingCases.slice(0, 3).map((cItem) => (
              <div
                key={cItem.id}
                onClick={() => setSelectedCase(cItem)}
                className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                    {cItem.title}
                  </span>
                  <span className="text-[11px] font-black text-emerald-400 font-mono shrink-0 ml-1">
                    {cItem.savingValue}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{cItem.enterpriseName} · {cItem.district}</span>
                  <span className="text-blue-400 group-hover:text-blue-300 flex items-center gap-0.5 font-medium">
                    详情 <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            <span>点击可查看企业降本测算口径</span>
            <span>数据出处：案例台账</span>
          </div>
        </div>

        {/* 右侧：辖区入驻企业名录 (占 4 列) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>辖区入驻企业名录</span>
            </h3>

            {/* 搜索与分类筛选 */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜企业/区..."
                  value={searchKey}
                  onChange={e => setSearchKey(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-6 pr-1.5 py-0.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-24"
                />
              </div>

              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-0.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="全部">全部</option>
                <option value="行业应用">行业</option>
                <option value="高校合作">高校</option>
                <option value="OPC创业">OPC</option>
                <option value="初创团队">初创</option>
              </select>
            </div>
          </div>

          {/* 表格列表，可滚动 */}
          <div className="h-[215px] overflow-y-auto space-y-1.5 pr-1">
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
                    highlight: `${ent.desc}，已租用辖区场地 ${ent.rentArea}，现有技术团队 ${ent.staffCount} 人。`
                  };
                  setSelectedEnterprise(matched as EcoV2ScaledEnterprise);
                }}
                className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-blue-500/40 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="space-y-0.5 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-blue-400 transition truncate max-w-[130px]">
                      {ent.name}
                    </span>
                    <span className="text-[10px] px-1 rounded bg-blue-900/30 text-blue-300 border border-blue-800/40 shrink-0">
                      {ent.district}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {ent.type} · 租用 {ent.rentArea}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    ent.status === '已入统'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : ent.status === '辅导中'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {ent.status}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
            <span>收录 11 家平台实体 · 58家为全域入驻总数</span>
            <span>出处：辖区运营台账</span>
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
