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

  // 状态 Badge 渲染
  const getStatusBadge = (status: CompetitionStatus) => {
    switch (status) {
      case 'ongoing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500 text-white shadow-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            进行中
          </span>
        );
      case 'unstarted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-white shadow-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            未开始
          </span>
        );
      case 'ended':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-500 text-white shadow-xs">
            已结束
          </span>
        );
    }
  };

  return (
    <div id="competition-center-container" className="w-full space-y-6 animate-fade-in pb-16 select-none font-sans">
      
      {/* Standard Unified Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
            <Trophy className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              赛事中心
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI 竞技场
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              汇聚全球顶尖 AI 算法赛、网安攻防对抗与 AIGC 创意竞技，海量真实行业数据集与专属 GPU 评测环境
            </p>
          </div>
        </div>
      </div>

      {/* 筛选与检索控制中心 */}
      <div id="competition-filter-card" className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        
        {/* 状态筛选 */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black text-slate-500 flex items-center gap-1.5 w-16 shrink-0">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>状 态：</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map(opt => {
              const isSelected = statusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`filter-status-${opt.value}`}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 赛事模式 (原赛道分类) */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
          <span className="text-xs font-black text-slate-500 flex items-center gap-1.5 w-16 shrink-0">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>赛事模式：</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {typeOptions.map(opt => {
              const isSelected = typeFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`filter-type-${opt.value}`}
                  onClick={() => setTypeFilter(opt.value)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 关键字搜索输入框与统计 */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="competition-search-input"
              type="text"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="搜索赛事名称、主办方或赛事介绍关键字..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          <div className="text-xs text-slate-500 font-mono">
            已检索到 <strong className="text-indigo-600 font-black">{filteredCompetitions.length}</strong> 场赛事
          </div>
        </div>

      </div>

      {/* 赛事列表展示网格 */}
      {filteredCompetitions.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-base font-black text-slate-800">暂无匹配的赛事</h3>
          <p className="text-xs text-slate-500">试着切换筛选条件或清除搜索关键字以查看全部赛事</p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setTypeFilter('all');
              setSearchKeyword('');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-xs hover:bg-indigo-100 transition cursor-pointer"
          >
            重置筛选
          </button>
        </div>
      ) : (
        <div id="competitions-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map(item => (
            <div
              key={item.id}
              id={`competition-card-${item.id}`}
              className="group relative rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* 赛事封面长图 */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/40 to-transparent" />
                  
                  {/* 状态徽标 */}
                  <div className="absolute top-3 left-3 z-10">
                    {getStatusBadge(item.status)}
                  </div>

                  {/* 包含的模式标签全部显示全 (不折叠+1、+2) */}
                  <div className="absolute top-3 right-3 z-10 flex flex-wrap gap-1 justify-end max-w-[240px]">
                    {item.typeTags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 底部主办方信息 */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0">
                        <Building2 className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold drop-shadow-sm line-clamp-1 text-slate-100">
                        {item.organizer}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 赛事核心信息区 */}
                <div className="p-5 space-y-3.5">
                  {/* 标题 */}
                  <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-1">
                    {item.title}
                  </h3>

                  {/* 赛事时间与点击量信息 */}
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">赛程：<strong className="text-slate-700 font-bold">{item.startTime?.split(' ')?.[0]} ~ {item.endTime?.split(' ')?.[0]}</strong></span>
                    </div>
                    {/* 浏览量显示 (仅图标 + 数字) */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium shrink-0 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100" title="浏览量">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-700 font-bold font-mono">{(item.viewsCount || 1280).toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* 赛事标签展示区 (后台添加赛事时自定义的关键词，如“机器学习”、“二分类”等相关技术) */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-lg text-[10.5px] font-semibold bg-slate-100/90 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 border border-slate-200/70 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 简介 */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-normal">
                    {item.introduction.summary}
                  </p>
                </div>
              </div>

              {/* 底部进入详情按钮 (统一外观) */}
              <div className="px-5 pb-5 pt-1">
                <button
                  id={`enter-competition-detail-btn-${item.id}`}
                  onClick={() => handleOpenDetail(item)}
                  className="w-full py-2.5 rounded-2xl text-xs font-black shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 bg-slate-900 group-hover:bg-indigo-600 text-white border border-transparent group-hover:shadow-md"
                >
                  <span>赛事详情</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
