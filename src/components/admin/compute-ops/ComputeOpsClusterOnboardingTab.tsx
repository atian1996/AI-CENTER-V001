import React, { useState } from 'react';
import {
  Server,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  Network
} from 'lucide-react';
import {
  mockManagedClusters,
  mockOnboardingMilestones,
  mockClusterIntegrationLogs,
  ManagedClusterOverview
} from './mockComputeOpsData';

export const ComputeOpsClusterOnboardingTab: React.FC = () => {
  // 当前选中的集群（用于高亮查看阶段与架构详情）
  const [selectedCluster, setSelectedCluster] = useState<ManagedClusterOverview>(mockManagedClusters[0]);

  // 核心统计计算
  const totalPlannedCards = mockManagedClusters.reduce((acc, c) => acc + c.plannedCards, 0);
  const totalActualCards = mockManagedClusters.reduce((acc, c) => acc + c.actualIntegratedCards, 0);
  const overallRate = ((totalActualCards / totalPlannedCards) * 100).toFixed(1);
  const fullyIntegratedCount = mockManagedClusters.filter(c => c.status === '纳管完成').length;

  return (
    <div className="w-full text-slate-100 flex flex-col gap-2.5 select-none font-sans">

      {/* ========================================================
          顶部标题栏 (约 60px)
          左侧: 算力运营中心 · 算力纳管进度 (标题固定)
         ======================================================== */}
      <div className="flex items-center justify-between px-1 shrink-0 h-9">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-sm shadow-purple-500" />
          <h2 className="text-base font-black text-white tracking-wide flex items-center gap-2">
            算力运营中心 · 算力纳管进度
          </h2>
        </div>
      </div>

      {/* ========================================================
          第一行：五个核心指标卡片 (横向等宽排列，高度适配1920*1080)
         ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0 h-[135px]">
        
        {/* 卡片 1: 目标纳管规模 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-blue-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>目标纳管规模</span>
            </span>
            <span className="text-[10px] font-mono text-blue-400 font-bold">统筹规划</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">
                {totalPlannedCards.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-normal ml-1">卡</span>
            </div>
            <div className="text-xs text-blue-400 font-medium mt-1">
              规划纳管 6个重点集群
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>推进目标</span>
            <span className="font-mono text-slate-300 font-medium text-blue-400">按计划执行</span>
          </div>
        </div>

        {/* 卡片 2: 已接入就绪卡数 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-emerald-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>已接入就绪卡数</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">接入就绪</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400 leading-none">
                {totalActualCards.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-normal ml-1">卡</span>
            </div>
            <div className="text-xs text-emerald-300 font-medium mt-1">
              达成率 {overallRate}%
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>并网就绪</span>
            <span className="font-mono text-slate-300 font-medium text-emerald-400">高可用入网</span>
          </div>
        </div>

        {/* 卡片 3: 全流程就绪集群 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-purple-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>全流程就绪集群</span>
            </span>
            <span className="text-[10px] font-mono text-purple-400 font-bold">集群纳管</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-purple-300 leading-none">
                {fullyIntegratedCount}
              </span>
              <span className="text-xs text-slate-400 font-normal ml-1">/ 6 个</span>
            </div>
            <div className="text-xs text-purple-300 font-medium mt-1">
              2个在途联调接入中
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>完成度</span>
            <span className="font-mono text-purple-300 font-medium">66.7%</span>
          </div>
        </div>

        {/* 卡片 4: 兼容异构架构 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-amber-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>兼容异构架构</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">驱动抽象</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-amber-300 leading-none">
                4
              </span>
              <span className="text-xs text-slate-400 font-normal ml-1">类</span>
            </div>
            <div className="text-xs text-amber-300 font-medium mt-1 truncate">
              昇腾910B / NVIDIA / 海光 / 寒武纪
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>生态兼容</span>
            <span className="font-mono text-amber-300 font-medium">主流国产化</span>
          </div>
        </div>

        {/* 卡片 5: 云网专线平均延迟 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-cyan-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>云网专线平均延迟</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">SDN拨测</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-cyan-300 leading-none">
                2.4
              </span>
              <span className="text-xs text-slate-400 font-normal ml-1">ms</span>
            </div>
            <div className="text-xs text-cyan-400 font-medium mt-1">
              南京同城低于3ms可靠网络
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>丢包率</span>
            <span className="font-semibold text-cyan-300 font-mono">0.00%</span>
          </div>
        </div>

      </div>

      {/* ========================================================
          第二行：左侧：纳管集群进展看板；右侧：纳管五阶段里程碑（高度适配 440px）
         ======================================================== */}
      <div className="grid grid-cols-12 gap-3 shrink-0 h-[440px]">
        
        {/* 左侧：纳管集群进展列表（占7列） */}
        <div className="col-span-12 lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <h3 className="text-xs font-black text-white tracking-wide">
                  纳管集群进展一览
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">共 6 个算力节点</span>
            </div>
          </div>

          {/* 集群卡片展示列表 */}
          <div className="space-y-2.5 my-auto max-h-[300px] overflow-y-auto pr-1">
            {mockManagedClusters.map(cluster => {
              const isSelected = selectedCluster.clusterName === cluster.clusterName;
              const isDone = cluster.status === '纳管完成';

              return (
                <div
                  key={cluster.clusterName}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`p-3 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-purple-950/30 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{cluster.clusterName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">[{cluster.architecture}]</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}>
                        {cluster.stage} · {cluster.progressPercentage}%
                      </span>
                    </div>

                    <div className="font-mono text-xs text-slate-300">
                      <strong className="text-purple-300 font-bold">{cluster.actualIntegratedCards}</strong> / {cluster.plannedCards} 卡
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex border border-slate-800">
                    <div
                      style={{ width: `${cluster.progressPercentage}%` }}
                      className={`h-full rounded-full transition-all duration-700 ${
                        isDone
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-purple-500 to-amber-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧：五大纳管阶段里程碑（占5列） */}
        <div className="col-span-12 lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h3 className="text-xs font-black text-white tracking-wide">五阶纳管标准化里程碑</h3>
              </div>
            </div>
          </div>

          {/* 5个阶段里程碑垂直步进条 */}
          <div className="space-y-2.5 my-auto">
            {mockOnboardingMilestones.map((ms, idx) => {
              const isReady = ms.status === '已就绪';

              return (
                <div key={ms.code} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      style={{ backgroundColor: `${ms.color}20`, borderColor: `${ms.color}50`, color: ms.color }}
                      className="w-6 h-6 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shrink-0"
                    >
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{ms.phaseName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({ms.code})</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
                        {ms.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-white">
                      {ms.completedClusters} <span className="text-slate-500 text-[10px]">/ {ms.totalClusters}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isReady
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    }`}>
                      {ms.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================
          第三行：纳管实时联调与验收审计日志（高度适配 370px）
         ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between shrink-0 h-[370px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h3 className="text-xs font-black text-white tracking-wide flex items-center gap-2">
              集群并网联调与验收审计日志
            </h3>
          </div>
        </div>

        {/* 表格区 */}
        <div className="overflow-x-auto my-auto max-h-[260px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-2 px-3">日志编号</th>
                <th className="py-2 px-3">集群名称</th>
                <th className="py-2 px-3">验收环节</th>
                <th className="py-2 px-3">联调与验证内容</th>
                <th className="py-2 px-3">验收结果</th>
                <th className="py-2 px-3">记录时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {mockClusterIntegrationLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-950/60 transition">
                  <td className="py-2.5 px-3 font-mono text-purple-300 font-bold">{log.id}</td>
                  <td className="py-2.5 px-3 font-bold text-white text-xs">{log.clusterName}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-bold">
                      {log.eventType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-md truncate text-xs" title={log.content}>
                    {log.content}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.result}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 底部摘要 */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            已通过自动化验收用例 <strong className="text-white font-mono">148 / 148</strong> 项
          </span>
        </div>
      </div>

    </div>
  );
};
