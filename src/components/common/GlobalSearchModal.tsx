import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Bot, Cpu, Database, Briefcase, MessageSquare, ArrowRight, Zap } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    searchOpen, 
    setSearchOpen, 
    searchQuery, 
    setSearchQuery, 
    agents, 
    models, 
    datasets, 
    tasks, 
    posts,
    skills,
    setActiveTab,
    setMarketplaceTab,
    openAgentDetail,
    setTryoutModel
  } = useApp();

  if (!searchOpen) return null;

  const query = searchQuery.trim().toLowerCase();

  const matchedAgents = query ? agents.filter(a => a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)) : agents.slice(0, 4);
  const matchedModels = query ? models.filter(m => m.name.toLowerCase().includes(query) || m.vendor.toLowerCase().includes(query)) : models.slice(0, 3);
  const matchedDatasets = query ? datasets.filter(d => d.name.toLowerCase().includes(query) || d.industry.toLowerCase().includes(query)) : datasets.slice(0, 2);
  const matchedTasks = query ? tasks.filter(t => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)) : tasks.slice(0, 2);
  const matchedPosts = query ? posts.filter(p => p.content.toLowerCase().includes(query) || p.author.toLowerCase().includes(query)) : posts.slice(0, 2);
  const matchedSkills = query ? skills.filter(s => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)) : skills.slice(0, 2);

  return (
    <div 
      onClick={() => setSearchOpen(false)}
      className="fixed inset-0 z-[120] flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in cursor-pointer select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] cursor-default"
      >
        
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3.5 bg-slate-50/80">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索全站 Agent / 模型 / 算力 / 数据集 / 任务 / 插件 / 社区讨论..."
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm sm:text-base outline-none font-medium"
            autoFocus
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-white border border-slate-200 cursor-pointer text-xs"
            >
              清空
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="关闭 (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Agent Results */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <Bot className="w-4 h-4" /> Agent 智能体 ({matchedAgents.length})
              </span>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setActiveTab('marketplace');
                  setMarketplaceTab('agent');
                }}
                className="hover:text-indigo-600 cursor-pointer"
              >
                查看全部 →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {matchedAgents.map(ag => (
                <div
                  key={ag.id}
                  onClick={() => {
                    setSearchOpen(false);
                    openAgentDetail(ag);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/50 border border-slate-200/70 hover:border-indigo-300 transition flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs">
                      {ag.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {ag.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {ag.description}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    {ag.priceType === 'free' ? '免费' : `¥${ag.priceValue}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Model & Skill Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Models */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5 text-cyan-600">
                  <Cpu className="w-4 h-4" /> 大模型底座
                </span>
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setActiveTab('marketplace');
                    setMarketplaceTab('model');
                  }}
                  className="hover:text-cyan-600 cursor-pointer"
                >
                  全部 →
                </button>
              </div>
              <div className="space-y-2">
                {matchedModels.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setTryoutModel(m);
                    }}
                    className="p-3 rounded-2xl bg-slate-50/70 hover:bg-cyan-50/50 border border-slate-200/70 hover:border-cyan-300 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-700">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-slate-400">厂商: {m.vendor}</div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      在线体验
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5 text-purple-600">
                  <Zap className="w-4 h-4" /> Skill 插件市场
                </span>
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setActiveTab('marketplace');
                    setMarketplaceTab('skill');
                  }}
                  className="hover:text-purple-600 cursor-pointer"
                >
                  全部 →
                </button>
              </div>
              <div className="space-y-2">
                {matchedSkills.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setActiveTab('marketplace');
                      setMarketplaceTab('skill');
                    }}
                    className="p-3 rounded-2xl bg-slate-50/70 hover:bg-purple-50/50 border border-slate-200/70 hover:border-purple-300 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{s.category} · v{s.version}</div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      查看
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Tasks & Community */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Briefcase className="w-4 h-4" /> 悬赏与招标任务
                </span>
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setActiveTab('tasks');
                  }}
                  className="hover:text-amber-600 cursor-pointer"
                >
                  全部 →
                </button>
              </div>
              <div className="space-y-2">
                {matchedTasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setActiveTab('tasks');
                    }}
                    className="p-3 rounded-2xl bg-slate-50/70 hover:bg-amber-50/50 border border-slate-200/70 hover:border-amber-300 transition flex items-center justify-between cursor-pointer"
                  >
                    <div className="truncate max-w-[240px]">
                      <div className="text-xs font-bold text-slate-900 truncate">{t.title}</div>
                      <div className="text-[10px] text-slate-400">{t.type} · 截止 {t.deadline}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-600">
                      {t.bountyUnit}{t.bounty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <MessageSquare className="w-4 h-4" /> 社区讨论与分享
                </span>
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setActiveTab('community');
                  }}
                  className="hover:text-emerald-600 cursor-pointer"
                >
                  全部 →
                </button>
              </div>
              <div className="space-y-2">
                {matchedPosts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setActiveTab('community');
                    }}
                    className="p-3 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/50 border border-slate-200/70 hover:border-emerald-300 transition flex items-center justify-between cursor-pointer"
                  >
                    <div className="truncate max-w-[240px]">
                      <div className="text-xs font-bold text-slate-900 truncate">{p.title || p.content}</div>
                      <div className="text-[10px] text-slate-400">{p.author} · {p.board}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      阅读
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
