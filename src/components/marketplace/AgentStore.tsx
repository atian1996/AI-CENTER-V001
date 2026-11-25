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
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start">
      
      {/* 1. 左侧统一多维筛选侧边栏（对齐培训认证极简风格：去蓝点/灰块，左侧 3px #1A1A1A 激活条，右侧浅灰数字） */}
      <aside className="w-full lg:w-[236px] shrink-0 space-y-6 text-[14px]">
        
        {/* 侧边栏顶部标题与重置 */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-light)]">
          <div className="flex items-center gap-2 text-[var(--text-main)] font-semibold text-[14px]">
            <SlidersHorizontal className="w-4 h-4 text-[var(--text-main)]" strokeWidth={1.6} />
            <span>智能体筛选</span>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重置全部</span>
            </button>
          )}
        </div>

        {/* 1. 技术形态 Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[var(--text-main)] font-semibold text-[13px] px-3">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--text-main)]" strokeWidth={1.6} />
              <span>技术形态</span>
            </div>
            {techFormFilter !== 'all' && (
              <button 
                onClick={() => setTechFormFilter('all')} 
                className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text-main)] font-normal cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-0.5">
            {techForms.map(t => {
              const isActive = techFormFilter === t.key;
              const count = t.key === 'all' 
                ? agents.length 
                : agents.filter(a => a.techForm === t.key || a.appType === t.key || (t.key === '工作流' && a.techForm === 'Workflow')).length;

              return (
                <button
                  key={t.key}
                  onClick={() => setTechFormFilter(t.key)}
                  className={`w-full h-[40px] text-left px-3 border-l-[3px] bg-transparent transition-colors cursor-pointer flex items-center justify-between text-[14px] ${
                    isActive 
                      ? 'border-[var(--border-dark)] text-[var(--text-main)] font-semibold' 
                      : 'border-transparent text-[var(--text-sub)] font-normal hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <span className="truncate">{t.label}</span>
                  <span className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-[var(--border-light)]"></div>

        {/* 2. 应用场景 Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[var(--text-main)] font-semibold text-[13px] px-3">
            <div className="flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-[var(--text-main)]" strokeWidth={1.6} />
              <span>应用场景</span>
            </div>
            {sceneFilter !== 'all' && (
              <button 
                onClick={() => setSceneFilter('all')} 
                className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text-main)] font-normal cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {appScenarios.map(s => {
              const isActive = sceneFilter === s.key;
              const count = s.key === 'all'
                ? agents.length
                : agents.filter(a => a.scene === s.key || (a.categoryTags && a.categoryTags.includes(s.key))).length;

              return (
                <button
                  key={s.key}
                  onClick={() => setSceneFilter(s.key)}
                  className={`w-full h-[40px] text-left px-3 border-l-[3px] bg-transparent transition-colors cursor-pointer flex items-center justify-between text-[14px] ${
                    isActive 
                      ? 'border-[var(--border-dark)] text-[var(--text-main)] font-semibold' 
                      : 'border-transparent text-[var(--text-sub)] font-normal hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <span className="truncate">{s.label}</span>
                  <span className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-[var(--border-light)]"></div>

        {/* 3. 行业领域 Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[var(--text-main)] font-semibold text-[13px] px-3">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[var(--text-main)]" strokeWidth={1.6} />
              <span>行业领域</span>
            </div>
            {industryFilter !== 'all' && (
              <button 
                onClick={() => setIndustryFilter('all')} 
                className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text-main)] font-normal cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {industries.map(i => {
              const isActive = industryFilter === i.key;
              const count = i.key === 'all'
                ? agents.length
                : agents.filter(a => a.industry === i.key || (a.industryTags && a.industryTags.includes(i.key))).length;

              return (
                <button
                  key={i.key}
                  onClick={() => setIndustryFilter(i.key)}
                  className={`w-full h-[40px] text-left px-3 border-l-[3px] bg-transparent transition-colors cursor-pointer flex items-center justify-between text-[14px] ${
                    isActive 
                      ? 'border-[var(--border-dark)] text-[var(--text-main)] font-semibold' 
                      : 'border-transparent text-[var(--text-sub)] font-normal hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <span className="truncate">{i.label}</span>
                  <span className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

      </aside>

      {/* 2. 右侧主内容展示区 (Right Main Content Area) */}
      <div className="flex-1 space-y-5 w-full min-w-0">
        
        {/* Top Control Bar: Search Input, Sorter & Result Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--bg-card)] p-3 rounded-[6px] border border-[var(--border-light)]">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索智能体名称"
              className="w-full pl-10 pr-14 py-2 bg-[var(--bg-page)] hover:bg-[var(--bg-hover)] border border-[var(--border-light)] rounded-[4px] text-[13px] font-normal text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--border-dark)] focus:bg-[var(--bg-card)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              >
                清空
              </button>
            )}
          </div>

          {/* Sorter & Counter */}
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[var(--text-muted)] whitespace-nowrap">排序:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e: any) => setSortOption(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-transparent border border-[var(--border-light)] rounded-[4px] text-[12px] font-medium text-[var(--text-main)] outline-none hover:border-[var(--border-dark)] transition-colors cursor-pointer appearance-none min-w-[110px]"
                >
                  <option value="comprehensive">综合排序</option>
                  <option value="rating">高分优先</option>
                  <option value="usage">最受欢迎</option>
                  <option value="latest">最新上线</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              </div>
            </div>

            <div className="h-4 w-px bg-[var(--border-light)] hidden sm:block"></div>

            <div className="text-[12px] text-[var(--text-sub)] whitespace-nowrap">
              符合条件：<span className="text-[var(--text-main)] font-semibold tabular-nums">{filteredAgents.length}</span> 款
            </div>
          </div>

        </div>

        {/* Agent Cards Grid Matrix — 去除外边框与阴影，纯白卡片依托极浅灰大背景显现，内边距 24px，间距 20px */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAgents.map(ag => {
            const displayScenarios: string[] = 
              ag.categoryTags && ag.categoryTags.length > 0 
                ? ag.categoryTags 
                : (ag.scene ? [ag.scene] : []);

            const displayIndustries: string[] = 
              ag.industryTags && ag.industryTags.length > 0 
                ? ag.industryTags 
                : (ag.industry ? [ag.industry] : []);

            const freeAmount = ag.freeQuotaAmount !== undefined 
              ? ag.freeQuotaAmount 
              : (ag.freeTokenQuota ? ag.freeTokenQuota * 0.5 : 5.0);
            const freeQuotaText = freeAmount > 0 
              ? `¥${freeAmount.toFixed(freeAmount % 1 === 0 ? 0 : 2)} 免费额度` 
              : '按量计费';

            return (
              <div
                key={ag.id}
                onClick={() => setSelectedAgentForDetail(ag)}
                className="group bg-[var(--bg-card)] rounded-[6px] border-0 p-6 transition-colors hover:bg-[#FCFCFD] flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Header Information */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-[6px] bg-[var(--bg-hover)] border border-[var(--border-light)] flex items-center justify-center text-lg shrink-0 overflow-hidden">
                      {ag.avatar && ag.avatar.startsWith('http') ? (
                        <img src={ag.avatar} alt={ag.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{ag.avatar || '🤖'}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[16px] font-semibold text-[var(--text-main)] truncate leading-snug">
                          {ag.name}
                        </h3>
                      </div>
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[12px] text-[var(--text-sub)] mt-1 tabular-nums">
                        <span className="inline-flex items-center gap-1 text-[var(--text-main)] font-medium">
                          <Star className="w-3.5 h-3.5 text-[var(--text-main)] fill-[var(--text-main)]" />
                          <span>{(ag.rating ?? 5.0).toFixed(1)}</span>
                        </span>
                        <span className="text-[var(--text-muted)]">({ag.ratingCount ?? 120})</span>
                        <span className="text-[var(--border-light)]">·</span>
                        <span>{(ag.callUsersCount ?? ag.subscribersCount ?? 128).toLocaleString()}人调用</span>
                      </div>
                    </div>
                  </div>

                  {/* Unified Minimalist Outline Tags (去蓝绿底色，统一透明细边框) */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal bg-transparent text-[var(--text-sub)] border border-[var(--border-light)] whitespace-nowrap">
                      {freeQuotaText}
                    </span>

                    {ag.techForm && (
                      <span className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal bg-transparent text-[var(--text-sub)] border border-[var(--border-light)] whitespace-nowrap">
                        {ag.techForm}
                      </span>
                    )}

                    {displayScenarios.map((sc, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal bg-transparent text-[var(--text-sub)] border border-[var(--border-light)] whitespace-nowrap">
                        {sc}
                      </span>
                    ))}

                    {displayIndustries.map((ind, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal bg-transparent text-[var(--text-sub)] border border-[var(--border-light)] whitespace-nowrap">
                        {ind}
                      </span>
                    ))}
                  </div>

                  {/* Agent Slogan (左对齐极简描述，去除左侧彩条与灰底块) */}
                  <p className="text-[14px] font-normal text-[var(--text-sub)] leading-[1.6] mb-5 line-clamp-2 min-h-[44px]">
                    {ag.slogan || ag.description?.slice(0, 45) || "极高阶人工智能自动化代理助手"}
                  </p>
                </div>

                {/* Action Buttons: 等宽两列，左线框次按钮 + 右纯黑主按钮 */}
                <div className="pt-4 border-t border-[var(--border-light)] grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => handleFreeTrialClick(ag, e)}
                    className="py-2 px-3 rounded-[4px] bg-transparent border border-[var(--border-light)] hover:border-[var(--border-dark)] text-[var(--text-main)] text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 text-[var(--text-main)]" strokeWidth={1.8} />
                    <span>立即体验</span>
                  </button>
                  
                  <button
                    onClick={(e) => handleDetailClick(ag, e)}
                    className="py-2 px-3 rounded-[4px] bg-[var(--text-main)] hover:opacity-80 text-[#FFFFFF] text-[13px] font-medium transition-opacity flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>Agent详情</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {filteredAgents.length === 0 && (
          <div className="p-12 text-center bg-[var(--bg-card)] rounded-[6px] border border-[var(--border-light)]">
            <Bot className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="text-[16px] font-semibold text-[var(--text-main)]">没有找到符合条件的 Agent</h3>
            <p className="text-[14px] text-[var(--text-sub)] mt-1">请尝试更换搜索词或筛选组合。</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-[4px] bg-[var(--brand-color)] text-[#FFFFFF] text-[13px] font-medium hover:opacity-80 transition-opacity cursor-pointer"
            >
              清空所有筛选条件
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
