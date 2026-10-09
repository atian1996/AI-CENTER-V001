import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockHistoryInstances } from '../../data/mockData';
import { GPUInstance } from '../../types';
import { 
  X, 
  History, 
  Save, 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  Box, 
  Cpu, 
  Clock, 
  Coins, 
  Sparkles,
  Calendar,
  Layers,
  HardDrive
} from 'lucide-react';

export const ComputeHistoryModal: React.FC = () => {
  const { historyModalOpen, setHistoryModalOpen, showToast, launchGpuInstance } = useApp();
  const [activeTab, setActiveTab] = useState<'history' | 'snapshots' | 'export'>('history');

  if (!historyModalOpen) return null;

  const handleReLaunch = (item: GPUInstance) => {
    launchGpuInstance(item.scene, item.gpuModel, item.imageName, {
      instanceType: 'container',
      region: item.region,
      billingType: item.billingType
    });
    setHistoryModalOpen(false);
  };

  const handleExportCSV = () => {
    showToast('已生成并下载 2026年8月 GPU 算力容器消费明细账单 (CSV)');
  };

  return (
    <div id="compute-history-modal-backdrop" className="fixed inset-0 z-[95] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in select-none font-sans">
      <div id="compute-history-modal-container" className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[78vh] my-auto">
        
        {/* Modal Header */}
        <div id="compute-history-modal-header" className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold shadow-2xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base">算力历史记录与流水账单</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  GPU 容器云
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">查看已销毁释放的历史容器实例、环境自定义快照与费用明细流水</p>
            </div>
          </div>

          <button
            id="close-compute-history-modal-btn"
            onClick={() => setHistoryModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div id="compute-history-modal-tabs" className="flex border-b border-slate-200 bg-slate-50/50 px-6 text-xs font-bold text-slate-600 gap-6">
          <button
            id="tab-history-instances-btn"
            onClick={() => setActiveTab('history')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>历史释放实例 ({mockHistoryInstances.length})</span>
          </button>

          <button
            id="tab-snapshots-btn"
            onClick={() => setActiveTab('snapshots')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'snapshots' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>环境快照镜像 (2)</span>
          </button>

          <button
            id="tab-export-billing-btn"
            onClick={() => setActiveTab('export')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'export' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>费用明细与账单导出</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/40 text-xs">
          
          {/* TAB 1: 历史释放容器实例 */}
          {activeTab === 'history' && (
            <div className="space-y-3.5 font-medium">
              {mockHistoryInstances.map((item) => (
                <div 
                  key={item.id} 
                  id={`history-item-${item.id}`}
                  className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
                        <Box className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-black text-slate-900 text-sm">{item.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                        GPU 容器
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200">
                        {item.scene}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200">
                        已释放销毁
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="font-bold text-indigo-600">规格: {item.gpuModel} × {item.gpuCount}卡</span>
                      <span>硬件: {item.cpu} / {item.ram}</span>
                      <span>地域: {item.region}</span>
                      <span className="text-slate-500">镜像: {item.imageName}</span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
                      <span>⏱ 累计运行时长: <strong className="text-slate-800 font-bold">{(item.runningHours ?? 0).toFixed(1)}h</strong></span>
                      <span>💰 产生算力费用: <strong className="text-amber-600 font-bold">¥{(item.totalCost ?? 0).toFixed(2)}</strong> (¥{(item.hourlyCost ?? 0).toFixed(2)}/h)</span>
                      <span>📅 创建时间: {item.createdAt}</span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex items-center">
                    <button
                      id={`relaunch-btn-${item.id}`}
                      onClick={() => handleReLaunch(item)}
                      className="w-full md:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>按此配置重新拉起容器</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: 环境快照库 */}
          {activeTab === 'snapshots' && (
            <div className="space-y-3.5 font-medium">
              <div id="snapshot-item-1" className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
                      <Save className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-black text-slate-900 text-sm">my-llama-v1-snapshot</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      PyTorch / DeepSpeed
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">描述: 包含完整训练依赖、数据清洗脚本与 DeepSpeed v0.12 多卡加速预设架构</p>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-4 pt-1">
                    <span>📦 镜像容量: <strong className="text-slate-700 font-bold">18.4 GB</strong></span>
                    <span>🎯 目标卡型: NVIDIA A100 80G / PRO 6000</span>
                    <span>📅 创建时间: 2026-08-10 18:00</span>
                  </div>
                </div>

                <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    id="launch-from-snapshot-1-btn"
                    onClick={() => {
                      launchGpuInstance('大模型微调', 'NVIDIA A100 80G', 'my-llama-v1-snapshot (自定义快照镜像)');
                      setHistoryModalOpen(false);
                    }}
                    className="w-full md:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>从快照秒级拉起容器</span>
                  </button>
                </div>
              </div>

              <div id="snapshot-item-2" className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold">
                      <Save className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-black text-slate-900 text-sm">flux-lora-checkpoint-bundle</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                      ComfyUI / Flux
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">描述: 已装配国风赛博 LoRA 权重与 Wan2.2 视频生成多节点工作流环境</p>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-4 pt-1">
                    <span>📦 镜像容量: <strong className="text-slate-700 font-bold">52.1 GB</strong></span>
                    <span>🎯 目标卡型: PRO 6000 96GB / RTX 5090</span>
                    <span>📅 创建时间: 2026-08-04 18:30</span>
                  </div>
                </div>

                <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    id="launch-from-snapshot-2-btn"
                    onClick={() => {
                      launchGpuInstance('文生图', 'PRO 6000 96GB', 'flux-lora-checkpoint-bundle (自定义快照镜像)');
                      setHistoryModalOpen(false);
                    }}
                    className="w-full md:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>从快照秒级拉起容器</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 费用明细与账单导出 */}
          {activeTab === 'export' && (
            <div className="space-y-4 font-medium">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">2026年8月 GPU 算力容器消费汇总</h4>
                    <p className="text-slate-500 text-xs mt-0.5">按秒计费，按小时合并出账，包含容器租用、存储券及折扣抵扣</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    账户余额充足
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="text-slate-400 text-xs font-sans flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>本月累计运行时长</span>
                    </div>
                    <div className="text-slate-900 font-black text-xl mt-1.5">26.9 小时</div>
                    <div className="text-[10px] text-slate-400 mt-1">共计拉起 3 个容器实例</div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="text-slate-400 text-xs font-sans flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>本月实付算力总花费</span>
                    </div>
                    <div className="text-amber-600 font-black text-xl mt-1.5">¥252.68 元</div>
                    <div className="text-[10px] text-slate-400 mt-1">已包含 100GB NVMe 数据盘费用</div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="text-slate-400 text-xs font-sans flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>已享新人/活动优惠</span>
                    </div>
                    <div className="text-emerald-600 font-black text-xl mt-1.5">¥68.50 元</div>
                    <div className="text-[10px] text-slate-400 mt-1">立省 21.3%</div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    支持按月导出 CSV 原始交易对账单，包含实例 ID、显卡规格、启动/释放时间与计费明细
                  </div>

                  <button
                    id="export-csv-btn"
                    onClick={handleExportCSV}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>导出月度 CSV 消费对账单</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

