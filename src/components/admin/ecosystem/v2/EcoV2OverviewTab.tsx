import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  Building2,
  Award,
  Sparkles,
  Trophy,
  Users,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie
} from 'recharts';
import {
  mockV2MonthlyCompute,
  mockV2OccupancyTrend,
  mockV2EnterpriseTypes,
  mockV2ScaledEnterprises,
  mockV2CostSavingCases,
  EcoV2ScaledEnterprise,
  EcoV2CostSavingCase
} from './mockEcoV2Data';
import { EcoV2EnterpriseModal } from './EcoV2EnterpriseModal';
import { EcoV2CaseModal } from './EcoV2CaseModal';

interface EcoV2OverviewTabProps {
  onSwitchToLedgerTab?: () => void;
  onSwitchToIndustryTab?: () => void;
}

export const EcoV2OverviewTab: React.FC<EcoV2OverviewTabProps> = ({
  onSwitchToLedgerTab,
  onSwitchToIndustryTab
}) => {
  // 选中的规上企业弹窗
  const [selectedEnterprise, setSelectedEnterprise] = useState<EcoV2ScaledEnterprise | null>(null);
  // 选中的案例弹窗
  const [selectedCase, setSelectedCase] = useState<EcoV2CostSavingCase | null>(null);

  return (
    <div className="w-full h-full text-slate-100 flex flex-col justify-between gap-3 select-none font-sans overflow-hidden">
      
      {/* 1. 顶部标题栏（与0.1版一致的“平台运营总览”） */}
      <div className="flex items-center justify-between px-1 shrink-0 h-9 border-b border-slate-800/80 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
          <h2 className="text-base font-black text-white tracking-wide flex items-center gap-2">
            AI生态看板 · 平台运营总览
          </h2>
          <span className="text-xs text-slate-400 hidden md:inline font-normal">
            2026年1月签约 · 3月平台上线 · 当前第1个运营年度
          </span>
        </div>
        <div className="text-xs font-mono font-bold text-slate-300 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-800 shadow-sm flex items-center gap-2">
          <span>截至 2026.10.16</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            演示原型评审
          </span>
        </div>
      </div>

      {/* 2. 顶部五个核心指标卡片 (原二类指标卡片移至顶部，高度约125px，契合1080p首屏直观呈现) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0 h-[125px]">
        
        {/* 卡片 1: 入驻企业 */}
        <div
          onClick={onSwitchToIndustryTab}
          className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between h-full shadow-md hover:shadow-emerald-500/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">入驻企业</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              本季度 +4
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono leading-none">11</span>
              <span className="text-xs text-slate-400">家</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              招商入驻盘活物业
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
            <span>出处：辖区台账</span>
            <span className="text-blue-400 flex items-center">穿透 <ChevronRight className="w-2.5 h-2.5" /></span>
          </div>
        </div>

        {/* 卡片 2: 赛事获奖落地注册 */}
        <div
          onClick={() => setSelectedEnterprise(mockV2ScaledEnterprises[3])}
          className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between h-full shadow-md hover:shadow-emerald-500/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">赛事获奖落地注册</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              本季度 +1
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono leading-none">3</span>
              <span className="text-xs text-slate-400">家</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              大赛项目孵化实体
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
            <span>出处：企业台账</span>
            <span className="text-blue-400 flex items-center">详情 <ChevronRight className="w-2.5 h-2.5" /></span>
          </div>
        </div>

        {/* 卡片 3: 揭榜产业化项目 */}
        <div
          onClick={() => setSelectedCase(mockV2CostSavingCases[1])}
          className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between h-full shadow-md hover:shadow-emerald-500/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">揭榜产业化项目</span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              攻坚推进中
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono leading-none">2</span>
              <span className="text-xs text-slate-400">项</span>
            </div>
            <div className="text-[11px] text-amber-400 font-medium mt-1">
              长周期高价值攻关
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
            <span>出处：案例台账</span>
            <span className="text-blue-400 flex items-center">详情 <ChevronRight className="w-2.5 h-2.5" /></span>
          </div>
        </div>

        {/* 卡片 4: AI落地项目 */}
        <div
          onClick={() => setSelectedCase(mockV2CostSavingCases[0])}
          className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between h-full shadow-md hover:shadow-emerald-500/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">AI落地项目</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              本季度 +2
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono leading-none">6</span>
              <span className="text-xs text-slate-400">个</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              多场景真实赋能实体
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
            <span>出处：案例台账</span>
            <span className="text-blue-400 flex items-center">详情 <ChevronRight className="w-2.5 h-2.5" /></span>
          </div>
        </div>

        {/* 卡片 5: 降本增效案例 */}
        <div
          onClick={() => setSelectedCase(mockV2CostSavingCases[2])}
          className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between h-full shadow-md hover:shadow-emerald-500/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">降本增效案例</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              本季度 +6
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono leading-none">24</span>
              <span className="text-xs text-slate-400">个</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              年化降本累计突破千万
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
            <span>出处：案例台账</span>
            <span className="text-blue-400 flex items-center">详情 <ChevronRight className="w-2.5 h-2.5" /></span>
          </div>
        </div>

      </div>

      {/* 3. 中间行：年度算力用量进度 (占60%) + 规上企业培育与辖区物业盘活 (占40%) */}
      {/* 高度紧凑适配约 460px */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 shrink-0 h-[460px]">
        
        {/* 左侧：年度算力用量进度 (占7列/60%) - 保留图表自身标题，删除一类经济指标标题 */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex flex-col justify-between h-full">
          {/* 卡片头部 */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-[#D4A843]">
                <Zap className="w-4 h-4 fill-[#D4A843]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">年度算力用量进度</h3>
                <span className="text-[11px] text-slate-400">赛事造峰值 · 实训稳基线 · 辖区填谷段 · 揭榜占长周期</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#D4A843] font-mono">68%</span>
                <span className="text-xs text-slate-400">完成率</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block">环比+12%</span>
            </div>
          </div>

          {/* 主数字与进度条 */}
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  36,800
                </span>
                <span className="text-sm font-medium text-slate-400">
                  / 年度基准 54,200 卡时
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">计量节点：截至10月16日</span>
            </div>

            {/* 进度条 100% 宽，8px 高 */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full mt-2 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-[#D4A843] to-amber-300 rounded-full shadow-sm"
                style={{ width: '68%' }}
              ></div>
            </div>
          </div>

          {/* 季度分解卡片横排 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-1">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
              <div className="text-[11px] text-slate-400">Q1（3月起）</div>
              <div className="text-sm font-extrabold text-slate-200 mt-0.5 font-mono">2,800</div>
              <div className="text-[10px] text-slate-500">平台冷启动</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
              <div className="text-[11px] text-slate-400">Q2</div>
              <div className="text-sm font-extrabold text-slate-200 mt-0.5 font-mono">12,400</div>
              <div className="text-[10px] text-slate-500">实训与揭榜入场</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
              <div className="text-[11px] text-slate-400">Q3</div>
              <div className="text-sm font-extrabold text-amber-300 mt-0.5 font-mono">16,800</div>
              <div className="text-[10px] text-emerald-400 font-bold">赛事造峰值</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
              <div className="text-[11px] text-slate-400">Q4至今</div>
              <div className="text-sm font-extrabold text-amber-400 mt-0.5 font-mono">4,800</div>
              <div className="text-[10px] text-amber-400 font-bold">冲刺年度目标</div>
            </div>
          </div>

          {/* 月度柱状图：3月—10月 */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
              <span>月度消纳趋势（3月上线 — 10月）</span>
              <span className="text-[#D4A843] font-bold">赛事造峰值贡献最大 · 出处：用量台账</span>
            </div>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockV2MonthlyCompute} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(212, 168, 67, 0.08)' }}
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val} 卡时`, '消纳用量']}
                  />
                  <Bar dataKey="compute" radius={[4, 4, 0, 0]}>
                    {mockV2MonthlyCompute.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isCurrent ? '#F59E0B' : '#D4A843'}
                        fillOpacity={entry.isCurrent ? 1 : 0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 右侧：规上企业培育 + 辖区入驻率与物业盘活 (占5列/40%) */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between h-full">
          
          {/* 右上：规上企业培育 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex flex-col justify-between flex-1">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">规上企业培育</h3>
              </div>
              <button
                onClick={() => setSelectedEnterprise(mockV2ScaledEnterprises[0])}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition cursor-pointer"
              >
                <span>逐家查看详情</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* 环形图与说明 */}
            <div className="flex items-center justify-around py-1.5">
              {/* 进度环 96px */}
              <div className="relative w-[96px] h-[96px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#1E293B" strokeWidth="10" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#D4A843"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - 1 / 3)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-black text-white font-mono">1/3家</span>
                  <span className="text-[9px] text-slate-400">已入统/目标</span>
                </div>
              </div>

              <div className="space-y-1 text-left flex-1 pl-4">
                <div className="text-xs font-bold text-white">已入统 1家 / 培育中 4家</div>
                <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>本季度新增入统 1 家</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  重点培育先进智造骨干，梯队接力攻坚升规
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500">
              <span>辅导单位：市工信局规上培育专项工作组</span>
              <span>数据出处：企业台账</span>
            </div>
          </div>

          {/* 右下：辖区入驻率与物业盘活 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex flex-col justify-between flex-1">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">辖区入驻率与物业盘活</h3>
              </div>
              <span className="text-xs text-emerald-400 font-bold">本季度新增4家，已租8,650㎡</span>
            </div>

            <div className="grid grid-cols-12 gap-2 items-center my-0.5">
              <div className="col-span-5">
                <div className="text-2xl font-black text-white font-mono">58%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">1月 42% → 10月 58%</div>
                <div className="text-xs text-amber-300 font-bold mt-1">入驻企业 11家</div>
                <div className="text-[10px] text-slate-500">物业租赁：收入归资产方</div>
              </div>

              {/* 折线图 */}
              <div className="col-span-7 h-[85px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockV2OccupancyTrend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis domain={[35, 65]} stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                      formatter={(val: any) => [`${val}%`, '入驻率']}
                    />
                    <Line type="monotone" dataKey="rate" stroke="#D4A843" strokeWidth={2.2} dot={{ r: 2, fill: '#D4A843' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500">
              <span>招商目标：Q4达成65%入驻率</span>
              <span>数据出处：辖区运营台账</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. 底部第三行：成果展示三区块 (占60%) + 入驻辖区企业类型环形图 (占40%) */}
      {/* 饱满填充满屏空间，高约 270px */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 shrink-0 h-[270px]">
        
        {/* 左侧：成果展示与影响力三区块 (占7列/60%) - 保留区块内部标题 */}
        <div className="lg:col-span-7 p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex flex-col justify-between h-full">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">影响力矩阵与成果成效</h3>
            </div>
            <span className="text-xs text-purple-400 font-bold">全周期真实赋能</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 my-auto">
            {/* 区块 1：赛事与传播 */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between h-[180px]">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-purple-400" />
                  <h4 className="text-xs font-bold text-white">赛事与传播</h4>
                </div>
                <span className="text-[10px] text-purple-300 font-mono">矩阵赋能</span>
              </div>
              <div className="space-y-1.5 py-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">本年度赛事</span>
                  <span className="text-white font-bold">已办 4 场 · 办中 2 场</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">主流媒体报道</span>
                  <span className="text-amber-300 font-bold font-mono">23 条</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">参赛队伍规模</span>
                  <span className="text-emerald-400 font-bold font-mono">168 支</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 text-right">
                出处：活动台账
              </div>
            </div>

            {/* 区块 2：人才培养 */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between h-[180px]">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <h4 className="text-xs font-bold text-white">人才培养</h4>
                </div>
                <span className="text-[10px] text-purple-300 font-mono">技术认证</span>
              </div>
              <div className="space-y-1.5 py-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">实训学员结业</span>
                  <span className="text-white font-bold font-mono">118 / 160 人</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">高水平技术认证</span>
                  <span className="text-purple-300 font-bold font-mono">96 / 130 人</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">普惠培养人次</span>
                  <span className="text-blue-400 font-bold font-mono">760 人次</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 text-right">
                出处：活动台账
              </div>
            </div>

            {/* 区块 3：AI落地项目实体 */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between h-[180px]">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <h4 className="text-xs font-bold text-white">AI落地项目实体</h4>
                </div>
                <span className="text-[10px] text-purple-300 font-mono">标杆案例</span>
              </div>
              <div className="space-y-1.5 py-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">落地项目数</span>
                  <span className="text-white font-black font-mono">6 个核心标杆</span>
                </div>
                <div className="text-slate-300 text-[11px] leading-tight line-clamp-2">
                  涵盖视觉检测、智能分拣、大模型知识库问答等
                </div>
                <div className="text-emerald-400 text-[10px] font-bold">
                  全程真实可溯源至算力卡时与企业
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 text-right">
                出处：案例台账
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：入驻辖区企业类型分布 (占5列/40%) */}
        <div className="lg:col-span-5 p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex flex-col justify-between h-full">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>入驻辖区企业类型分布</span>
            </h3>
            <span className="text-xs text-emerald-400 font-bold">本季度新增 4 家</span>
          </div>

          {/* 布局：左侧环形图，右侧图例列表 */}
          <div className="grid grid-cols-12 gap-3 items-center my-auto">
            {/* 左侧环形图 */}
            <div className="col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-[125px] h-[125px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockV2EnterpriseTypes}
                      dataKey="count"
                      nameKey="type"
                      innerRadius={40}
                      outerRadius={58}
                      stroke="#0F172A"
                      strokeWidth={2.5}
                    >
                      {mockV2EnterpriseTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-black text-white font-mono leading-none">58 家</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">总入驻实体</span>
                </div>
              </div>
            </div>

            {/* 右侧图例列表 */}
            <div className="col-span-7 space-y-1.5 text-xs">
              {mockV2EnterpriseTypes.map((item, index) => (
                <div
                  key={index}
                  className="px-2 py-1 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-white font-medium truncate text-[11px]">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono shrink-0 ml-1">
                    <span className="text-white font-bold text-[11px]">{item.count}家</span>
                    <span className="text-slate-400 text-[10px] w-7 text-right">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
            <span>口径说明：58家为辖区入驻总数，11家为已录入平台实体</span>
            <span>数据出处：辖区运营台账</span>
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
