import React, { useState } from 'react';
import {
  BarChart3,
  Building2,
  Trophy,
  FileText,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sparkles,
  Download,
  Share2,
  Clock,
  Layers,
  Globe,
  Settings,
  Tv
} from 'lucide-react';
import { EcoOverviewTab } from './EcoOverviewTab';
import { EcoIndustryTab } from './EcoIndustryTab';
import { EcoActivitiesTab } from './EcoActivitiesTab';
import { EcoLedgerReportTab } from './EcoLedgerReportTab';
import { EcoFourLedgerDrilldownModal, DrilldownType } from './EcoFourLedgerDrilldownModal';
import { EcoCaseDetailModal } from './EcoCaseDetailModal';
import { EcoActivityDetailModal } from './EcoActivityDetailModal';
import { EcoReportPreviewModal } from './EcoReportPreviewModal';
import { EcoCaseItem, EcoActivityItem, EcoReportItem } from './mockEcoData';
import { ScreencastSettingsModal } from '../screencast/ScreencastSettingsModal';
import { useApp } from '../../../context/AppContext';

export const EcoDashboardView: React.FC = () => {
  const { showToast } = useApp();

  // Active TAB: 'overview' | 'industry' | 'activities' | 'reports'
  const [activeEcoTab, setActiveEcoTab] = useState<'overview' | 'industry' | 'activities' | 'reports'>('overview');

  // Full-screen mode for big-screen presentation
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Drilldown Modal state
  const [drilldownType, setDrilldownType] = useState<DrilldownType>(null);
  const [selectedCase, setSelectedCase] = useState<EcoCaseItem | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<EcoActivityItem | null>(null);
  const [previewReport, setPreviewReport] = useState<EcoReportItem | null>(null);

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
    const url = `${window.location.origin}${window.location.pathname}?screencast=ecosystem`;
    window.open(url, '_blank');
  };

  return (
    <div className={`space-y-3.5 ${isFullScreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      
      {/* 顶部大屏 Header 控制条 */}
      <div className="rounded-2xl bg-slate-900/95 border border-slate-800 px-4 py-2.5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-xl">
        {/* 左侧 4 大 TAB 页导航按钮 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 md:pb-0">
          <button
            onClick={() => setActiveEcoTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeEcoTab === 'overview'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>1. 平台运营总览</span>
          </button>

          <button
            onClick={() => setActiveEcoTab('industry')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeEcoTab === 'industry'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>2. 产业生态成果</span>
          </button>

          <button
            onClick={() => setActiveEcoTab('activities')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeEcoTab === 'activities'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>3. 年度活动汇总</span>
          </button>

          <button
            onClick={() => setActiveEcoTab('reports')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeEcoTab === 'reports'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>4. 数据台账报告</span>
          </button>
        </div>

        {/* 右侧大屏演示控制按钮 */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            onClick={() => showToast('已刷新 AI 生态看板全部数据源与图表遥测')}
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
            className="px-3 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 border border-indigo-500/30 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
            title="在新标签页全屏展示4个页面并按设定间隔自动轮播"
          >
            <Tv className="w-3.5 h-3.5 text-indigo-200" />
            <span>投屏</span>
          </button>

          {/* 全屏按钮 (原大屏投影模式) */}
          <button
            onClick={toggleFullScreen}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title={isFullScreen ? '退出浏览器全屏' : '进入全屏大屏模式'}
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5 text-indigo-400" /> : <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{isFullScreen ? '退出全屏' : '全屏'}</span>
          </button>
        </div>
      </div>

      {/* 4 大 TAB 内容视图 */}
      {activeEcoTab === 'overview' && (
        <EcoOverviewTab
          onOpenDrilldown={type => setDrilldownType(type)}
          onSelectCase={c => setSelectedCase(c)}
        />
      )}

      {activeEcoTab === 'industry' && (
        <EcoIndustryTab
          onSelectCase={c => setSelectedCase(c)}
        />
      )}

      {activeEcoTab === 'activities' && (
        <EcoActivitiesTab
          onSelectActivity={act => setSelectedActivity(act)}
        />
      )}

      {activeEcoTab === 'reports' && (
        <EcoLedgerReportTab
          onPreviewReport={rep => setPreviewReport(rep)}
        />
      )}

      {/* 挂载 4 个关联穿透弹窗 */}
      <EcoFourLedgerDrilldownModal
        type={drilldownType}
        isOpen={!!drilldownType}
        onClose={() => setDrilldownType(null)}
        onSelectCase={c => setSelectedCase(c)}
      />

      <EcoCaseDetailModal
        caseItem={selectedCase}
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
      />

      <EcoActivityDetailModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />

      <EcoReportPreviewModal
        report={previewReport}
        isOpen={!!previewReport}
        onClose={() => setPreviewReport(null)}
      />

      {/* 挂载投屏播放设置弹窗 */}
      <ScreencastSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        type="ecosystem"
        onLaunch={handleLaunchScreencast}
      />
    </div>
  );
};
