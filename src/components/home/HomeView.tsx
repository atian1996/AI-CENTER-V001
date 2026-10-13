import React, { useState, useEffect } from 'react';
import { HomeView01 } from './HomeView01';
import { HomeView02 } from './HomeView02';
import { Sparkles } from 'lucide-react';

export const HomeView: React.FC = () => {
  // 首页版本管理：默认使用全新的 0.2 版，支持平滑切换至 0.1 原版
  const [version, setVersion] = useState<'0.1' | '0.2'>(() => {
    try {
      const saved = localStorage.getItem('qianji_home_version');
      if (saved === '0.1' || saved === '0.2') return saved;
    } catch {
      // ignore
    }
    return '0.2';
  });

  const handleSwitchVersion = (newVer: '0.1' | '0.2') => {
    setVersion(newVer);
    try {
      localStorage.setItem('qianji_home_version', newVer);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative">
      {/* 渲染对应版本的首页 */}
      {version === '0.2' ? (
        <HomeView02 onSwitchToVersion01={() => handleSwitchVersion('0.1')} />
      ) : (
        <HomeView01 />
      )}

      {/* 不明显的版本切换浮动小按钮（随处可见但低调轻量） */}
      <div className="fixed bottom-4 right-4 z-40 print:hidden select-none">
        <div className="bg-slate-900/85 hover:bg-slate-950 text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700/80 shadow-lg backdrop-blur-md text-[11px] font-mono flex items-center gap-2 transition duration-200">
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>首页版本:</span>
          </span>
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-full border border-slate-700">
            <button
              onClick={() => handleSwitchVersion('0.1')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                version === '0.1'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="切换为 0.1 原版首页"
            >
              0.1 原版
            </button>
            <button
              onClick={() => handleSwitchVersion('0.2')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                version === '0.2'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="切换为 0.2 新版场景化首页"
            >
              0.2 新版
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
