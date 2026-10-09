import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentItem } from '../../types';
import { AgentDetailSubPage } from './AgentDetailSubPage';
import { 
  Bot, 
  Star, 
  Play, 
  Sparkles, 
  Search, 
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Layers, 
  LayoutGrid, 
  Building2,
  Check,
  Flame,
  ArrowUpDown
} from 'lucide-react';

export const AgentStore: React.FC = () => {
  const { 
    agents, 
    payPerTokenAgents, 
    showToast
  } = useApp();

  // Selected agent for secondary page details (NULL means listing view)
  const [selectedAgentForDetail, setSelectedAgentForDetail] = useState<AgentItem | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [techFormFilter, setTechFormFilter] = useState<string>('all');
  const [sceneFilter, setSceneFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'comprehensive' | 'rating' | 'usage' | 'latest'>('comprehensive');

  // Unified Taxonomy Dictionaries
  const techForms = [
    { key: 'all', label: '全部形态' },
    { key: 'Chatbot', label: 'Chatbot' },
    { key: 'Agent', label: 'Agent' },
    { key: '对话流', label: '对话流' },
    { key: '工作流', label: '工作流' },
    { key: '文本生成', label: '文本生成' },
  ];

  const appScenarios = [
    { key: 'all', label: '全部场景' },
    { key: '内容创作', label: '内容创作' },
    { key: '数据分析', label: '数据分析' },
    { key: '智能客服', label: '智能客服' },
    { key: '办公助理', label: '办公助理' },
    { key: '编程开发', label: '编程开发' },
    { key: '营销推广', label: '营销推广' },
    { key: '教育培训', label: '教育培训' },
    { key: '行业垂直', label: '行业垂直' },
  ];

  const industries = [
    { key: 'all', label: '全部领域' },
    { key: '通用', label: '通用' },
    { key: '政务', label: '政务' },
    { key: '制造', label: '制造' },
    { key: '零售', label: '零售' },
    { key: '金融', label: '金融' },
    { key: '医疗', label: '医疗' },
    { key: '教育', label: '教育' },
    { key: '文旅', label: '文旅' },
    { key: '物流', label: '物流' },
    { key: '企业', label: '企业' },
  ];

  // Reset all filters
  const handleResetFilters = () => {
    setTechFormFilter('all');
    setSceneFilter('all');
    setIndustryFilter('all');
    setSearchQuery('');
  };

  const activeFiltersCount = 
    (techFormFilter !== 'all' ? 1 : 0) + 
    (sceneFilter !== 'all' ? 1 : 0) + 
    (industryFilter !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  // Filter and Search Logic
  const filteredAgents = agents.filter(a => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.name.toLowerCase().includes(q);
      const matchDesc = (a.description || '').toLowerCase().includes(q);
      const matchSlogan = (a.slogan || '').toLowerCase().includes(q);
      const matchTags = (a.tags || []).some(t => t.toLowerCase().includes(q));
      const matchDev = (a.developer || a.author || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchSlogan && !matchTags && !matchDev) return false;
    }

    // 2. Technical Form Filter
    if (techFormFilter !== 'all') {
      const formMatch = 
        a.techForm === techFormFilter || 
        a.appType === techFormFilter ||
        (techFormFilter === '工作流' && a.techForm === 'Workflow') ||
        (techFormFilter === '对话流' && a.techForm === 'Chatflow');
      if (!formMatch) return false;
    }

    // 3. Application Scene Filter
    if (sceneFilter !== 'all') {
      const hasScene = a.scene === sceneFilter;
      const hasCategoryTag = a.categoryTags && a.categoryTags.includes(sceneFilter);
      if (!hasScene && !hasCategoryTag) return false;
    }

    // 4. Industry Domain Filter
    if (industryFilter !== 'all') {
      const hasIndustry = a.industry === industryFilter;
      const hasIndustryTag = a.industryTags && a.industryTags.includes(industryFilter);
      if (!hasIndustry && !hasIndustryTag) return false;
    }

    return true;
  });

  // Sort
  filteredAgents.sort((a, b) => {
    if (sortOption === 'rating') return b.rating - a.rating;
    if (sortOption === 'usage') return (b.usageCount ?? 0) - (a.usageCount ?? 0);
    if (sortOption === 'latest') return new Date(b.createdAt || '2026-08-01').getTime() - new Date(a.createdAt || '2026-08-01').getTime();
    return 0; // Comprehensive
  });

  // Actions
  const handleFreeTrialClick = (agent: AgentItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (agent.id === 'ag_22' || agent.name.includes('企业客服') || agent.trialUrl) {
      const targetUrl = (agent.id === 'ag_22' || agent.name.includes('企业客服'))
        ? 'https://agent001-six.vercel.app/'
        : (agent.trialUrl || 'https://agent001-six.vercel.app/');
      showToast(`正在打开【${agent.name}】独立在线体验系统...`);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const trialUrl = `${window.location.origin}${window.location.pathname}?trial=${agent.id}`;
    window.open(trialUrl, '_blank');
  };

  const handleDetailClick = (agent: AgentItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedAgentForDetail(agent);
  };

  // Render SubPage if an agent is selected for details
  if (selectedAgentForDetail) {
    return (
      <AgentDetailSubPage
        agent={selectedAgentForDetail}
        onBack={() => setSelectedAgentForDetail(null)}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 select-none items-start">
      
      {/* 1. 左侧统一多维筛选侧边栏 (Standardized Left Filter Sidebar) */}
      <div className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200/80 p-4.5 shrink-0 space-y-5 text-xs shadow-2xs font-medium">
        
        {/* 侧边栏顶部标题与重置 */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>智能体筛选</span>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重置全部</span>
            </button>
          )}
        </div>

        {/* 1. 技术形态 Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>技术形态</span>
            </div>
            {techFormFilter !== 'all' && (
              <button 
                onClick={() => setTechFormFilter('all')} 
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600">
            {techForms.map(t => {
              const isActive = techFormFilter === t.key;
              const count = t.key === 'all' 
                ? agents.length 
                : agents.filter(a => a.techForm === t.key || a.appType === t.key || (t.key === '工作流' && a.techForm === 'Workflow')).length;

              return (
                <button
                  key={t.key}
                  onClick={() => setTechFormFilter(t.key)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    isActive 
                      ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{t.label}</span>
                  {isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* 2. 应用场景 Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-600" />
              <span>应用场景</span>
            </div>
            {sceneFilter !== 'all' && (
              <button 
                onClick={() => setSceneFilter('all')} 
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {appScenarios.map(s => {
              const isActive = sceneFilter === s.key;
              const count = s.key === 'all'
                ? agents.length
                : agents.filter(a => a.scene === s.key || (a.categoryTags && a.categoryTags.includes(s.key))).length;

              return (
                <button
                  key={s.key}
                  onClick={() => setSceneFilter(s.key)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    isActive 
                      ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{s.label}</span>
                  {isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* 3. 行业领域 Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>行业领域</span>
            </div>
            {industryFilter !== 'all' && (
              <button 
                onClick={() => setIndustryFilter('all')} 
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {industries.map(i => {
              const isActive = industryFilter === i.key;
              const count = i.key === 'all'
                ? agents.length
                : agents.filter(a => a.industry === i.key || (a.industryTags && a.industryTags.includes(i.key))).length;

              return (
                <button
                  key={i.key}
                  onClick={() => setIndustryFilter(i.key)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    isActive 
                      ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{i.label}</span>
                  {isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. 右侧主内容展示区 (Right Main Content Area) */}
      <div className="flex-1 space-y-5 w-full min-w-0">
        
        {/* Top Control Bar: Search Input, Sorter & Result Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索智能体名称、功能亮点、标签或开发者..."
              className="w-full pl-10 pr-14 py-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition cursor-pointer"
              >
                清空
              </button>
            )}
          </div>

          {/* Sorter & Counter */}
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold whitespace-nowrap">排序:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e: any) => setSortOption(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none hover:border-slate-300 hover:bg-white transition cursor-pointer appearance-none min-w-[110px]"
                >
                  <option value="comprehensive">综合排序</option>
                  <option value="rating">高分优先</option>
                  <option value="usage">最受欢迎</option>
                  <option value="latest">最新上线</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
              符合条件：<span className="text-indigo-600 font-extrabold font-mono text-sm">{filteredAgents.length}</span> 款
            </div>
          </div>

        </div>

        {/* Agent Cards Grid Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
          {filteredAgents.map(ag => {
            // Compute exact scenarios and industries to display
            const displayScenarios: string[] = 
              ag.categoryTags && ag.categoryTags.length > 0 
                ? ag.categoryTags 
                : (ag.scene ? [ag.scene] : []);

            const displayIndustries: string[] = 
              ag.industryTags && ag.industryTags.length > 0 
                ? ag.industryTags 
                : (ag.industry ? [ag.industry] : []);

            const freeTokensText = ag.freeTokenQuota 
              ? `${(ag.freeTokenQuota >= 10000 ? (ag.freeTokenQuota / 10000) + '万' : (ag.freeTokenQuota / 1000) + 'k')} Token 免费额度`
              : '5万 Token 免费额度';

            return (
              <div
                key={ag.id}
                onClick={() => setSelectedAgentForDetail(ag)}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-400 p-5 shadow-2xs hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Header Information */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                        {ag.avatar && ag.avatar.startsWith('http') ? (
                          <img src={ag.avatar} alt={ag.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{ag.avatar || '🤖'}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate flex items-center gap-1.5">
                          <span className="truncate">{ag.name}</span>
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shrink-0 flex items-center gap-0.5 shadow-2xs">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            {freeTokensText}
                          </span>
                        </h3>
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[11px] mt-0.5">
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{(ag.rating ?? 5.0).toFixed(1)}</span>
                          </div>
                          <span className="text-slate-300 font-normal">•</span>
                          <span className="text-slate-400 font-normal">({ag.ratingCount ?? 120})</span>
                          <span className="text-slate-300 font-normal">•</span>
                          <span className="text-indigo-600 font-extrabold">{(ag.callUsersCount ?? ag.subscribersCount ?? 128).toLocaleString()}人调用</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Combined Badges Line */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {/* Technical Form Tag */}
                    {ag.techForm && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100/70 whitespace-nowrap">
                        {ag.techForm}
                      </span>
                    )}

                    {/* Application Scenario Tags */}
                    {displayScenarios.map((sc, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-100/70 whitespace-nowrap">
                        {sc}
                      </span>
                    ))}

                    {/* Industry Domain Tags */}
                    {displayIndustries.map((ind, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/70 whitespace-nowrap">
                        {ind}
                      </span>
                    ))}
                  </div>

                  {/* Agent Slogan (一句话介绍) */}
                  <div className="text-xs font-semibold text-slate-700 leading-relaxed mb-4 pl-2 border-l-2 border-indigo-500 bg-slate-50/70 p-2 rounded-r-lg line-clamp-2 h-14">
                    {ag.slogan || ag.description?.slice(0, 45) || "极高阶人工智能自动化代理助手"}
                  </div>
                </div>

                {/* Action Buttons: [ 立即体验 ] 和 [ Agent详情 ] */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={(e) => handleFreeTrialClick(ag, e)}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-indigo-600" />
                    <span>立即体验</span>
                  </button>
                  
                  <button
                    onClick={(e) => handleDetailClick(ag, e)}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Agent详情</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {filteredAgents.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <Bot className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">没有找到符合条件的 Agent</h3>
            <p className="text-xs text-slate-400 mt-1">请尝试更换搜索词或筛选组合。</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition cursor-pointer"
            >
              清空所有筛选条件
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
