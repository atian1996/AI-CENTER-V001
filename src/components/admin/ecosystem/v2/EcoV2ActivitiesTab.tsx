import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Users,
  Award,
  Zap,
  Building2,
  Newspaper,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  mockV2TimelineActivities,
  mockV2MediaReports,
  EcoV2TimelineActivity,
  EcoV2MediaReport
} from './mockEcoV2Data';

export const EcoV2ActivitiesTab: React.FC = () => {
  // 活动时间轴轮播高亮索引 (0 ~ 8)
  const [activeActIndex, setActiveActIndex] = useState(0);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(true);

  // 选中的活动详情（可在时间轴内查看）
  const [selectedActivity, setSelectedActivity] = useState<EcoV2TimelineActivity | null>(null);

  // 每 5 秒轮播切换一个高亮活动
  useEffect(() => {
    if (!isTimelinePlaying) return;
    const timer = setInterval(() => {
      setActiveActIndex(prev => (prev + 1) % mockV2TimelineActivities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isTimelinePlaying]);

  // 活动类型分布环形图数据
  const activityTypeData = [
    { name: '沙龙交流', value: 4, pct: 36, color: '#3B82F6', desc: '深度技术交流与工作流切磋' },
    { name: '创新赛事', value: 3, pct: 27, color: '#F59E0B', desc: '造峰值引才引项目' },
    { name: '工程师实训', value: 2, pct: 18, color: '#10B981', desc: '稳基线培育实战骨干' },
    { name: '技术路演', value: 2, pct: 18, color: '#8B5CF6', desc: '揭榜项目长周期转化评审' },
  ];

  const currentActiveAct = mockV2TimelineActivities[activeActIndex];

  return (
    <div className="w-full text-slate-100 space-y-4 select-none font-sans">
      
      {/* 1. 顶部标题栏（已彻底删除接待模式相关按钮） */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-2 pb-1 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight">
              年度活动汇总
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-600/20 text-purple-400 border border-purple-500/30">
              赋能矩阵与品牌发声
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            2026年10月12日
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center gap-2 self-start md:self-auto shadow-inner">
          <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>全年度累计举办 11 场产业赋能活动</span>
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
              <h2 className="text-base font-extrabold text-white">年度全周期活动推进时间轴（1月 — 12月）</h2>
              <span className="text-xs text-amber-400 font-mono">（当前聚焦：{currentActiveAct.month} · {currentActiveAct.name}）</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              横向排布关键服务项节点，每 5 秒自动切换焦点并高亮关联辖区
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimelinePlaying(!isTimelinePlaying)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              {isTimelinePlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isTimelinePlaying ? '自动高亮轮播' : '已暂停'}</span>
            </button>
          </div>
        </div>

        {/* 横向月度节点导轨 */}
        <div className="relative pt-2 pb-3 overflow-x-auto">
          {/* 连接线 */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-800 -z-0"></div>

          {/* 9 个活动卡片横向卡片槽 */}
          <div className="flex items-start gap-4 min-w-[1200px] z-10 relative px-2">
            {mockV2TimelineActivities.map((act, index) => {
              const isHighlight = index === activeActIndex;

              return (
                <div
                  key={act.id}
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

        <div className="text-xs text-slate-500 text-right">
          轮播机制：每 5 秒切换一个活动高亮，其余卡片半透明显示；点击任意卡片可固定查看详情
        </div>
      </div>

      {/* 4. 媒体报道 + 活动类型分布 (左右分栏，已彻底移除接待模式相关内容) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* 左侧：媒体报道 (占 7 列 / 宽约 1150px) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-amber-400" />
                <span>主流媒体权威报道（23条精选）</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">面向产业各界的权威报道与品牌影响力沉淀</p>
            </div>
            <div className="text-xs text-emerald-400 font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              参赛队伍：168 / 200 支
            </div>
          </div>

          {/* 媒体列表 */}
          <div className="space-y-2.5 overflow-y-auto max-h-[290px] pr-1">
            {mockV2MediaReports.map(rep => (
              <div
                key={rep.id}
                className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-amber-500/40 transition flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {rep.mediaName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{rep.publishTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                    {rep.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {rep.summary}
                  </p>
                </div>

                <div className="text-xs text-blue-400 hover:text-blue-300 shrink-0 flex items-center gap-1 pt-1">
                  <span>{rep.linkText}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 text-right pt-2 border-t border-slate-800/80">
            报道素材均已归档至生态成果案例库
          </div>
        </div>

        {/* 右侧：活动类型分布与成效解析 (占 5 列 / 宽约 700px) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span>活动类型分布与实施成效</span>
            </h3>
            <span className="text-xs text-slate-400">总场次 11 场</span>
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
