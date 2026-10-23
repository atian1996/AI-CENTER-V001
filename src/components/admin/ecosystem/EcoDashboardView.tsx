import React, { useState } from 'react';
import {
  BarChart3,
  Building2,
  Trophy,
  FileText,
  RefreshCw,
  Tv
} from 'lucide-react';

// 仅保留 v0.2 考核大屏版本组件
import { EcoV2OverviewTab } from './v2/EcoV2OverviewTab';
import { EcoV2IndustryTab } from './v2/EcoV2IndustryTab';
import { EcoV2ActivitiesTab } from './v2/EcoV2ActivitiesTab';
import { EcoV2LedgersTab } from './v2/EcoV2LedgersTab';

import { useApp } from '../../../context/AppContext';

export const EcoDashboardView: React.FC = () => {
  const { showToast } = useApp();

  // Active TAB: 'overview' | 'industry' | 'activities' | 'reports'
  const [activeEcoTab, setActiveEcoTab] = useState<'overview' | 'industry' | 'activities' | 'reports'>('overview');

  const handleLaunchScreencast = () => {
    const url = `${window.location.origin}${window.location.pathname}?screencast=ecosystem`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-3.5 relative">
      
      {/* 顶部大屏 Header 控制条 */}
      <div className="rounded-2xl bg-slate-900/95 border border-slate-800 px-4 py-2.5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-xl">
        
        {/* 左侧：4 大 TAB 页导航按钮（已移除版本切换，固定 0.2 考核大屏版） */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 md:pb-0">
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
            <span>4. 数据台账汇总</span>
          </button>
        </div>

        {/* 右侧控制按钮（已删除“设置”和“全屏”，保留刷新和投屏） */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            onClick={() => showToast('已刷新 AI 生态看板全部指标与图表数据')}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="刷新数据"
          >
            <RefreshCw className="w-3.5 h-3.5" />
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
        </div>
      </div>

      {/* 4 大 TAB 内容视图：固定 0.2 版本 */}
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
    </div>
  );
};
