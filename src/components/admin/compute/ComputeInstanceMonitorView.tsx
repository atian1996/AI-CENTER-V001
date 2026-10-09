import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { ComputeRunningInstanceItem } from '../../../types';
import {
  Activity,
  Search,
  RefreshCw,
  PowerOff,
  RotateCcw,
  Terminal,
  Cpu,
  Flame,
  Zap,
  Server,
  X,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  User,
  Clock,
  ArrowUpRight,
  Trash2,
  Copy,
  Check,
  LayoutGrid,
  ListFilter,
  Layers,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { InstanceDetailDrawer } from './instance/InstanceDetailDrawer';

export const ComputeInstanceMonitorView: React.FC = () => {
  const {
    computeRunningInstances,
    restartComputeRunningInstance,
    stopComputeRunningInstance,
    releaseComputeRunningInstance,
    focusedComputeInstanceId,
    setFocusedComputeInstanceId,
    navigateToComputeOrder,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [healthFilter, setHealthFilter] = useState<'all' | '良好' | '高载' | '告警'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | '运行中' | '已停止'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 详情抽屉
  const [selectedInstanceForDrawer, setSelectedInstanceForDrawer] = useState<ComputeRunningInstanceItem | null>(null);

  // 响应外部页面联动聚焦
  useEffect(() => {
    if (focusedComputeInstanceId) {
      const target = computeRunningInstances.find(i => i.id === focusedComputeInstanceId || i.instanceId === focusedComputeInstanceId);
      if (target) {
        setSelectedInstanceForDrawer(target);
      }
    }
  }, [focusedComputeInstanceId, computeRunningInstances]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showToast(`已复制实例ID: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 统计概览
  const stats = useMemo(() => {
    const total = computeRunningInstances.length;
    const running = computeRunningInstances.filter(i => i.status === '运行中').length;
    const stopped = computeRunningInstances.filter(i => i.status === '已停止').length;
    
    // 高负载实例（计算率 >= 85%）
    const highLoad = computeRunningInstances.filter(i => {
      const util = i.gpuUtil ?? i.gpuUsage ?? 0;
      return i.health === '高载' || util >= 85;
    }).length;

    // 温度或降频告警实例
    const warning = computeRunningInstances.filter(i => {
      return i.health === '告警' || (i.temp ?? 0) >= 80;
    }).length;

    // 平均 GPU 利用率
    const runningInsts = computeRunningInstances.filter(i => i.status === '运行中');
    const avgGpuUtil = runningInsts.length > 0
      ? (runningInsts.reduce((acc, i) => acc + (i.gpuUtil ?? i.gpuUsage ?? 0), 0) / runningInsts.length).toFixed(1)
      : '0.0';

    return { total, running, stopped, highLoad, warning, avgGpuUtil };
  }, [computeRunningInstances]);

  // 筛选过滤
  const filteredInstances = useMemo(() => {
    return computeRunningInstances.filter(inst => {
      const search = searchTerm.trim().toLowerCase();
      const matchSearch =
        !search ||
        (inst.id || '').toLowerCase().includes(search) ||
        (inst.instanceId || '').toLowerCase().includes(search) ||
        (inst.orderId || '').toLowerCase().includes(search) ||
        (inst.userName || '').toLowerCase().includes(search) ||
        (inst.userId || '').toLowerCase().includes(search) ||
        (inst.specName || inst.gpuSpec || '').toLowerCase().includes(search) ||
        (inst.operator || '').toLowerCase().includes(search) ||
        (inst.hostNode || '').toLowerCase().includes(search);

      const currentHealth = inst.health || ((inst.gpuUtil ?? inst.gpuUsage ?? 0) >= 85 ? '高载' : '良好');
      const matchHealth = healthFilter === 'all' || currentHealth === healthFilter;
      const matchStatus = statusFilter === 'all' || inst.status === statusFilter;

      return matchSearch && matchHealth && matchStatus;
    });
  }, [computeRunningInstances, searchTerm, healthFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* 顶部运维大盘监控卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 卡片 1: 活跃与停机实例 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span>运行监控实例总数</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded text-[10px]">实时</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1.5">
              {stats.running} <span className="text-xs font-normal text-slate-400">/ {stats.total} 台活跃</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">{stats.running} 运行中</span>
              <span>·</span>
              <span className="text-slate-400">{stats.stopped} 已关机</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* 卡片 2: 平均 GPU 利用率 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span>集群平均 GPU 计算利用率</span>
              <span className="px-1.5 py-0.2 bg-cyan-500/10 text-cyan-400 rounded text-[10px]">算力吞吐</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400 mt-1.5">
              {stats.avgGpuUtil}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              基于所有运行中容器实时遥测聚合
            </div>
          </div>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* 卡片 3: 高负载训练节点 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span>高负载训练节点 (≥85%)</span>
              <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 rounded text-[10px]">满载</span>
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1.5">
              {stats.highLoad} <span className="text-xs font-normal text-slate-400">台</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              显存或算力处于高负荷训练中
            </div>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* 卡片 4: 过温与告警节点 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span>过温 / 功耗告警节点</span>
              <span className="px-1.5 py-0.2 bg-rose-500/10 text-rose-400 rounded text-[10px]">告警</span>
            </div>
            <div className="text-2xl font-bold text-rose-400 mt-1.5">
              {stats.warning} <span className="text-xs font-normal text-slate-400">台</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              核心温度 ≥80℃ 或 PCIe 错误
            </div>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 搜索与运维工具栏 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 综合搜索 */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索实例ID、关联订单、用户昵称/UID、GPU型号或宿主机节点..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* 筛选与操作组合 */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* 健康等级筛选 */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-slate-400">健康等级:</span>
              <select
                value={healthFilter}
                onChange={e => setHealthFilter(e.target.value as any)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">全部健康等级</option>
                <option value="良好" className="bg-slate-800">良好 (负载正常)</option>
                <option value="高载" className="bg-slate-800">高载 (算力跑满)</option>
                <option value="告警" className="bg-slate-800">告警 (过温/异常)</option>
              </select>
            </div>

            {/* 运行状态筛选 */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400">运行状态:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">全部状态</option>
                <option value="运行中" className="bg-slate-800">运行中</option>
                <option value="已停止" className="bg-slate-800">已关机</option>
              </select>
            </div>

            {/* 视图切换 */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="表格列表视图"
              >
                <ListFilter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'cards' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="网格卡片视图"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* 刷新遥测 */}
            <button
              onClick={() => showToast('已从宿主机集群拉取最新 GPU 遥测指标与心跳')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>刷新指标</span>
            </button>
          </div>
        </div>
      </div>

      {/* 监控主内容：表格视图 */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">实例ID / 关联订单</th>
                  <th className="py-3 px-4">租用用户</th>
                  <th className="py-3 px-4">GPU 硬件规格</th>
                  <th className="py-3 px-4">宿主机 & IP</th>
                  <th className="py-3 px-3 text-center">状态</th>
                  <th className="py-3 px-4">GPU 计算利用率</th>
                  <th className="py-3 px-4">显存 VRAM 占用</th>
                  <th className="py-3 px-3 text-center">温度 / 功耗</th>
                  <th className="py-3 px-3 text-center">健康度</th>
                  <th className="py-3 px-4">运行时长</th>
                  <th className="py-3 px-4 text-center">运维操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredInstances.length > 0 ? (
                  filteredInstances.map((instance) => {
                    const isFocused = focusedComputeInstanceId === instance.id || focusedComputeInstanceId === instance.instanceId;
                    const gpuUtil = instance.gpuUtil ?? instance.gpuUsage ?? 0;
                    const vramUtil = instance.vramUsage ?? 0;
                    const isWarn = instance.health === '告警' || (instance.temp ?? 0) >= 80;

                    return (
                      <tr
                        key={instance.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isFocused ? 'bg-cyan-950/30 border-l-4 border-l-cyan-500' : ''
                        }`}
                      >
                        {/* 1. 实例ID / 关联订单 */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedInstanceForDrawer(instance)}
                              className="font-mono text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                            >
                              {instance.instanceId || instance.id}
                            </button>
                            <button
                              onClick={() => handleCopy(instance.instanceId || instance.id, instance.id)}
                              className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
                              title="复制实例ID"
                            >
                              {copiedId === instance.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          {instance.orderId && (
                            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <span>订单:</span>
                              <button
                                onClick={() => navigateToComputeOrder(instance.orderId!)}
                                className="font-mono text-indigo-400 hover:text-indigo-300 hover:underline"
                                title="点击前往该实例对应订单"
                              >
                                {instance.orderId}
                              </button>
                            </div>
                          )}
                        </td>

                        {/* 2. 租用用户 */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={instance.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}
                              alt="avatar"
                              className="w-7 h-7 rounded-full border border-slate-700 object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-200 truncate max-w-[100px]" title={instance.userName}>
                                {instance.userName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[100px]">
                                {instance.userPhone || instance.userId}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 3. GPU 硬件规格 */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-200 flex items-center gap-1">
                            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{instance.specName || instance.gpuSpec}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {instance.gpuModel} x{instance.gpuCount || 1}
                          </div>
                        </td>

                        {/* 4. 宿主机 & IP */}
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <div className="text-slate-200">{instance.hostNode || 'node-gpu-01'}</div>
                          <div className="text-slate-400 text-[10px]">{instance.publicIp || instance.ipAddress || '10.0.1.12'}</div>
                        </td>

                        {/* 5. 状态 */}
                        <td className="py-3 px-3 text-center">
                          {instance.status === '运行中' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              运行中
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-[11px]">
                              已关机
                            </span>
                          )}
                        </td>

                        {/* 6. GPU 计算利用率 */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-between text-xs font-mono mb-1">
                            <span className={`font-bold ${gpuUtil >= 85 ? 'text-amber-400' : 'text-cyan-400'}`}>
                              {gpuUtil}%
                            </span>
                          </div>
                          <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                gpuUtil >= 85 ? 'bg-amber-500' : 'bg-cyan-500'
                              }`}
                              style={{ width: `${Math.min(100, gpuUtil)}%` }}
                            />
                          </div>
                        </td>

                        {/* 7. 显存 VRAM 占用 */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-between text-xs font-mono mb-1">
                            <span className="font-bold text-indigo-300">{vramUtil}%</span>
                            <span className="text-[10px] text-slate-400">{instance.vramUsed || '0GB'}</span>
                          </div>
                          <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 transition-all duration-300"
                              style={{ width: `${Math.min(100, vramUtil)}%` }}
                            />
                          </div>
                        </td>

                        {/* 8. 温度 / 功耗 */}
                        <td className="py-3 px-3 text-center font-mono">
                          <div className={`font-bold text-xs ${
                            (instance.temp ?? 0) >= 80 ? 'text-rose-400' :
                            (instance.temp ?? 0) >= 70 ? 'text-amber-400' :
                            'text-emerald-400'
                          }`}>
                            {instance.temp || 55}℃
                          </div>
                          <div className="text-[10px] text-slate-400">{instance.power || '120W'}</div>
                        </td>

                        {/* 9. 健康度 */}
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            instance.health === '告警' || isWarn ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            instance.health === '高载' || gpuUtil >= 85 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {instance.health || (gpuUtil >= 85 ? '高载' : '良好')}
                          </span>
                        </td>

                        {/* 10. 运行时长 */}
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                          {instance.runningDuration || instance.runningHours || '1.2h'}
                        </td>

                        {/* 11. 操作栏 */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* 详情与波形 */}
                            <button
                              onClick={() => setSelectedInstanceForDrawer(instance)}
                              className="p-1.5 bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-400 rounded-lg transition-colors"
                              title="查看实时遥测波形与日志"
                            >
                              <Activity className="w-3.5 h-3.5" />
                            </button>

                            {/* 软重启 */}
                            <button
                              onClick={() => restartComputeRunningInstance(instance.id)}
                              className="p-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-300 rounded-lg transition-colors"
                              title="软重启容器"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>

                            {/* 强制关机 */}
                            {instance.status === '运行中' && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`确定要强制停止关机实例 ${instance.instanceId || instance.id} 吗？`)) {
                                    stopComputeRunningInstance(instance.id);
                                  }
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-amber-600 hover:text-white text-amber-400 rounded-lg transition-colors"
                                title="强制关机停机"
                              >
                                <PowerOff className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* 强制释放 */}
                            <button
                              onClick={() => {
                                if (window.confirm(`确定要彻底释放销毁实例 ${instance.instanceId || instance.id} 吗？此操作将同步结清并释放关联订单！`)) {
                                  releaseComputeRunningInstance(instance.id);
                                }
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 rounded-lg transition-colors"
                              title="强制释放销毁"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="py-16 text-center text-slate-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Activity className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs">未找到符合当前筛选条件的运行中实例</p>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setHealthFilter('all');
                            setStatusFilter('all');
                          }}
                          className="text-xs text-cyan-400 hover:underline font-medium"
                        >
                          清空筛选条件
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 网格卡片视图 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInstances.map(instance => {
            const gpuUtil = instance.gpuUtil ?? instance.gpuUsage ?? 0;
            const vramUtil = instance.vramUsage ?? 0;
            const isWarn = instance.health === '告警' || (instance.temp ?? 0) >= 80;

            return (
              <div
                key={instance.id}
                onClick={() => setSelectedInstanceForDrawer(instance)}
                className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4.5 space-y-3.5 cursor-pointer transition-all shadow-md group"
              >
                {/* 卡片头部 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {instance.instanceId || instance.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      instance.status === '运行中'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {instance.status}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    isWarn ? 'bg-rose-500/20 text-rose-400' :
                    gpuUtil >= 85 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {instance.health || (gpuUtil >= 85 ? '高载' : '良好')}
                  </span>
                </div>

                {/* 硬件与用户 */}
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{instance.specName || instance.gpuSpec}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    用户: <span className="text-slate-300">{instance.userName}</span> · 节点: <span className="font-mono text-slate-300">{instance.hostNode}</span>
                  </div>
                </div>

                {/* 遥测进度条 */}
                <div className="space-y-2 pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>GPU 算力利用率</span>
                      <span className="text-cyan-400 font-bold">{gpuUtil}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, gpuUtil)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>显存 VRAM 占用</span>
                      <span className="text-indigo-300 font-bold">{vramUtil}% ({instance.vramUsed || '0GB'})</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, vramUtil)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 底部指标 */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{instance.temp || 55}℃</span>
                  </span>
                  <span>功耗: {instance.power || '120W'}</span>
                  <span>时长: {instance.runningDuration || '1.2h'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 实例监控详情抽屉 */}
      {selectedInstanceForDrawer && (
        <InstanceDetailDrawer
          instance={selectedInstanceForDrawer}
          onClose={() => {
            setSelectedInstanceForDrawer(null);
            setFocusedComputeInstanceId(null);
          }}
          onNavigateToOrder={(orderId) => {
            setSelectedInstanceForDrawer(null);
            navigateToComputeOrder(orderId);
          }}
          onRestartInstance={(id) => restartComputeRunningInstance(id)}
          onStopInstance={(id) => stopComputeRunningInstance(id)}
          onReleaseInstance={(id) => releaseComputeRunningInstance(id)}
        />
      )}
    </div>
  );
};
