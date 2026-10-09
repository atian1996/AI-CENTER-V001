import React from 'react';
import {
  Layers,
  Activity,
  Cpu,
  Coins,
  TrendingUp,
  ArrowUpRight,
  Server,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface MetricCardsProps {
  totalInstances: number;
  runningInstances: number;
  stoppedInstances?: number;
  avgGpuUtilization: number;
  monthlyRevenue: number;
  timeRangeLabel: string;
}

export const UsageMetricCards: React.FC<MetricCardsProps> = ({
  totalInstances,
  runningInstances,
  stoppedInstances = 48,
  avgGpuUtilization,
  monthlyRevenue,
  timeRangeLabel
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. 累计实例总数 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">总实例数 (累计创建)</span>
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white font-mono tracking-tight">
            {totalInstances.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-normal">个历史实例</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% 环比上月</span>
          </div>
          <span className="text-slate-500 text-[11px]">数据来源: 订单表</span>
        </div>
      </div>

      {/* 2. 实时运行中实例 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">实时运行中活跃实例</span>
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyan-400 font-mono tracking-tight">
            {runningInstances}
          </span>
          <span className="text-xs text-slate-400 font-normal">台集群挂载中</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
            <span>挂起关机: {stoppedInstances} 台</span>
          </div>
          <span className="text-slate-500 text-[11px]">数据来源: 实例监控</span>
        </div>
      </div>

      {/* 3. 全网 GPU 平均利用率 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">全网 GPU 总利用率</span>
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-400 font-mono tracking-tight">
            {avgGpuUtilization.toFixed(1)}%
          </span>
          <span className="text-xs text-emerald-400 font-medium">高效区间</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <span>告警水位阈值: 85%</span>
          </div>
          <span className="text-slate-500 text-[11px]">数据来源: 资源池同步</span>
        </div>
      </div>

      {/* 4. 本月算力总营收 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 relative overflow-hidden group hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">本月算力总营收流水</span>
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-400 font-mono tracking-tight">
            ¥{monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <span>日均: ¥{(monthlyRevenue / 30).toFixed(0)}</span>
            <span className="text-slate-600">·</span>
            <span>客单均价: ¥{(monthlyRevenue / Math.max(1, totalInstances / 6)).toFixed(0)}</span>
          </div>
          <span className="text-slate-500 text-[11px]">数据来源: 计费记录</span>
        </div>
      </div>
    </div>
  );
};
