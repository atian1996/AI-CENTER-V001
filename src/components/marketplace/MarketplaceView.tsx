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
    <div className="w-full max-w-[1320px] mx-auto space-y-6 animate-fade-in pb-16 pt-2 select-none antialiased">
      
      {/* Unified Page Header */}
      <header className="pb-8 border-b border-[var(--border-light)] flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[var(--text-main)] leading-tight">
            AI集市
          </h1>
          <p className="text-[14px] text-[var(--text-sub)] leading-[1.6]">
            一站式检索与体验 Agent 智能体、大模型底座、高质行业数据集与开放 Skill 插件。
          </p>
        </div>

        {/* Sub Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {tabs.map(t => {
            const isActive = marketplaceTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setMarketplaceTab(t.id)}
                className={`px-4 py-2 rounded-[4px] text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'bg-[var(--text-main)] text-[#FFFFFF] border-[var(--text-main)]'
                    : 'bg-transparent text-[var(--text-sub)] border-[var(--border-light)] hover:border-[var(--border-dark)] hover:text-[var(--text-main)]'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Render Selected Tab */}
      {marketplaceTab === 'agent' && <AgentStore />}
      {marketplaceTab === 'model' && <ModelSquare />}
      {marketplaceTab === 'dataset' && <DatasetSquare />}
      {marketplaceTab === 'skill' && <SkillMarket />}

    </div>
  );
};
