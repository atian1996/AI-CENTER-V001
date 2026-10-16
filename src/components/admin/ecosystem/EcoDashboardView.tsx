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
  Tv,
  Repeat
} from 'lucide-react';
// v0.1 components
import { EcoOverviewTab } from './EcoOverviewTab';
import { EcoIndustryTab } from './EcoIndustryTab';
import { EcoActivitiesTab } from './EcoActivitiesTab';
import { EcoLedgerReportTab } from './EcoLedgerReportTab';
import { EcoFourLedgerDrilldownModal, DrilldownType } from './EcoFourLedgerDrilldownModal';
import { EcoCaseDetailModal } from './EcoCaseDetailModal';
import { EcoActivityDetailModal } from './EcoActivityDetailModal';
import { EcoReportPreviewModal } from './EcoReportPreviewModal';
import { EcoCaseItem, EcoActivityItem, EcoReportItem } from './mockEcoData';

// v0.2 components
import { EcoV2OverviewTab } from './v2/EcoV2OverviewTab';
import { EcoV2IndustryTab } from './v2/EcoV2IndustryTab';
import { EcoV2ActivitiesTab } from './v2/EcoV2ActivitiesTab';
import { EcoV2LedgersTab } from './v2/EcoV2LedgersTab';

import { ScreencastSettingsModal } from '../screencast/ScreencastSettingsModal';
import { useApp } from '../../../context/AppContext';

export const EcoDashboardView: React.FC = () => {
  const { showToast } = useApp();

  // Version: '0.1' (经典运营) | '0.2' (考核大屏)
  const [ecoVersion, setEcoVersion] = useState<'0.1' | '0.2'>('0.2');

  // Active TAB: 'overview' | 'industry' | 'activities' | 'reports'
  const [activeEcoTab, setActiveEcoTab] = useState<'overview' | 'industry' | 'activities' | 'reports'>('overview');

  // Full-screen mode for big-screen presentation
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Drilldown Modal state (v0.1)
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
    const url = `${window.location.origin}${window.location.pathname}?screencast=ecosystem&version=${ecoVersion}`;
    window.open(url, '_blank');
  };

  const toggleVersion = () => {
    const nextVer = ecoVersion === '0.2' ? '0.1' : '0.2';
    setEcoVersion(nextVer);
    showToast(`已切换至 AI生态看板 ${nextVer === '0.2' ? 'v0.2 考核大屏版' : 'v0.1 经典运营版'}`);
  };

  return (
    <div className={`space-y-3.5 relative ${isFullScreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      
      {/* 顶部大屏 Header 控制条 */}
      <div className="rounded-2xl bg-slate-900/95 border border-slate-800 px-4 py-2.5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-xl">
        
        {/* 左侧：版本切换胶囊 + 4 大 TAB 页导航按钮 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 md:pb-0">
          
          {/* 版本快速切换开关 */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => {
                setEcoVersion('0.1');
                showToast('已切换至 v0.1 经典运营版');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                ecoVersion === '0.1'
                  ? 'bg-slate-800 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              v0.1 经典版
            </button>
            <button
              onClick={() => {
                setEcoVersion('0.2');
                showToast('已切换至 v0.2 考核大屏版');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                ecoVersion === '0.2'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>v0.2 考核大屏</span>
            </button>
          </div>

          <div className="w-[1px] h-6 bg-slate-800 mx-1 shrink-0"></div>

          {/* 4 大 TAB 按钮 */}
          <button
            onClick={() => setActiveEcoTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeEcoTab === 'overview'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{ecoVersion === '0.2' ? '1. 考核指标总览' : '1. 平台运营总览'}</span>
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
            <span>{ecoVersion === '0.2' ? '4. 四本台账' : '4. 数据台账报告'}</span>
          </button>
        </div>

        {/* 右侧大屏演示控制按钮 */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            onClick={() => showToast('已刷新 AI 生态看板全部指标与图表数据')}
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

          {/* 全屏按钮 */}
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

      {/* 4 大 TAB 内容视图：按版本条件渲染 */}
      {ecoVersion === '0.2' ? (
        // === 0.2 考核大屏版本 ===
        <>
          {activeEcoTab === 'overview' && (
            <EcoV2OverviewTab
              onSwitchToLedgerTab={() => setActiveEcoTab('reports')}
              onSwitchToIndustryTab={() => setActiveEcoTab('industry')}
            />
          )}

          {activeEcoTab === 'industry' && (
            <EcoV2IndustryTab />
          )}

          {activeEcoTab === 'activities' && (
            <EcoV2ActivitiesTab />
          )}

          {activeEcoTab === 'reports' && (
            <EcoV2LedgersTab />
          )}
        </>
      ) : (
        // === 0.1 经典运营版本 ===
        <>
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
        </>
      )}

      {/* 右下角悬浮版本切换按钮 (保留0.1与0.2随时无缝切换) */}
      <div className="fixed right-6 bottom-6 z-40">
        <button
          onClick={toggleVersion}
          className="px-4 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-900 border border-slate-700/80 hover:border-blue-500/60 shadow-2xl backdrop-blur-xl text-white text-xs font-black flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer ring-1 ring-white/10"
          title="点击切换 AI 生态看板版本"
        >
          <div className={`w-2.5 h-2.5 rounded-full ${ecoVersion === '0.2' ? 'bg-amber-400 animate-pulse' : 'bg-blue-400'}`}></div>
          <span className="font-extrabold text-white">当前：{ecoVersion === '0.2' ? 'v0.2 考核大屏版' : 'v0.1 经典运营版'}</span>
          <span className="text-slate-600">|</span>
          <Repeat className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-blue-400 hover:text-blue-300 font-bold">切至 {ecoVersion === '0.2' ? 'v0.1 经典版' : 'v0.2 考核大屏'}</span>
        </button>
      </div>

      {/* 挂载 4 个关联穿透弹窗 (v0.1) */}
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
