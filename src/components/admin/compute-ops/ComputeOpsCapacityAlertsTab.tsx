import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Server,
  Activity,
  CheckCircle2,
  Clock,
  Play,
  Pause
} from 'lucide-react';
import {
  mockClusterWatermarks,
  mockDispatchSuccessTrends,
  mockActiveAlerts,
  ActiveAlertItem
} from './mockComputeOpsData';

export const ComputeOpsCapacityAlertsTab: React.FC = () => {
  // 告警列表自动滚动控制
  const [isAlertAutoScrolling, setIsAlertAutoScrolling] = useState(true);
  const [alertScrollIndex, setAlertScrollIndex] = useState(0);

  // 选中的告警项（用于展示详细排查卡片）
  const [selectedAlert, setSelectedAlert] = useState<ActiveAlertItem>(mockActiveAlerts[0]);

  // 自动滚动效果（每5秒自动向上滚动一行）
  useEffect(() => {
    if (!isAlertAutoScrolling) return;
    const timer = setInterval(() => {
      setAlertScrollIndex(prev => (prev + 1) % mockActiveAlerts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAlertAutoScrolling]);

  return (
    <div className="w-full text-slate-100 flex flex-col gap-2.5 select-none font-sans">

      {/* ========================================================
          顶部标题栏 (约 60px)
          左侧: 算力运营中心 · 算力容量告警 (标题固定)
         ======================================================== */}
      <div className="flex items-center justify-between px-1 shrink-0 h-9">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-sm shadow-amber-500" />
          <h2 className="text-base font-black text-white tracking-wide flex items-center gap-2">
            算力运营中心 · 算力容量告警
          </h2>
        </div>
      </div>

      {/* ========================================================
          第一行：五个核心指标卡片 (横向等宽排列，高度适配1920*1080大屏)
          每个卡片包含：指标名称、主数字、副标签、状态标识
         ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0 h-[135px]">
        
        {/* 卡片 1: 集群总容量 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-blue-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>集群总容量</span>
            </span>
            <span className="text-[10px] font-mono text-blue-400 font-bold">全池纳管</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">1,200</span>
              <span className="text-xs text-slate-400 font-normal ml-1">卡</span>
            </div>
            <div className="text-xs text-blue-400 font-medium mt-1">
              3个资源池
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>环比</span>
            <span className="font-mono text-slate-300 font-medium">—</span>
          </div>
        </div>

        {/* 卡片 2: 当前水位 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-amber-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>当前水位</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400 font-bold">实时感知</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-amber-300 leading-none">78.5%</span>
            </div>
            <div className="text-xs text-amber-400 font-medium mt-1 font-mono">
              已分配 942卡 / 空闲 258卡
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>状态</span>
            <span className="font-mono text-slate-300 font-medium text-amber-400">水位适中</span>
          </div>
        </div>

        {/* 卡片 3: 活跃告警数 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-rose-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>活跃告警数</span>
            </span>
            <span className="text-[10px] font-mono text-rose-400 font-bold">阈值巡检</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-rose-400 leading-none">4</span>
              <span className="text-xs text-slate-400 font-normal ml-1">条</span>
            </div>
            <div className="text-xs text-rose-300 font-medium mt-1 flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">紧急 2</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">提示 2</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>处置</span>
            <span className="font-mono text-slate-300 font-medium text-rose-400">2条紧急待处理</span>
          </div>
        </div>

        {/* 卡片 4: 实例下发成功率 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-emerald-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>实例下发成功率</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">订单闭环</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400 leading-none">99.2%</span>
            </div>
            <div className="text-xs text-emerald-400 font-medium mt-1">
              近24小时稳定交付
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>SLA考核</span>
            <span className="font-semibold text-emerald-400 font-mono">达成率 100%</span>
          </div>
        </div>

        {/* 卡片 5: 平均下发耗时 */}
        <div className="group p-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-indigo-500/10 min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>平均下发耗时</span>
            </span>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">秒级调度</span>
          </div>
          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-indigo-300 leading-none">28</span>
              <span className="text-xs text-slate-400 font-normal ml-1">秒</span>
            </div>
            <div className="text-xs text-indigo-400 font-medium mt-1">
              近24小时均值
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>基准线</span>
            <span className="font-semibold text-indigo-300 font-mono">标杆 &lt; 30s</span>
          </div>
        </div>

      </div>

      {/* ========================================================
          第二行：左侧：集群容量水位；右侧：实例下发成功率 - 高度适配 415px
         ======================================================== */}
      <div className="grid grid-cols-12 gap-3 shrink-0 h-[415px]">
        
        {/* 左侧：集群容量水位（横向堆叠柱状图，占7列） */}
        <div className="col-span-12 lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="text-xs font-black text-white tracking-wide">
                  集群容量水位
                </h3>
                <span className="text-[10px] text-slate-400">（横向堆叠：已分配卡数 vs 空闲卡数）</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-500" />
                  <span className="text-slate-300 text-[11px]">已分配卡数</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-slate-800 border border-slate-700" />
                  <span className="text-slate-400 text-[11px]">空闲卡数</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3大资源池 横向堆叠柱条 */}
          <div className="space-y-3.5 my-auto">
            {mockClusterWatermarks.map((pool, idx) => {
              const allocatedPct = (pool.allocatedCards / pool.totalCards) * 100;
              const freePct = 100 - allocatedPct;
              
              // 按照规范配色
              const watermarkColor = pool.watermarkRate > 85 
                ? 'from-rose-600 to-rose-500' 
                : pool.watermarkRate >= 70 
                ? 'from-amber-600 to-amber-500' 
                : 'from-emerald-600 to-emerald-500';

              const statusBadge = pool.watermarkRate > 85 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                : pool.watermarkRate >= 70 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

              return (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{pool.poolName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge}`}>
                        水位 {pool.watermarkRate}% · {pool.watermarkRate > 85 ? '告警' : pool.watermarkRate >= 70 ? '注意' : '健康'}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-300">
                      <span className="text-blue-400 font-bold">{pool.allocatedCards}</span> / 
                      <span className="text-slate-400"> {pool.totalCards} 卡</span>
                      <span className="text-slate-500 ml-2">（空闲 {pool.freeCards} 卡）</span>
                    </div>
                  </div>

                  {/* 进度条与安全红线 */}
                  <div className="relative w-full h-5 rounded-lg bg-slate-900 p-0.5 flex overflow-hidden border border-slate-800">
                    {/* 已分配部分 */}
                    <div
                      style={{ width: `${allocatedPct}%` }}
                      className={`h-full rounded-l-md transition-all duration-700 flex items-center justify-center text-[10px] font-mono font-bold text-white bg-gradient-to-r ${watermarkColor}`}
                    >
                      {allocatedPct.toFixed(1)}%
                    </div>
                    {/* 空闲部分 */}
                    <div
                      style={{ width: `${freePct}%` }}
                      className="h-full bg-slate-950/80 rounded-r-md flex items-center justify-center text-[9px] font-mono text-slate-500"
                    >
                      空闲 {pool.freeCards}卡
                    </div>

                    {/* 70% 注意警戒虚线标记 */}
                    <div
                      className="absolute top-0 bottom-0 w-[1.5px] bg-amber-400/80 z-10 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                      style={{ left: '70%' }}
                      title="70% 注意预警水位线"
                    />
                    {/* 85% 告警紧急虚线标记 */}
                    <div
                      className="absolute top-0 bottom-0 w-[1.5px] bg-rose-500/90 z-10 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                      style={{ left: '85%' }}
                      title="85% 告警阻断线"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部指标提示 */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              绿色 &lt;70%
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-2" />
              橙色 70%-85%
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 ml-2" />
              红色 &gt;85%告警
            </span>
            <span className="text-slate-500 font-mono">采集周期：30秒实时同步</span>
          </div>
        </div>

        {/* 右侧：实例下发成功率趋势（折线图，占5列） */}
        <div className="col-span-12 lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-black text-white tracking-wide">实例下发成功率</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300 text-[11px]">● 下发成功率</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              展示近7天（2026-10-06 — 2026-10-12）实例下发的成功率变化
            </p>
          </div>

          {/* 折线图与柱状图区域 */}
          <div className="h-[210px] w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {mockDispatchSuccessTrends.map((slot, idx) => {
              const barHeightPct = Math.min(100, Math.max(20, (slot.totalDispatches / 500) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  {/* 悬停成功率数值 */}
                  <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1 opacity-90 group-hover:scale-110 transition">
                    {slot.successRate}%
                  </div>

                  {/* 柱状主体 */}
                  <div className="w-full max-w-[36px] bg-slate-950/80 rounded-t-lg p-1 flex flex-col justify-end h-full border-t border-x border-slate-800">
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className="w-full bg-gradient-to-t from-emerald-600/70 to-emerald-400 rounded-md transition-all duration-500 group-hover:brightness-125 flex flex-col justify-between items-center py-1"
                    >
                      <span className="text-[9px] font-mono text-white/90 font-semibold">{slot.avgLatencySeconds}s</span>
                    </div>
                  </div>

                  {/* X轴时间 */}
                  <span className="text-[10px] font-medium text-slate-400 mt-2 truncate w-full text-center">
                    {slot.timeSlot.split('-')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 底部摘要 */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              近7天累计下发 <strong className="text-white font-mono">362</strong> 批次
            </span>
            <span className="text-emerald-400 font-bold font-mono">
              综合成功率 99.2% (平均28秒)
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================
          第三行：当前告警列表（自动滚动，高度适配 305px）
          字段：级别、告警内容、资源池、触发时间、状态
         ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between shrink-0 h-[305px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-xs font-black text-white tracking-wide flex items-center gap-2">
              当前告警列表
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-bold">
                {mockActiveAlerts.length} 项记录
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAlertAutoScrolling(!isAlertAutoScrolling)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              {isAlertAutoScrolling ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isAlertAutoScrolling ? '暂停滚动' : '自动滚动'}</span>
            </button>
          </div>
        </div>

        {/* 规范表格形式展示告警逐条记录，支持高亮与自动轮播聚焦 */}
        <div className="overflow-x-auto my-auto max-h-[185px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-2 px-3 w-24">级别</th>
                <th className="py-2 px-3">告警内容</th>
                <th className="py-2 px-3 w-40">资源池</th>
                <th className="py-2 px-3 w-32">触发时间</th>
                <th className="py-2 px-3 w-28">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {mockActiveAlerts.map((alert, idx) => {
                const isSelected = selectedAlert.id === alert.id;
                const isScrolledCurrent = idx === alertScrollIndex;
                const isCritical = alert.level === '紧急';

                return (
                  <tr
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950/30 font-medium'
                        : isScrolledCurrent
                        ? 'bg-slate-800/60 font-medium'
                        : 'hover:bg-slate-950/60'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}>
                        {isCritical ? '🔴 紧急' : '🟠 提示'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-white font-semibold text-xs mb-0.5">{alert.title}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-lg">{alert.description}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-medium text-xs">
                      {alert.poolName}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      10-12 {String(9 - idx).padStart(2, '0')}:{String(15 * (idx + 1)).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        idx < 2
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : idx === 2
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {idx < 2 ? '待处理' : idx === 2 ? '处理中' : '已处理'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
