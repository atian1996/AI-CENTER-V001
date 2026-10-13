import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  Bot,
  Sparkles,
  Database,
  Server,
  Network
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  mock12MonthGrowthTrends,
  mock6MonthStackedCompute,
  mockCaseSourceDistribution,
  mockPlatformCapabilities,
  EcoCaseItem
} from './mockEcoData';
import { DrilldownType } from './EcoFourLedgerDrilldownModal';

interface EcoOverviewTabProps {
  onOpenDrilldown: (type: DrilldownType) => void;
  onSelectCase?: (caseItem: EcoCaseItem) => void;
}

export const EcoOverviewTab: React.FC<EcoOverviewTabProps> = ({
  onOpenDrilldown
}) => {
  // 5 个能力项图标映射
  const getCapabilityIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Bot className="w-4 h-4 text-cyan-400" />;
      case 2:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 3:
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 4:
        return <Server className="w-4 h-4 text-purple-400" />;
      case 5:
        return <Network className="w-4 h-4 text-amber-400" />;
      default:
        return <Bot className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getCapabilityBg = (id: number) => {
    switch (id) {
      case 1:
        return 'bg-cyan-500/10 border-cyan-500/20';
      case 2:
        return 'bg-indigo-500/10 border-indigo-500/20';
      case 3:
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 4:
        return 'bg-purple-500/10 border-purple-500/20';
      case 5:
        return 'bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="w-full text-slate-100 flex flex-col gap-2.5 select-none">
      
      {/* 顶部标题与账期 */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-black text-white tracking-wide">
            AI生态看板 · 平台运营总览
          </h2>
        </div>
        <div className="text-xs font-mono font-bold text-slate-300 bg-slate-900/90 px-3.5 py-1 rounded-xl border border-slate-800 shadow-sm">
          2026年10月12日
        </div>
      </div>

      {/* 六个核心指标卡片 (1行6列，高度适配1920*1080大屏，高度更饱满) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 shrink-0 h-[135px]">
        
        {/* 指标卡 1：活跃用户 */}
        <div
          onClick={() => onOpenDrilldown('users')}
          className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-blue-500/10 h-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">活跃用户</span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              ↑12% 年内
            </span>
          </div>

          <div className="my-1">
            <div className="text-3xl font-bold font-mono text-white tracking-tight leading-none">
              8,240
            </div>
            <div className="text-[11px] text-blue-400/80 font-medium mt-1">
              平台核心开发主体
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>注册 <strong className="font-mono text-slate-200">12,580</strong></span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>

        {/* 指标卡 2：认证企业 */}
        <div
          onClick={() => onOpenDrilldown('enterprises')}
          className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-amber-500/10 h-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">认证企业</span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              ↑8% 年内
            </span>
          </div>

          <div className="my-1">
            <div className="text-3xl font-bold font-mono text-white tracking-tight leading-none">
              356
            </div>
            <div className="text-[11px] text-amber-400/80 font-medium mt-1">
              产业数字化领航企业
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span>发任务 <strong className="font-mono text-slate-200">89</strong></span>
              <span>实训 <strong className="font-mono text-slate-200">42</strong></span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>

        {/* 指标卡 3：累计案例 */}
        <div
          onClick={() => onOpenDrilldown('cases')}
          className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-emerald-500/10 h-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">累计案例</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
              硬核成果
            </span>
          </div>

          <div className="my-1">
            <div className="text-3xl font-bold font-mono text-white tracking-tight leading-none">
              128
            </div>
            <div className="text-[11px] text-emerald-400/80 font-medium mt-1">
              重点产业垂直转化
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-[10.5px]">
              <span>赛事 <strong className="font-mono text-slate-200">67</strong></span>
              <span>实训 <strong className="font-mono text-slate-200">38</strong></span>
              <span>实验场 <strong className="font-mono text-slate-200">23</strong></span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>

        {/* 指标卡 4：人才总数 */}
        <div
          onClick={() => onOpenDrilldown('talents')}
          className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-purple-500/10 h-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">人才总数</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
              技能沉淀
            </span>
          </div>

          <div className="my-1">
            <div className="text-3xl font-bold font-mono text-white tracking-tight leading-none">
              520
            </div>
            <div className="text-[11px] text-purple-400/80 font-medium mt-1">
              AI高级应用工程专家
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-[10.5px]">
              <span>结业 <strong className="font-mono text-slate-200">320</strong></span>
              <span>认证 <strong className="font-mono text-slate-200">156</strong></span>
              <span>讲师 <strong className="font-mono text-slate-200">44</strong></span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>

        {/* 指标卡 5：累计任务 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl flex flex-col justify-between shadow-md transition-all duration-200 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">累计任务</span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              ↑15% 年内
            </span>
          </div>

          <div className="my-1">
            <div className="text-3xl font-bold font-mono text-white tracking-tight leading-none">
              1,234
            </div>
            <div className="text-[11px] text-cyan-400/80 font-medium mt-1">
              企业算法场景需求
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span>进行中 <strong className="font-mono text-slate-200">89</strong></span>
              <span>已完成 <strong className="font-mono text-slate-200">1,145</strong></span>
            </div>
          </div>
        </div>

        {/* 指标卡 6：算力总消耗 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl flex flex-col justify-between shadow-md transition-all duration-200 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">算力总消耗</span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              ↑18% 年内
            </span>
          </div>

          <div className="my-1">
            <div className="text-3xl font-bold font-mono text-white tracking-tight leading-none flex items-baseline gap-1.5">
              12,580 <span className="text-xs text-slate-400 font-normal ml-1">卡时</span>
            </div>
            <div className="text-[11px] text-indigo-400/80 font-medium mt-1">
              五大业务线智算保障
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Token <strong className="font-mono text-cyan-300">2.3亿</strong></span>
            <span className="text-[10px] font-mono text-slate-500">GPU算力消纳</span>
          </div>
        </div>

      </div>

      {/* 图表区域 第一行：一、平台主体培育趋势 (双折线图) ＋ 二、算力资源调度与使用结构 (堆叠柱状图) - 高度约390px */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 shrink-0 h-[390px]">
        
        {/* 一、平台主体培育趋势（双折线图） */}
        <div className="lg:col-span-7 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md h-full">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500" />
                <h3 className="text-sm font-black text-white">平台主体培育趋势</h3>
                <span className="text-xs text-slate-400 font-sans">近12个月连续增长趋势</span>
              </div>
            </div>

            {/* 图例与最新值固定展示 */}
            <div className="flex items-center gap-4 text-xs font-mono font-bold">
              <div className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>● 活跃用户</span>
                <span className="text-xs bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-300 font-bold">8,240</span>
              </div>
              <div className="flex items-center gap-1.5 text-orange-400">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>● 认证企业</span>
                <span className="text-xs bg-orange-500/20 px-1.5 py-0.5 rounded text-orange-300 font-bold">356</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full pt-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mock12MonthGrowthTrends} margin={{ top: 12, right: 24, left: 0, bottom: 4 }}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  yAxisId="left"
                  stroke="#3b82f6"
                  fontSize={11}
                  tickLine={false}
                  domain={[4000, 9000]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#f97316"
                  fontSize={11}
                  tickLine={false}
                  domain={[150, 400]}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="activeUsers"
                  name="活跃用户数"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: '#3b82f6' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="enterprises"
                  name="认证企业数"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: '#f97316' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span className="font-mono text-slate-400">近10个月累计规模趋势</span>
            <span className="text-emerald-400 font-medium">连续稳步增长</span>
          </div>
        </div>

        {/* 二、算力资源调度与使用结构（堆叠柱状图） */}
        <div className="lg:col-span-5 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md h-full">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
              <h3 className="text-sm font-black text-white">算力资源调度与使用结构</h3>
            </div>

            {/* 图例 */}
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold">
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2 h-2 rounded-xs bg-[#2563eb]" />
                赛事
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-xs bg-[#10b981]" />
                实训
              </span>
              <span className="flex items-center gap-1 text-purple-400">
                <span className="w-2 h-2 rounded-xs bg-[#8b5cf6]" />
                实验场
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-xs bg-[#06b6d4]" />
                模型调用
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-xs bg-[#f59e0b]" />
                Agent调用
              </span>
            </div>
          </div>

          <div className="flex-1 w-full pt-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mock6MonthStackedCompute} margin={{ top: 12, right: 12, left: -10, bottom: 4 }}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="competition" stackId="a" fill="#2563eb" name="赛事" radius={[0, 0, 0, 0]} />
                <Bar dataKey="training" stackId="a" fill="#10b981" name="实训" radius={[0, 0, 0, 0]} />
                <Bar dataKey="sandbox" stackId="a" fill="#8b5cf6" name="实验场" radius={[0, 0, 0, 0]} />
                <Bar dataKey="modelCall" stackId="a" fill="#06b6d4" name="模型调用" radius={[0, 0, 0, 0]} />
                <Bar dataKey="agentCall" stackId="a" fill="#f59e0b" name="Agent调用" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 底部汇总栏 */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
              <span>总调度量：<strong className="text-emerald-400">12,580</strong> 卡时</span>
              <span className="text-slate-600">｜</span>
              <span>日均调度：<strong className="text-cyan-400">420</strong> 卡时/天</span>
              <span className="text-slate-600">｜</span>
              <span>Token调用：<strong className="text-purple-400">2.3亿</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* 图表区域 第二行：三、产业成果来源结构 (环形图) ＋ 四、平台能力建设成效 (数字卡片列表) - 高度约390px */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 shrink-0 h-[390px]">
        
        {/* 三、产业成果来源结构（环形图/甜甜圈图） */}
        <div className="lg:col-span-6 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md h-full">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
              <h3 className="text-sm font-black text-white">产业成果来源结构</h3>
            </div>
            <span className="text-xs text-slate-400">
              多元渠道构成比例
            </span>
          </div>

          <div className="flex items-center gap-6 py-2 flex-1 min-h-0">
            {/* 环形图（甜甜圈图） */}
            <div className="w-48 h-48 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockCaseSourceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={76}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {mockCaseSourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* 中心文字：累计成果 128 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 font-sans leading-tight">累计成果</span>
                <span className="text-2xl font-black font-mono text-white leading-none mt-1">128</span>
              </div>
            </div>

            {/* 示例数据表与占比展示 */}
            <div className="flex-1 space-y-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/80 text-xs">
                    <th className="text-left pb-2 font-semibold">来源业务线</th>
                    <th className="text-right pb-2 font-semibold font-mono">数量</th>
                    <th className="text-right pb-2 font-semibold font-mono">占比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono">
                  {mockCaseSourceDistribution.map(item => (
                    <tr key={item.name} className="text-slate-300">
                      <td className="py-2.5 flex items-center gap-2 font-sans font-medium text-white">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-2.5 text-right text-slate-100 font-bold">{item.count}</td>
                      <td className="py-2.5 text-right font-bold" style={{ color: item.color }}>{item.percentage}%</td>
                    </tr>
                  ))}
                  <tr className="text-white font-bold border-t-2 border-slate-800 text-xs">
                    <td className="pt-2 font-sans text-amber-300">合计</td>
                    <td className="pt-2 text-right font-mono text-amber-300">128</td>
                    <td className="pt-2 text-right font-mono text-slate-200">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span>赋能本地主导产业场景创新</span>
            <span className="text-slate-400 font-mono">核定成果 128 项</span>
          </div>
        </div>

        {/* 四、平台能力建设成效（数字卡片列表 5 项） */}
        <div className="lg:col-span-6 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md h-full">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
              <h3 className="text-sm font-black text-white">平台能力建设成效</h3>
            </div>
            <span className="text-xs text-slate-400">
              已建成核心能力 · 产业基础支撑
            </span>
          </div>

          {/* 5 项数字卡片列表 */}
          <div className="grid grid-cols-5 gap-2.5 py-2 flex-1 min-h-0 items-center">
            {mockPlatformCapabilities.map(item => (
              <div
                key={item.id}
                className="p-3 bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-xl flex flex-col justify-between h-[280px] transition shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${getCapabilityBg(item.id)}`}>
                    {getCapabilityIcon(item.id)}
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-bold">0{item.id}</span>
                </div>

                <div className="my-auto">
                  <div className="text-xs font-bold text-slate-300 leading-snug">
                    {item.name}
                  </div>
                  <div className="text-2xl font-black font-mono text-white mt-2 leading-none">
                    {item.count}<span className="text-xs font-sans text-slate-400 font-normal ml-1">{item.unit}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 text-[10px] text-emerald-400 font-medium truncate">
                  运行服务中
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span>涵盖智能体、大模型、数据集与算力基础设施</span>
            <span className="text-cyan-400 font-mono font-bold">全流程要素汇聚</span>
          </div>
        </div>

      </div>

    </div>
  );
};
