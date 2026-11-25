import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GPUInstance } from '../../types';
import { 
  Cpu, 
  Search, 
  Play, 
  Square, 
  RotateCw, 
  Trash2, 
  ExternalLink, 
  Clock, 
  HardDrive, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Plus, 
  ChevronRight, 
  DollarSign, 
  Terminal, 
  Layers, 
  Copy, 
  Sliders, 
  Activity,
  Edit2,
  Check
} from 'lucide-react';

export const WorkspaceCompute: React.FC = () => {
  const { 
    gpuInstances, 
    toggleGpuInstanceStatus, 
    restartGpuInstance, 
    deleteGpuInstance,
    updateInstanceRemark,
    setActiveTab, 
    showToast 
  } = useApp();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [specFilter, setSpecFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [detailInstance, setDetailInstance] = useState<GPUInstance | null>(null);
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [tempRemark, setTempRemark] = useState<string>('');

  // Statistics calculation
  const runningCount = gpuInstances.filter(i => i.status === 'running').length;
  const stoppedCount = gpuInstances.filter(i => i.status === 'stopped').length;
  
  // Total cost this month (simulated sum of hourlyCost * 24 * active days or totalCost)
  const totalCostMonth = gpuInstances.reduce((acc, curr) => {
    return acc + (curr.totalCost || (curr.hourlyCost * 12));
  }, 0);

  // Filtered list
  const filteredInstances = gpuInstances.filter((inst) => {
    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'running' && inst.status !== 'running') return false;
      if (statusFilter === 'stopped' && inst.status !== 'stopped') return false;
      if (statusFilter === 'other' && inst.status === 'running') return false;
    }

    // Spec filter
    if (specFilter !== 'all') {
      if (!inst.gpuModel.toLowerCase().includes(specFilter.toLowerCase())) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        inst.name.toLowerCase().includes(q) ||
        inst.gpuModel.toLowerCase().includes(q) ||
        (inst.id && inst.id.toLowerCase().includes(q)) ||
        (inst.remark && inst.remark.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`已复制${label}到剪贴板`);
  };

  const handleSaveRemark = (instId: string) => {
    updateInstanceRemark(instId, tempRemark);
    setEditingRemarkId(null);
    showToast('备注已更新');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-[#1A1A1A]">
      
      {/* 顶部标题与新建入口 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[#333333]" />
            <span>我的算力</span>
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            展示您在算力工坊租用的所有GPU实例，实时监控资源开销与实例生命周期
          </p>
        </div>

        <button
          onClick={() => setActiveTab('compute')}
          className="px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#333333] text-white font-semibold text-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>租用新算力实例</span>
        </button>
      </div>

      {/* 1. 统计卡片（图标统一去色为深灰线框风格） */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-[#666666] font-medium">运行中实例</div>
            <div className="text-2xl font-bold text-[#1A1A1A] font-mono tabular-nums">
              {runningCount} <span className="text-xs text-[#888888] font-sans font-normal">个</span>
            </div>
            <div className="text-[11px] text-[#888888]">
              实时按小时计费中
            </div>
          </div>
          <div className="w-11 h-11 rounded-md bg-[#F5F5F5] text-[#333333] flex items-center justify-center border border-[#EAEAEA]">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-[#666666] font-medium">已停止实例</div>
            <div className="text-2xl font-bold text-[#1A1A1A] font-mono tabular-nums">
              {stoppedCount} <span className="text-xs text-[#888888] font-sans font-normal">个</span>
            </div>
            <div className="text-[11px] text-[#888888]">
              仅收取基础存储费用
            </div>
          </div>
          <div className="w-11 h-11 rounded-md bg-[#F5F5F5] text-[#333333] flex items-center justify-center border border-[#EAEAEA]">
            <Square className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-md p-5 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-[#666666] font-medium">本月预计算力费用</div>
            <div className="text-2xl font-bold text-[#1A1A1A] font-mono tabular-nums">
              ¥{totalCostMonth.toFixed(2)}
            </div>
            <div className="text-[11px] text-[#888888]">
              含实例租用与存储费用
            </div>
          </div>
          <div className="w-11 h-11 rounded-md bg-[#F5F5F5] text-[#333333] flex items-center justify-center border border-[#EAEAEA]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. 筛选栏 */}
      <div className="bg-white border border-[#EAEAEA] rounded-md p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* 状态筛选 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-[#888888] font-medium mr-1">状态:</span>
            {[
              { id: 'all', label: '全部' },
              { id: 'running', label: `运行中 (${runningCount})` },
              { id: 'stopped', label: `已停止 (${stoppedCount})` },
              { id: 'other', label: '其他/已释放' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer border ${
                  statusFilter === tab.id
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white hover:bg-[#F5F5F5] text-[#555555] border-[#EAEAEA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 规格筛选 & 搜索框 */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#888888] font-medium">规格:</span>
              <select
                value={specFilter}
                onChange={(e) => setSpecFilter(e.target.value)}
                className="px-3 py-1.5 rounded-md bg-white text-[#333333] text-xs font-medium border border-[#E0E0E0] focus:outline-hidden focus:border-[#1A1A1A] cursor-pointer transition"
              >
                <option value="all">全部规格</option>
                <option value="4090">RTX 4090</option>
                <option value="A100">NVIDIA A100</option>
                <option value="H100">NVIDIA H100</option>
                <option value="T4">NVIDIA T4</option>
                <option value="3090">RTX 3090</option>
              </select>
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="按实例名称/备注搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white rounded-md text-xs text-[#1A1A1A] placeholder-[#999999] border border-[#E0E0E0] focus:outline-hidden focus:border-[#1A1A1A] transition"
              />
            </div>
          </div>

        </div>
      </div>

      {/* 3. 实例列表 */}
      <div className="bg-white border border-[#EAEAEA] rounded-md overflow-hidden">
        {filteredInstances.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-11 h-11 rounded-md bg-[#F5F5F5] border border-[#EAEAEA] text-[#888888] flex items-center justify-center mx-auto">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-[#1A1A1A]">暂无匹配的算力实例</div>
            <p className="text-xs text-[#666666] max-w-sm mx-auto">
              您尚未租用符合条件的 GPU 实例，可前往算力工坊快速启动一台高性价比训练/微调节点
            </p>
            <button
              onClick={() => setActiveTab('compute')}
              className="px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#333333] text-white font-semibold text-xs transition cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>立即租用实例</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EAEAEA] bg-[#F8F9FA] text-xs font-semibold text-[#333333]">
                  <th className="py-3.5 px-4">实例名称 / ID</th>
                  <th className="py-3.5 px-4">硬件规格配置</th>
                  <th className="py-3.5 px-4">状态</th>
                  <th className="py-3.5 px-4">计费模式与单价</th>
                  <th className="py-3.5 px-4">创建时间 / 租用时长</th>
                  <th className="py-3.5 px-4">快捷开发入口</th>
                  <th className="py-3.5 px-4 text-right">管理操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2] text-xs text-[#333333]">
                {filteredInstances.map((inst) => {
                  const isRunning = inst.status === 'running';
                  const isStopped = inst.status === 'stopped';

                  return (
                    <tr key={inst.id} className="hover:bg-[#FAFAFA] transition-colors">
                      
                      {/* 实例名称 / ID / 备注 */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span 
                              onClick={() => setDetailInstance(inst)}
                              className="font-semibold text-[#1A1A1A] hover:underline transition-colors cursor-pointer"
                            >
                              {inst.name}
                            </span>
                            <code className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F5F5F5] border border-[#EAEAEA] text-[#666666]">
                              {inst.id}
                            </code>
                          </div>

                          {/* 备注编辑 */}
                          <div className="flex items-center gap-1.5 text-[11px] text-[#888888]">
                            {editingRemarkId === inst.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={tempRemark}
                                  onChange={(e) => setTempRemark(e.target.value)}
                                  className="px-2 py-0.5 rounded bg-white text-[#1A1A1A] text-xs border border-[#1A1A1A] w-32 focus:outline-hidden"
                                  placeholder="输入备注..."
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveRemark(inst.id)}
                                  className="p-1 text-[#166534] hover:bg-[#F5F5F5] rounded cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => setEditingRemarkId(null)}
                                  className="p-1 text-[#888888] hover:bg-[#F5F5F5] rounded cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div 
                                onClick={() => {
                                  setEditingRemarkId(inst.id);
                                  setTempRemark(inst.remark || '');
                                }}
                                className="flex items-center gap-1 hover:text-[#333333] cursor-pointer group"
                              >
                                <span>{inst.remark || '点击添加备注'}</span>
                                <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 规格 */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-[#1A1A1A] flex items-center gap-1">
                            <Zap className="w-3 h-3 text-[#555555]" />
                            <span>{inst.gpuModel}</span>
                            <span className="text-[11px] text-[#888888] font-mono">x{inst.gpuCount || 1}</span>
                          </div>
                          <div className="text-[11px] text-[#888888]">
                            {inst.cpu} · {inst.ram} · {inst.vram}
                          </div>
                        </div>
                      </td>

                      {/* 状态：运行中保留小绿点，已停止用中性灰 */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isRunning && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#F0FDF4] text-[#166534]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                            运行中
                          </span>
                        )}
                        {isStopped && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#666666]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
                            已停止
                          </span>
                        )}
                        {!isRunning && !isStopped && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#666666]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                            {inst.status}
                          </span>
                        )}
                      </td>

                      {/* 计费模式与费用 */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-mono tabular-nums font-semibold text-[#1A1A1A]">
                            ¥{inst.hourlyCost.toFixed(2)} <span className="text-[10px] font-sans font-normal text-[#888888]">/时</span>
                          </div>
                          <div className="text-[11px] text-[#888888]">
                            {inst.billingType || '按量计费'}
                          </div>
                        </div>
                      </td>

                      {/* 创建时间 / 时长 */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[#555555]">
                          <div className="font-mono tabular-nums text-[11px]">
                            {inst.createdAt || inst.startTime || '2026-08-20 14:00'}
                          </div>
                          <div className="text-[11px] text-[#888888]">
                            已运行: {inst.runningHours || 16} 小时
                          </div>
                        </div>
                      </td>

                      {/* 快捷开发入口 */}
                      <td className="py-3.5 px-4">
                        {isRunning ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={inst.jupyterUrl || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#E0E0E0] text-[#333333] text-[11px] font-medium transition inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Jupyter</span>
                              <ExternalLink className="w-3 h-3 text-[#666666]" />
                            </a>
                            <button
                              onClick={() => handleCopy(inst.sshCommand || `ssh root@10.244.12.8 -p 22022`, 'SSH 连接命令')}
                              className="px-2 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#E0E0E0] text-[#333333] text-[11px] font-medium transition inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Terminal className="w-3 h-3 text-[#666666]" />
                              <span>SSH</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#999999]">实例未启动</span>
                        )}
                      </td>

                      {/* 操作：停止/启动统一中性线框按钮，仅删除保留暗红 */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* 详情 */}
                          <button
                            onClick={() => setDetailInstance(inst)}
                            className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#333333] hover:text-[#1A1A1A] font-medium text-xs transition cursor-pointer"
                          >
                            详情
                          </button>

                          {/* 启动 / 停止 */}
                          {isRunning ? (
                            <button
                              onClick={() => toggleGpuInstanceStatus(inst.id)}
                              className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] hover:border-[#1A1A1A] text-[#333333] hover:text-[#1A1A1A] font-medium text-xs transition cursor-pointer inline-flex items-center gap-1"
                              title="暂停实例以节省算力费用"
                            >
                              <Square className="w-3 h-3" />
                              <span>停止</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleGpuInstanceStatus(inst.id)}
                              className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] hover:border-[#1A1A1A] text-[#333333] hover:text-[#1A1A1A] font-medium text-xs transition cursor-pointer inline-flex items-center gap-1"
                              title="启动实例"
                            >
                              <Play className="w-3 h-3" />
                              <span>启动</span>
                            </button>
                          )}

                          {/* 重启 */}
                          {isRunning && (
                            <button
                              onClick={() => restartGpuInstance(inst.id)}
                              className="p-1.5 rounded bg-white hover:bg-[#F5F5F5] border border-[#EAEAEA] text-[#555555] hover:text-[#1A1A1A] transition cursor-pointer"
                              title="重启实例"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* 释放 / 删除 */}
                          <button
                            onClick={() => {
                              if (confirm(`确认释放实例【${inst.name}】吗？释放后云端数据将彻底清理。`)) {
                                deleteGpuInstance(inst.id);
                              }
                            }}
                            className="p-1.5 rounded text-[#991B1B] hover:bg-[#FEF2F2] transition cursor-pointer"
                            title="释放实例"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. 实例详情弹窗 */}
      {detailInstance && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-2xl w-full p-6 space-y-6 border border-[#EAEAEA] max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333] flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <span>{detailInstance.name}</span>
                    <span className="text-xs font-mono font-normal text-[#888888]">({detailInstance.id})</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#666666] mt-0.5">
                    <span>{detailInstance.gpuModel}</span>
                    <span>·</span>
                    <span className={detailInstance.status === 'running' ? 'text-[#166534] font-medium' : 'text-[#666666] font-medium'}>
                      {detailInstance.status === 'running' ? '运行中' : '已停止'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDetailInstance(null)}
                className="w-8 h-8 rounded-md bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#555555] flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 基本信息 Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#666666]">
                硬件规格与资源配置
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#EAEAEA]">
                  <div className="text-[11px] text-[#888888]">GPU 加速卡</div>
                  <div className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{detailInstance.gpuModel} x{detailInstance.gpuCount || 1}</div>
                </div>
                <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#EAEAEA]">
                  <div className="text-[11px] text-[#888888]">显存容量</div>
                  <div className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{detailInstance.vram}</div>
                </div>
                <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#EAEAEA]">
                  <div className="text-[11px] text-[#888888]">CPU 与内存</div>
                  <div className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{detailInstance.cpu} · {detailInstance.ram}</div>
                </div>
                <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#EAEAEA]">
                  <div className="text-[11px] text-[#888888]">挂载存储</div>
                  <div className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{detailInstance.disk || detailInstance.dataDisk || '100GB NVMe SSD'}</div>
                </div>
              </div>
            </div>

            {/* 计费信息 */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#666666]">
                计费与生命周期
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#EAEAEA]">
                  <div className="text-[11px] text-[#888888]">单价</div>
                  <div className="text-xs font-mono tabular-nums font-semibold text-[#1A1A1A] mt-0.5">¥{detailInstance.hourlyCost.toFixed(2)} / 小时</div>
                </div>
                <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#EAEAEA]">
                  <div className="text-[11px] text-[#888888]">计费方式</div>
                  <div className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{detailInstance.billingType || '按量计费 (按秒扣费)'}</div>
                </div>
                <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#EAEAEA]">
                  <div className="text-[11px] text-[#888888]">租用时间</div>
                  <div className="text-xs font-mono tabular-nums font-semibold text-[#1A1A1A] mt-0.5">{detailInstance.createdAt || detailInstance.startTime || '2026-08-20 14:00'}</div>
                </div>
              </div>
            </div>

            {/* 连接凭据 (运行中才展示) */}
            {detailInstance.status === 'running' && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#666666]">
                  远程连接与开发端口
                </h4>
                <div className="p-4 rounded-md bg-[#1A1A1A] text-[#E5E5E5] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A3A3A3]">SSH 连接指令:</span>
                    <button
                      onClick={() => handleCopy(detailInstance.sshCommand || `ssh root@10.244.12.8 -p 22022`, 'SSH指令')}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 text-[11px] cursor-pointer transition"
                    >
                      <Copy className="w-3 h-3" />
                      <span>复制</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 text-[#E5E5E5] break-all select-all">
                    {detailInstance.sshCommand || `ssh root@10.244.12.8 -p 22022`}
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                    <a
                      href={detailInstance.jupyterUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded bg-white hover:bg-[#EAEAEA] text-[#1A1A1A] font-semibold text-xs inline-flex items-center gap-1 cursor-pointer transition"
                    >
                      <span>打开 JupyterLab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
              <button
                onClick={() => {
                  if (confirm(`确认释放实例【${detailInstance.name}】吗？`)) {
                    deleteGpuInstance(detailInstance.id);
                    setDetailInstance(null);
                  }
                }}
                className="px-4 py-2 rounded-md text-[#991B1B] hover:bg-[#FEF2F2] font-medium text-xs transition cursor-pointer"
              >
                释放实例
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailInstance(null)}
                  className="px-4 py-2 rounded-md bg-white border border-[#EAEAEA] hover:bg-[#F5F5F5] text-[#333333] font-medium text-xs transition cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
