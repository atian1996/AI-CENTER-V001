import React, { useState } from 'react';
import {
  Cpu,
  FileSpreadsheet,
  Coins,
  AlertTriangle,
  GitPullRequest,
  Maximize2,
  Minimize2,
  RefreshCw,
  Clock,
  ShieldAlert,
  Settings,
  Tv
} from 'lucide-react';
import { ComputeOpsOverviewTab } from './ComputeOpsOverviewTab';
import { ComputeOpsReconciliationTab } from './ComputeOpsReconciliationTab';
import { ComputeOpsRevenueTab } from './ComputeOpsRevenueTab';
import { ComputeOpsCapacityAlertsTab } from './ComputeOpsCapacityAlertsTab';
import { ComputeOpsClusterOnboardingTab } from './ComputeOpsClusterOnboardingTab';
import { ComputeOpsInstanceDetailModal } from './ComputeOpsInstanceDetailModal';
import { ScreencastSettingsModal } from '../screencast/ScreencastSettingsModal';
import { ConsumptionDetailRow } from './mockComputeOpsData';
import { useApp } from '../../../context/AppContext';

export type ComputeOpsTabKey =
  | 'overview'        // 算力资源总览
  | 'reconciliation'  // 算力对账明细
  | 'revenue'         // 算力收益分成
  | 'alerts'          // 算力容量告警
  | 'progress';       // 算力纳管进度

export const ComputeOpsDashboardView: React.FC = () => {
  const { showToast } = useApp();

  // 当前选中的 TAB
  const [activeTab, setActiveTab] = useState<ComputeOpsTabKey>('overview');

  // 全屏展示状态
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // 选中的实例下钻详情
  const [selectedInstance, setSelectedInstance] = useState<ConsumptionDetailRow | null>(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullScreen(true)).catch(() => setIsFullScreen(true));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullScreen(false)).catch(() => setIsFullScreen(false));
      }
    }
  };

  const handleLaunchScreencast = () => {
    const url = `${window.location.origin}${window.location.pathname}?screencast=compute-ops`;
    window.open(url, '_blank');
  };

  return (
    <div className={`space-y-3.5 ${isFullScreen ? 'fixed inset-0 z-50 bg-[#0F172A] p-6 overflow-y-auto' : ''}`}>
      
      {/* 顶部大屏 Header 控制条 (与 AI生态看板 风格一致) */}
      <div className="rounded-2xl bg-slate-900/95 border border-slate-800 px-4 py-2.5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-xl">
        {/* 左侧 5 大 TAB 导航 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 md:pb-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>1. 算力资源总览</span>
          </button>

          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'reconciliation'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>2. 算力对账明细</span>
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'revenue'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>3. 算力收益分成</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>4. 算力容量告警</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'progress'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />
            <span>5. 算力纳管进度</span>
          </button>
        </div>

        {/* 右侧大屏控制 */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            onClick={() => showToast('已刷新 算力运营中心 遥测指标与结算数据源')}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="刷新数据"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* 设置按钮 */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="投屏播放设置"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>设置</span>
          </button>

          {/* 投屏按钮 */}
          <button
            onClick={handleLaunchScreencast}
            className="px-3 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-500 border border-blue-500/30 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
            title="在新标签页全屏展示5个页面并按设定间隔自动轮播"
          >
            <Tv className="w-3.5 h-3.5 text-blue-200" />
            <span>投屏</span>
          </button>

          {/* 全屏按钮 (原大屏投影模式) */}
          <button
            onClick={toggleFullScreen}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title={isFullScreen ? '退出浏览器全屏' : '进入全屏大屏模式'}
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5 text-blue-400" /> : <Maximize2 className="w-3.5 h-3.5 text-blue-400" />}
            <span>{isFullScreen ? '退出全屏' : '全屏'}</span>
          </button>
        </div>
      </div>

      {/* 5 大 TAB 对应内容展示 */}
      {activeTab === 'overview' && <ComputeOpsOverviewTab />}

      {activeTab === 'reconciliation' && (
        <ComputeOpsReconciliationTab
          onSelectInstance={item => setSelectedInstance(item)}
        />
      )}

      {activeTab === 'revenue' && <ComputeOpsRevenueTab />}

      {activeTab === 'alerts' && <ComputeOpsCapacityAlertsTab />}

      {activeTab === 'progress' && <ComputeOpsClusterOnboardingTab />}

      {/* 挂载实例下钻详情弹窗 */}
      <ComputeOpsInstanceDetailModal
        item={selectedInstance}
        isOpen={!!selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />

      {/* 挂载投屏播放设置弹窗 */}
      <ScreencastSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        type="compute-ops"
        onLaunch={handleLaunchScreencast}
      />

    </div>
  );
};
