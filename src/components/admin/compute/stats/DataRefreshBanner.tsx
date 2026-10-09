import React from 'react';
import { RefreshCw, Database, Clock, Zap, Info } from 'lucide-react';

interface DataRefreshBannerProps {
  lastRefreshedTime: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const DataRefreshBanner: React.FC<DataRefreshBannerProps> = ({
  lastRefreshedTime,
  isRefreshing,
  onRefresh
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">平台运营数据统计大盘</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              数据联动同步中
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            聚合自 <span className="text-indigo-300 font-medium">订单表</span> (历史累计)、<span className="text-emerald-300 font-medium">计费记录表</span> (流水营收) 与 <span className="text-cyan-300 font-medium">资源池API同步</span> (实时库存与负载)。
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        {/* 数据更新频次微标签 */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>GPU负载/实时实例: <b>5min</b></span>
          <span className="text-slate-600">|</span>
          <span>用户排行: <b>1h</b></span>
          <span className="text-slate-600">|</span>
          <span>营收/趋势: <b>每日凌晨</b></span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">上次刷新: {lastRefreshedTime}</span>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 hover:text-white rounded-lg font-medium border border-slate-700 text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
            <span>{isRefreshing ? '正在同步聚合...' : '立即刷新数据'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
