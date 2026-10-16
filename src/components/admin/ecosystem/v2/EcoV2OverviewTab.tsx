import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  Building2,
  Award,
  ArrowUpRight,
  Sparkles,
  Trophy,
  Users,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info
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
    <div className="w-full text-slate-100 space-y-5 select-none font-sans">
      
      {/* 1. 顶部标题栏 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-2 pb-1 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight">
              考核指标总览
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-600/20 text-blue-400 border border-blue-500/30">
              v0.2 考核大屏
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1.5 font-medium">
            2026年1月签约 · 3月平台上线；当前10月（第1个运营年度）
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center gap-2 self-start md:self-auto shadow-inner">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>本视图全部为演示数据，仅用于原型评审，数据截至2026.10.16</span>
        </div>
      </div>

      {/* 2. 一类 经济指标 (C位，约占首屏一半版面，金黄色主调 #D4A843) */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
        {/* 区块标题 */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-[#D4A843] rounded-full shadow-sm shadow-[#D4A843]/50"></div>
            <h2 className="text-base font-extrabold text-[#D4A843] tracking-wide">
              一类 经济指标
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              一类指标最难但最打动决策层：算力消纳、物业盘活、规上企业，放在首屏C位。
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">权重占比 50%</span>
        </div>

        {/* 主体分栏：左侧 60%，右侧 40% */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* 左上：年度算力用量进度 (占7列/60%) */}
          <div className="lg:col-span-7 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between space-y-3.5">
            <div>
              {/* 卡片头部 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-[#D4A843]">
                    <Zap className="w-4 h-4 fill-[#D4A843]" />
                  </div>
                  <h3 className="text-base font-bold text-white">年度算力用量进度</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#D4A843]">68%</span>
                  <span className="text-xs text-slate-400 ml-1">完成率</span>
                </div>
              </div>

              {/* 主数字与进度条 */}
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    36,800
                  </span>
                  <span className="text-sm font-medium text-slate-400">
                    / 年度基准 54,200 卡时
                  </span>
                </div>

                {/* 进度条 100% 宽，8px 高 */}
                <div className="w-full h-2 bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#D4A843] rounded-full shadow-sm"
                    style={{ width: '68%' }}
                  ></div>
                </div>
              </div>

              {/* 季度分解卡片横排 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Q1（3月起）</div>
                  <div className="text-sm font-extrabold text-slate-200 mt-0.5 font-mono">2,800</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Q2</div>
                  <div className="text-sm font-extrabold text-slate-200 mt-0.5 font-mono">12,400</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Q3</div>
                  <div className="text-sm font-extrabold text-amber-300 mt-0.5 font-mono">16,800</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Q4至今</div>
                  <div className="text-sm font-extrabold text-amber-400 mt-0.5 font-mono">4,800</div>
                </div>
              </div>
            </div>

            {/* 月度柱状图：3月—10月，8根柱子，高约120px，金色渐变 */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
                <span>月度消纳趋势（3月上线 — 10月）</span>
                <span className="text-[#D4A843] font-bold">环比+12%，赛事造峰值贡献最大</span>
              </div>
              <div className="h-[120px] w-full">
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

            {/* 达成路径与出处 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-bold">达成路径：</span>
                <span className="text-slate-300 font-medium">赛事造峰值 · 实训稳基线 · 辖区填谷段 · 揭榜占长周期</span>
              </div>
              <div className="text-slate-500 text-[11px] self-end sm:self-auto">
                数据出处：用量台账
              </div>
            </div>
          </div>

          {/* 右侧：规上企业培育 + 辖区入驻率与物业盘活 (占5列/40%) */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            
            {/* 右上：规上企业培育 (高约200px) */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold text-white">规上企业培育</h3>
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
              <div className="flex items-center justify-around py-2">
                {/* 进度环 120px */}
                <div className="relative w-[110px] h-[110px] flex items-center justify-center shrink-0">
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
                    <span className="text-lg font-black text-white font-mono">1/3家</span>
                    <span className="text-[10px] text-slate-400">已入统/目标</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="text-sm font-bold text-white">已入统 1家 / 培育中 4家</div>
                  <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>本季度新增入统 1 家</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    重点推进江宁精工智造等先进制造示范
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                <span>辅导单位：市工信局规上培育专项工作组</span>
                <span>数据出处：企业台账</span>
              </div>
            </div>

            {/* 右下：辖区入驻率与物业盘活 (高约200px) */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold text-white">辖区入驻率与物业盘活</h3>
                </div>
                <span className="text-xs text-emerald-400 font-bold">本季度新增4家，已租8,650㎡</span>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center my-1">
                <div className="col-span-5">
                  <div className="text-3xl font-black text-white font-mono">58%</div>
                  <div className="text-xs text-slate-400 mt-0.5">1月 42% → 10月 58%</div>
                  <div className="text-xs text-amber-300 font-bold mt-1">入驻企业 11家</div>
                  <div className="text-[11px] text-slate-500">物业租赁：收入归资产方</div>
                </div>

                {/* 折线图 */}
                <div className="col-span-7 h-[90px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockV2OccupancyTrend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                      <YAxis domain={[35, 65]} stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                        formatter={(val: any) => [`${val}%`, '入驻率']}
                      />
                      <Line type="monotone" dataKey="rate" stroke="#D4A843" strokeWidth={2.5} dot={{ r: 2.5, fill: '#D4A843' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                <span>盘活标的：智造科技园A/B/C栋</span>
                <span>数据出处：辖区运营台账</span>
              </div>
            </div>

          </div>
        </div>

        {/* 中下：算力资产回报路径（三条并行路径，每条一句话说明当前进展与下一节点） */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4 text-[#D4A843]" />
            <span>算力资产回报路径（闭环落地机制）</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 路径 1 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300">路径一：用量增长带动资源池结算</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">进行中</span>
              </div>
              <div className="text-xs text-slate-300">当前进展：Q3用量16,800卡时，环比+12%</div>
              <div className="text-xs text-amber-400 font-medium mt-1">下一节点：Q4冲刺年度目标54,200卡时</div>
            </div>

            {/* 路径 2 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300">路径二：招商入驻盘活物业租赁</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">突破中</span>
              </div>
              <div className="text-xs text-slate-300">当前进展：本季度新增4家，入驻率58%</div>
              <div className="text-xs text-amber-400 font-medium mt-1">下一节点：Q4目标入驻率达成65%</div>
            </div>

            {/* 路径 3 */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300">路径三：企业落地升规带来后续税源</span>
                <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">重点攻坚</span>
              </div>
              <div className="text-xs text-slate-300">当前进展：已入统1家，培育中4家</div>
              <div className="text-xs text-amber-400 font-medium mt-1">下一节点：年度目标3家企业正式入统</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-2.5 px-1 flex items-center gap-1.5">
            <span className="font-bold text-rose-400">红线说明：</span>
            <span>严格遵循财政与合规红线，不出现“还本付息”，不承诺回报总量，所有指标按客观计量台账结算。</span>
          </div>
        </div>
      </div>

      {/* 3. 二类 产业兴盛 (高度约200px，绿色装饰 #10B981) */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
        {/* 区块标题 */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-[#10B981] rounded-full shadow-sm shadow-[#10B981]/50"></div>
            <h2 className="text-base font-extrabold text-[#10B981] tracking-wide">
              二类 产业兴盛
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              产业集聚、产值相关项目、降本增效案例，每个案例可追溯到具体企业。
            </span>
          </div>
          <span className="text-xs text-slate-500">点击卡片可查看案例明细</span>
        </div>

        {/* 五个指标卡片横向等宽排列 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 卡片 1: 入驻企业 */}
          <div
            onClick={onSwitchToIndustryTab}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between h-[150px] shadow-sm"
          >
            <div>
              <span className="text-xs text-slate-400">入驻企业</span>
              <div className="text-3xl font-black text-white font-mono mt-1">11 <span className="text-sm font-normal text-slate-400">家</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-emerald-400 font-bold">本季度 +4</div>
              <div className="text-[11px] text-slate-500 text-right">出处：辖区运营台账</div>
            </div>
          </div>

          {/* 卡片 2: 赛事获奖落地注册 */}
          <div
            onClick={() => setSelectedEnterprise(mockV2ScaledEnterprises[3])}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between h-[150px] shadow-sm"
          >
            <div>
              <span className="text-xs text-slate-400">赛事获奖落地注册</span>
              <div className="text-3xl font-black text-white font-mono mt-1">3 <span className="text-sm font-normal text-slate-400">家</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-emerald-400 font-bold">本季度 +1</div>
              <div className="text-[11px] text-slate-500 text-right">出处：企业台账</div>
            </div>
          </div>

          {/* 卡片 3: 揭榜产业化项目 */}
          <div
            onClick={() => setSelectedCase(mockV2CostSavingCases[1])}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between h-[150px] shadow-sm"
          >
            <div>
              <span className="text-xs text-slate-400">揭榜产业化项目</span>
              <div className="text-3xl font-black text-white font-mono mt-1">2 <span className="text-sm font-normal text-slate-400">项</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-bold">攻坚中 —</div>
              <div className="text-[11px] text-slate-500 text-right">出处：案例台账</div>
            </div>
          </div>

          {/* 卡片 4: AI落地项目 */}
          <div
            onClick={() => setSelectedCase(mockV2CostSavingCases[0])}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between h-[150px] shadow-sm"
          >
            <div>
              <span className="text-xs text-slate-400">AI落地项目</span>
              <div className="text-3xl font-black text-white font-mono mt-1">6 <span className="text-sm font-normal text-slate-400">个</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-emerald-400 font-bold">本季度 +2</div>
              <div className="text-[11px] text-slate-500 text-right">出处：案例台账</div>
            </div>
          </div>

          {/* 卡片 5: 降本增效案例 */}
          <div
            onClick={() => setSelectedCase(mockV2CostSavingCases[2])}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between h-[150px] shadow-sm"
          >
            <div>
              <span className="text-xs text-slate-400">降本增效案例</span>
              <div className="text-3xl font-black text-white font-mono mt-1">24 <span className="text-sm font-normal text-slate-400">个</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-emerald-400 font-bold">本季度 +6</div>
              <div className="text-[11px] text-slate-500 text-right">出处：案例台账</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 三类 成果展示与影响力 (高度约260px，紫色装饰 #8B5CF6) */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
        {/* 区块标题 */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-[#8B5CF6] rounded-full shadow-sm shadow-[#8B5CF6]/50"></div>
            <h2 className="text-base font-extrabold text-[#8B5CF6] tracking-wide">
              三类 成果展示与影响力
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              赛事活动与媒体传播、人才培养数字、AI落地项目实体——考核与成果汇报的素材库。
            </span>
          </div>
          <span className="text-xs text-purple-400 font-bold">影响力成效重点展示</span>
        </div>

        {/* 三个区块横向排列 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 区块 1：赛事与传播 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">赛事与传播</h3>
              </div>
              <span className="text-xs text-purple-300 font-mono">活动矩阵</span>
            </div>

            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">本年度赛事活动</span>
                <span className="text-white font-bold">已办 4 场 · 进行中 2 场</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">主流媒体报道</span>
                <span className="text-amber-300 font-bold font-mono">23 条</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">参赛队伍规模</span>
                <span className="text-emerald-400 font-bold font-mono">168 / 200 支</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 text-right">
              数据出处：案例台账
            </div>
          </div>

          {/* 区块 2：人才培养 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">人才培养</h3>
              </div>
              <span className="text-xs text-purple-300 font-mono">技能认证</span>
            </div>

            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">实训学员结业</span>
                <span className="text-white font-bold font-mono">118 / 160 人</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">高水平技术认证</span>
                <span className="text-purple-300 font-bold font-mono">96 / 130 人</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">普惠培养人次</span>
                <span className="text-blue-400 font-bold font-mono">760 / 1,000 人次</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 text-right">
              数据出处：人才台账
            </div>
          </div>

          {/* 区块 3：AI落地项目实体 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">AI落地项目实体</h3>
              </div>
              <span className="text-xs text-purple-300 font-mono">真实赋能</span>
            </div>

            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">落地项目数</span>
                <span className="text-white font-black font-mono">6 个核心标杆</span>
              </div>
              <div className="flex items-start justify-between text-xs">
                <span className="text-slate-400 shrink-0">涵盖形态</span>
                <span className="text-slate-300 text-right">视觉检测、智能分拣、知识库问答等</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">全程真实溯源</span>
                <span className="text-emerald-400 font-bold">可溯源至企业主体与算力消耗</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 text-right">
              数据出处：案例台账
            </div>
          </div>

        </div>
      </div>

      {/* 5. 入驻辖区企业类型 (环形图，高度约280px) */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
        {/* 区块标题 */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-[#2563EB] rounded-full shadow-sm shadow-[#2563EB]/50"></div>
            <h2 className="text-base font-extrabold text-white tracking-wide">
              入驻辖区企业类型
            </h2>
          </div>
          <span className="text-xs text-emerald-400 font-bold">本季度新增 4 家</span>
        </div>

        {/* 布局：左侧环形图，右侧图例列表 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* 左侧环形图：中心总数“58家”，五色高饱和区分 */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockV2EnterpriseTypes}
                    dataKey="count"
                    nameKey="type"
                    innerRadius={55}
                    outerRadius={80}
                    stroke="#0F172A"
                    strokeWidth={3}
                  >
                    {mockV2EnterpriseTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white font-mono">58 家</span>
                <span className="text-xs text-slate-400">总入驻实体</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-2 text-center">
              深色底大屏五色饱和度区分，扇区不叠字保持清爽
            </div>
          </div>

          {/* 右侧图例列表 */}
          <div className="md:col-span-7 space-y-2.5">
            {mockV2EnterpriseTypes.map((item, index) => (
              <div
                key={index}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between hover:bg-slate-950 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-bold text-white">{item.type}</span>
                  <span className="text-xs text-slate-400 hidden sm:inline">（{item.desc}）</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base font-black text-white font-mono">{item.count} 家</span>
                  <span className="text-xs text-slate-400 font-mono w-10 text-right">{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 6. 底部口径附注 (高度约120px) */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
        <div className="font-extrabold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span>考核指标口径附注与核验说明</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div>
            <span className="font-bold text-slate-300">目标要求：</span>
            <span>三类考核指标按年度推进（用量基准 54,200 卡时，规上培育 3 家，人才结业 160 人）。</span>
          </div>
          <div>
            <span className="font-bold text-slate-300">达成路径：</span>
            <span>赛事造峰值、实训稳基线、辖区填谷段、揭榜占长周期。</span>
          </div>
          <div>
            <span className="font-bold text-slate-300">过程可查：</span>
            <span>四本台账逐条核对，详见【四本台账】页，支持导出明细报表与原件穿透。</span>
          </div>
          <div>
            <span className="font-bold text-slate-300">用量与产值：</span>
            <span>取决于本地产业基础和场景开放程度，需双方共同推进，具体数值以平台计量为准。</span>
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
