import React from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceSubTab } from '../../types';
import { AgentStore } from './AgentStore';
import { ModelSquare } from './ModelSquare';
import { DatasetSquare } from './DatasetSquare';
import { SkillMarket } from './SkillMarket';
import { Bot, Cpu, Database, Zap, Store } from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { marketplaceTab, setMarketplaceTab } = useApp();

  const tabs: { id: MarketplaceSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'agent', label: 'Agent 商店', icon: <Bot className="w-4 h-4" /> },
    { id: 'model', label: '模型广场', icon: <Cpu className="w-4 h-4" /> },
    { id: 'dataset', label: '数据集广场', icon: <Database className="w-4 h-4" /> },
    { id: 'skill', label: 'Skill 插件市场', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 select-none">
      
      {/* Standard Unified Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              AI集市
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                一站式集市
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              一站式检索与体验 Agent 智能体、大模型底座、高质行业数据集与开放 Skill 插件
            </p>
          </div>
        </div>

        {/* Sub Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shrink-0">
          {tabs.map(t => {
            const isActive = marketplaceTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setMarketplaceTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Selected Tab */}
      {marketplaceTab === 'agent' && <AgentStore />}
      {marketplaceTab === 'model' && <ModelSquare />}
      {marketplaceTab === 'dataset' && <DatasetSquare />}
      {marketplaceTab === 'skill' && <SkillMarket />}

    </div>
  );
};
