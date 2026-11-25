import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CompetitionItem, CompetitionStatus, CompetitionTypeTag } from '../../types';
import { CompetitionDetailView } from './CompetitionDetailView';
import { 
  Trophy, 
  Search, 
  Calendar, 
  Building2, 
  Layers, 
  ArrowRight, 
  Clock, 
  Filter,
  Eye,
  Tag
} from 'lucide-react';

export const CreativeView: React.FC = () => {
  const { 
    competitions, 
    selectedCompetitionId, 
    setSelectedCompetitionId, 
    showToast 
  } = useApp();

  // 筛选状态
  const [statusFilter, setStatusFilter] = useState<CompetitionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CompetitionTypeTag | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // 状态选项
  const statusOptions: { value: CompetitionStatus | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'unstarted', label: '未开始' },
    { value: 'ongoing', label: '进行中' },
    { value: 'ended', label: '已结束' },
  ];

  // 赛事模式选项
  const typeOptions: { value: CompetitionTypeTag | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'AI数据科学赛', label: 'AI数据科学赛' },
    { value: 'AI安全挑战赛', label: 'AI安全挑战赛' },
    { value: 'AIGC生成赛', label: 'AIGC生成赛' },
    { value: 'AI产品创新赛', label: 'AI产品创新赛' },
  ];

  // 过滤后的赛事列表
  const filteredCompetitions = useMemo(() => {
    return competitions.filter(item => {
      // 状态筛选
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // 赛事模式筛选 (包含任意一个匹配标签)
      if (typeFilter !== 'all' && !item.typeTags.includes(typeFilter as CompetitionTypeTag)) {
        return false;
      }
      // 关键字搜索 (标题、主办方、简介、标签)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(kw);
        const matchOrg = item.organizer.toLowerCase().includes(kw);
        const matchSummary = item.introduction.summary.toLowerCase().includes(kw);
        const matchTags = item.tags?.some(t => t.toLowerCase().includes(kw)) || false;
        if (!matchTitle && !matchOrg && !matchSummary && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [competitions, statusFilter, typeFilter, searchKeyword]);

  // 点击查看详情处理
  const handleOpenDetail = (item: CompetitionItem) => {
    if (item.isInternalOnly) {
      showToast('该赛事为企业内部定向赛事，暂未开放公开详情访问。');
      return;
    }
    setSelectedCompetitionId(item.id);
  };

  // 获取当前查看详情的赛事
  const selectedCompetition = useMemo(() => {
    if (!selectedCompetitionId) return null;
    return competitions.find(c => c.id === selectedCompetitionId) || null;
  }, [competitions, selectedCompetitionId]);

  // 如果处于详情模式，直接渲染详情视图
  if (selectedCompetition) {
    return (
      <CompetitionDetailView 
        competition={selectedCompetition} 
        onBack={() => setSelectedCompetitionId(null)} 
      />
    );
  }

  // 状态 Badge 渲染 — 黑白灰极简体系：半透明黑底 + 白字 + 白色细边框
  const getStatusBadge = (status: CompetitionStatus) => {
    switch (status) {
      case 'ongoing':
        return (
          <span className="px-2.5 py-1 rounded-[4px] text-[12px] font-medium bg-black/60 text-[#FFFFFF] border border-white/40 inline-flex items-center gap-1">
            进行中
          </span>
        );
      case 'unstarted':
        return (
          <span className="px-2.5 py-1 rounded-[4px] text-[12px] font-medium bg-black/60 text-[#FFFFFF] border border-white/40 inline-flex items-center gap-1">
            未开始
          </span>
        );
      case 'ended':
        return (
          <span className="px-2.5 py-1 rounded-[4px] text-[12px] font-medium bg-black/60 text-[#FFFFFF]/80 border border-white/30 inline-flex items-center gap-1">
            已结束
          </span>
        );
    }
  };

  return (
    <div id="competition-center-container" className="w-full max-w-[1320px] mx-auto space-y-6 animate-fade-in pb-16 pt-2 select-none antialiased">
      
      {/* Unified Page Header */}
      <header className="pb-8 border-b border-[var(--border-light)]">
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[var(--text-main)] leading-tight">
            AI 算法与安全竞技场
          </h1>
          <p className="text-[14px] text-[var(--text-sub)] leading-[1.6]">
            汇聚全球顶尖极客，共逐前沿技术高峰。基于真实产业数据与高能算力底座，打造极具含金量的 AI 实战竞技与评测平台。
          </p>
        </div>
      </header>

      {/* 筛选与检索控制中心 */}
      <div id="competition-filter-card" className="bg-[var(--bg-card)] rounded-[6px] border border-[var(--border-light)] p-6 space-y-4">
        
        {/* 状态筛选 */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[12px] font-semibold text-[var(--text-sub)] flex items-center gap-1.5 w-20 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[var(--text-main)]" strokeWidth={1.6} />
            <span>状 态</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map(opt => {
              const isSelected = statusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`filter-status-${opt.value}`}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-3.5 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-[var(--text-main)] text-[#FFFFFF] border-[var(--text-main)]'
                      : 'bg-transparent text-[var(--text-sub)] border-[var(--border-light)] hover:border-[var(--border-dark)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 赛事模式 */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--border-light)]">
          <span className="text-[12px] font-semibold text-[var(--text-sub)] flex items-center gap-1.5 w-20 shrink-0">
            <Layers className="w-3.5 h-3.5 text-[var(--text-main)]" strokeWidth={1.6} />
            <span>赛事模式</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {typeOptions.map(opt => {
              const isSelected = typeFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`filter-type-${opt.value}`}
                  onClick={() => setTypeFilter(opt.value)}
                  className={`px-3.5 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-[var(--text-main)] text-[#FFFFFF] border-[var(--text-main)]'
                      : 'bg-transparent text-[var(--text-sub)] border-[var(--border-light)] hover:border-[var(--border-dark)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 关键字搜索输入框与统计 */}
        <div className="pt-3 border-t border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.6} />
            <input
              id="competition-search-input"
              type="text"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="搜索赛事名称、主办方或赛事介绍关键字..."
              className="w-full pl-10 pr-4 py-2 rounded-[4px] bg-[var(--bg-page)] border border-[var(--border-light)] text-[13px] font-normal text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:bg-[var(--bg-card)] focus:border-[var(--border-dark)] focus:outline-none transition-colors"
            />
          </div>

          <div className="text-[12px] text-[var(--text-sub)] tabular-nums">
            已检索到 <strong className="text-[var(--text-main)] font-semibold">{filteredCompetitions.length}</strong> 场赛事
          </div>
        </div>

      </div>

      {/* 赛事列表展示网格 */}
      {filteredCompetitions.length === 0 ? (
        <div className="p-16 text-center bg-[var(--bg-card)] rounded-[6px] border border-[var(--border-light)] space-y-3">
          <div className="w-12 h-12 rounded-[6px] bg-[var(--bg-hover)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6" strokeWidth={1.6} />
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--text-main)]">暂无匹配的赛事</h3>
          <p className="text-[14px] text-[var(--text-sub)]">试着切换筛选条件或清除搜索关键字以查看全部赛事</p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setTypeFilter('all');
              setSearchKeyword('');
            }}
            className="px-4 py-2 rounded-[4px] bg-[var(--brand-color)] text-[#FFFFFF] font-medium text-[13px] hover:opacity-80 transition-opacity cursor-pointer"
          >
            重置筛选
          </button>
        </div>
      ) : (
        <div id="competitions-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompetitions.map(item => (
            <div
              key={item.id}
              id={`competition-card-${item.id}`}
              className="group relative rounded-[6px] bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--border-dark)] overflow-hidden transition-colors flex flex-col justify-between"
            >
              <div>
                {/* 赛事封面长图 + 统一深色蒙版 rgba(0, 0, 0, 0.65) + 20px 纯白标题 */}
                <div className="relative h-48 w-full overflow-hidden bg-[#1A1A1A]">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* 统一深色半透明蒙版，确保白色文字高对比度清晰可读 */}
                  <div className="absolute inset-0 bg-black/65" />
                  
                  {/* 左上角状态标签（去彩色胶囊，统一半透明黑底+白字+细白边框） */}
                  <div className="absolute top-4 left-4 z-10">
                    {getStatusBadge(item.status)}
                  </div>

                  {/* 蒙版内部：纯白 20px 赛事标题 + 主办方信息 */}
                  <div className="absolute inset-x-4 bottom-4 z-10 space-y-2">
                    <h3 className="text-[20px] font-semibold text-[#FFFFFF] leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-white/75">
                      <Building2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
                      <span className="truncate">{item.organizer}</span>
                    </div>
                  </div>
                </div>

                {/* 赛事核心信息区（将原封面右上角模式标签收纳至此，作为极简描边标签展示） */}
                <div className="p-6 space-y-4">
                  {/* 赛事模式与自定义标签 */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.typeTags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal bg-transparent text-[var(--text-main)] border border-[var(--border-dark)]"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags && item.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal bg-transparent text-[var(--text-sub)] border border-[var(--border-light)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 赛事时间与浏览量 */}
                  <div className="flex items-center justify-between text-[12px] text-[var(--text-sub)] gap-2 tabular-nums">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-[var(--text-main)] shrink-0" strokeWidth={1.6} />
                      <span className="truncate">
                        {item.startTime?.split(' ')?.[0]} ~ {item.endTime?.split(' ')?.[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-[var(--text-sub)]" title="浏览量">
                      <Eye className="w-3.5 h-3.5 text-[var(--text-main)]" strokeWidth={1.6} />
                      <span>{(item.viewsCount || 1280).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* 简介 */}
                  <p className="text-[14px] text-[var(--text-sub)] leading-[1.6] line-clamp-2 font-normal">
                    {item.introduction.summary}
                  </p>
                </div>
              </div>

              {/* 底部进入详情按钮 */}
              <div className="px-6 pb-6 pt-0">
                <button
                  id={`enter-competition-detail-btn-${item.id}`}
                  onClick={() => handleOpenDetail(item)}
                  className="w-full py-2.5 rounded-[4px] text-[13px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-opacity bg-[var(--text-main)] hover:opacity-80 text-[#FFFFFF]"
                >
                  <span>赛事详情</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
