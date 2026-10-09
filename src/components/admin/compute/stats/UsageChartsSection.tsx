import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Users,
  CreditCard,
  Building2,
  HelpCircle
} from 'lucide-react';
import { ComputeStatsData } from '../../../../types';

interface UsageChartsSectionProps {
  stats: ComputeStatsData;
  timeRange: 'day' | 'week' | 'month' | 'quarter';
}

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
const BILLING_COLORS = {
  pay_as_you_go: '#06b6d4',
  daily: '#6366f1',
  weekly: '#8b5cf6',
  monthly: '#10b981'
};

export const UsageChartsSection: React.FC<UsageChartsSectionProps> = ({ stats, timeRange }) => {
  const [activeTrendLine, setActiveTrendLine] = useState<'all' | '4090' | 'A100'>('all');

  // 格式化利用率走势数据
  const utilizationChartData = stats.utilizationTrends.map(item => ({
    time: item.time,
    rate: item.rate,
    rtx4090: Math.min(98, Math.round(item.rate * 1.08)),
    a100: Math.max(35, Math.round(item.rate * 0.92))
  }));

  // 实例趋势图数据
  const instanceChartData = stats.instanceTrends.map(item => ({
    date: item.date.slice(5),
    fullDate: item.date,
    createdCount: item.createdCount,
    activeCount: item.activeCount,
    newOrders: Math.round(item.createdCount * 1.15)
  }));

  // GPU 规格分布数据
  const specPieData = stats.specDistribution.map(item => ({
    name: item.specName,
    value: item.count,
    percentage: item.percentage
  }));

  // 计费方式分布数据
  const billingPieData = stats.billingTypeDistribution ? [
    { name: '按量付费 (每秒计费)', value: stats.billingTypeDistribution.pay_as_you_go, color: BILLING_COLORS.pay_as_you_go },
    { name: '包日套餐 (按天预付)', value: stats.billingTypeDistribution.daily, color: BILLING_COLORS.daily },
    { name: '包周套餐 (按周优惠)', value: stats.billingTypeDistribution.weekly, color: BILLING_COLORS.weekly },
    { name: '包月套餐 (长期算力)', value: stats.billingTypeDistribution.monthly, color: BILLING_COLORS.monthly }
  ] : [
    { name: '按量付费', value: 48, color: '#06b6d4' },
    { name: '包日套餐', value: 24, color: '#6366f1' },
    { name: '包周套餐', value: 16, color: '#8b5cf6' },
    { name: '包月套餐', value: 12, color: '#10b981' }
  ];

  // 用户排行榜 Top 6 数据
  const topUsersData = stats.topUsers.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* 顶部主图表：GPU利用率走势 + 实例创建与活跃趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. GPU利用率走势图 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>GPU 利用率历史走势</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                实时负载走势曲线，支持多型号规格下钻 (5分钟采样点)
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setActiveTrendLine('all')}
                className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                  activeTrendLine === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                全网综合
              </button>
              <button
                onClick={() => setActiveTrendLine('4090')}
                className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                  activeTrendLine === '4090' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                RTX 4090
              </button>
              <button
                onClick={() => setActiveTrendLine('A100')}
                className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                  activeTrendLine === 'A100' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                A100
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="utilizationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="rtx4090Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickFormatter={v => `${v}%`} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                  formatter={(value: any, name: any) => [
                    `${value}%`,
                    name === 'rate' ? '全网平均利用率' : name === 'rtx4090' ? 'RTX 4090 利用率' : 'A100 利用率'
                  ]}
                />
                {(activeTrendLine === 'all' || activeTrendLine === '4090') && (
                  <Area
                    type="monotone"
                    dataKey={activeTrendLine === '4090' ? 'rtx4090' : 'rate'}
                    stroke={activeTrendLine === '4090' ? '#818cf8' : '#22d3ee'}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={activeTrendLine === '4090' ? 'url(#rtx4090Grad)' : 'url(#utilizationGrad)'}
                  />
                )}
                {activeTrendLine === 'A100' && (
                  <Area
                    type="monotone"
                    dataKey="a100"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#utilizationGrad)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. 实例创建与活跃趋势图 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>实例创建与活跃数量趋势</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                每日新增创建实例数与集群活跃实例水位
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">近 7 天数据</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                  formatter={(value: any, name: any) => [
                    `${value} 台`,
                    name === 'createdCount' ? '当日新建实例' : name === 'activeCount' ? '峰值活跃实例' : '新增订单'
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => (value === 'createdCount' ? '当日新建实例' : value === 'activeCount' ? '峰值活跃实例' : value)}
                />
                <Bar dataKey="createdCount" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Line type="monotone" dataKey="activeCount" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 次级图表：规格分布环形图 + 计费模式比例 + 用户消费 Top6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 3. GPU 规格占有率 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                <span>GPU 规格占有率分布</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">全网各 GPU 芯片型号实例占比</p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={specPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {specPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                    formatter={(value: any, name: any, item: any) => [`${value} 台 (${item.payload.percentage}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs font-mono">
            {specPieData.map((spec, i) => (
              <div key={spec.name} className="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800/80">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-300 font-sans text-[11px] truncate">{spec.name}</span>
                </div>
                <span className="text-slate-400 text-[11px]">{spec.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 计费模式占比 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span>计费模式营收与实例构成</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">按量付费与包周期套餐的订单结构</p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={billingPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {billingPieData.map((entry, index) => (
                      <Cell key={`billing-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                    formatter={(value: any, name: any) => [`${value}% 份额`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs">
            {billingPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 text-[11px]">{item.name}</span>
                </div>
                <span className="font-mono text-white text-[11px] font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 用户用量消耗 Top 6 排行 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>用户算力消费 Top 榜</span>
              </h3>
              <span className="text-[10px] text-amber-400 font-medium px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                头部活跃
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">按累计消费流水与租赁总时长排序</p>

            <div className="space-y-2">
              {topUsersData.map((user, idx) => (
                <div
                  key={user.userId}
                  className="p-2 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-between gap-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                      idx === 0 ? 'bg-amber-500 text-slate-950' :
                      idx === 1 ? 'bg-slate-300 text-slate-950' :
                      idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 truncate">{user.userName}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{user.userId} · {user.instanceCount}台实例</div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-emerald-400 font-mono">
                      ¥{user.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {user.totalHours.toLocaleString()} 卡时
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>支持在下方表格查看全量用户明细</span>
          </div>
        </div>
      </div>
    </div>
  );
};
