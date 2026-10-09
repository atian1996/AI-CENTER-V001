import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillPluginItem } from '../../types';
import { SkillDetail } from './SkillDetail';
import { UserSkillCreateForm } from './UserSkillCreateForm';
import {
  Download,
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  Check,
  CheckCircle2,
  KeyRound,
  FileText,
  TrendingUp,
  Sparkles,
  Zap,
  BarChart3,
  BookOpen,
  Code2,
  Palette,
  Briefcase,
  Bot,
  RotateCcw,
  SlidersHorizontal,
  Layers,
  ShieldCheck,
  Tag,
  Plus,
  User,
  Wrench
} from 'lucide-react';

export const SkillMarket: React.FC = () => {
  const { skills, showToast, downloadSkill } = useApp();

  // Navigation: Selected Skill for Detail View / Create View
  const [selectedSkill, setSelectedSkill] = useState<SkillPluginItem | null>(null);
  const [isCreatingSkill, setIsCreatingSkill] = useState<boolean>(false);

  // Top Sort Tabs: 'all' | 'downloads' | 'latest'
  const [sortTab, setSortTab] = useState<'all' | 'downloads' | 'latest'>('all');

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('所有场景分类');

  // Search & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter options
  const categories = [
    '所有场景分类',
    '知识管理',
    '效率工具',
    '数据分析',
    '内容创作',
    '编程开发',
    '图像影音',
    '生活娱乐'
  ];

  const handleResetFilters = () => {
    setSelectedCategory('所有场景分类');
    setSearchQuery('');
  };

  const activeFiltersCount = 
    (selectedCategory !== '所有场景分类' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  // Helper to format download count (e.g. 223000 -> 22.3 万)
  const formatCount = (num?: number) => {
    if (!num) return '0';
    if (num >= 10000) {
      return (num / 10000).toFixed(1).replace(/\.0$/, '') + ' 万';
    }
    return num.toLocaleString();
  };

  // Helper for brand/icon colors
  const getSkillIcon = (sk: SkillPluginItem) => {
    if (sk.name.includes('股票') || sk.id.includes('valuation')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-xs">
          <div className="w-5 h-5 rounded-full border-4 border-amber-600 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          </div>
        </div>
      );
    }
    if (sk.name.includes('ima') || sk.id.includes('ima')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
      );
    }
    if (sk.name.includes('腾讯文档') || sk.id.includes('tencent_docs')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
      );
    }
    if (sk.name.includes('腾讯云') || sk.id.includes('cloudbase')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-xs">
          <Code2 className="w-5 h-5" />
        </div>
      );
    }
    if (sk.name.includes('金融') || sk.category === '数据分析') {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
          <BarChart3 className="w-5 h-5" />
        </div>
      );
    }
    if (sk.category === '内容创作') {
      return (
        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
      );
    }
    if (sk.category === '设计多媒体') {
      return (
        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs">
          <Palette className="w-5 h-5" />
        </div>
      );
    }
    if (sk.category === '知识管理') {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
          <BookOpen className="w-5 h-5" />
        </div>
      );
    }
    if (sk.category === 'AI Agent') {
      return (
        <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shadow-xs">
          <Bot className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs">
        <Zap className="w-5 h-5 text-indigo-600" />
      </div>
    );
  };

  // Filtered skills
  const filteredSkills = skills.filter(item => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchDev = item.developer.toLowerCase().includes(q);
      const matchRepo = item.repoPath?.toLowerCase().includes(q) ?? false;
      const matchTags = item.tags?.some(t => t.toLowerCase().includes(q)) ?? false;
      if (!matchName && !matchDesc && !matchDev && !matchRepo && !matchTags) {
        return false;
      }
    }

    // 2. Category Filter
    if (selectedCategory !== '所有场景分类' && item.category !== selectedCategory) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortTab === 'downloads') {
      return (b.downloadsCount || b.installs) - (a.downloadsCount || a.installs);
    }
    if (sortTab === 'latest') {
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    }
    // 'all' default recommendation
    return (b.downloadsCount || b.installs) - (a.downloadsCount || a.installs);
  });

  // Download Handler
  const handleDownloadSkill = (e: React.MouseEvent, item: SkillPluginItem) => {
    e.stopPropagation();
    downloadSkill(item);
  };

  // If Create Subpage is active, render UserSkillCreateForm
  if (isCreatingSkill) {
    return (
      <UserSkillCreateForm onBack={() => setIsCreatingSkill(false)} />
    );
  }

  // If a skill is selected, render the Detail View
  if (selectedSkill) {
    return (
      <SkillDetail
        skill={selectedSkill}
        onBack={() => setSelectedSkill(null)}
      />
    );
  }

  return (
    <div className="space-y-4 select-none">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
      
      {/* 1. 左侧统一多维筛选侧边栏 (Standardized Left Filter Sidebar) */}
      <div className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200/80 p-4.5 shrink-0 space-y-5 text-xs shadow-2xs font-medium">
        
        {/* 侧边栏顶部标题与重置 */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Skill 插件筛选</span>
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

        {/* 1. 场景分类 Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>场景分类</span>
            </div>
            {selectedCategory !== '所有场景分类' && (
              <button 
                onClick={() => setSelectedCategory('所有场景分类')} 
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600">
            {categories.map(cat => {
              const isActive = selectedCategory === cat;
              const count = cat === '所有场景分类'
                ? skills.length
                : skills.filter(s => s.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    isActive 
                      ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{cat === '所有场景分类' ? '全部分类' : cat}</span>
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

      {/* 2. 右侧主内容展示区 (Right Main Area) */}
      <div className="flex-1 space-y-5 w-full min-w-0">
        
        {/* Top Control Bar: Search Box + Sort Tabs + View Switcher + Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索 Skill 插件名称、开发者、功能或标签..."
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

          {/* Sorter Tabs, View Mode & Counter */}
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Sort Switcher */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl">
              <button
                onClick={() => setSortTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  sortTab === 'all'
                    ? 'bg-white text-indigo-600 shadow-3xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                综合推荐
              </button>
              <button
                onClick={() => setSortTab('downloads')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  sortTab === 'downloads'
                    ? 'bg-white text-indigo-600 shadow-3xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                按下载量
              </button>
              <button
                onClick={() => setSortTab('latest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  sortTab === 'latest'
                    ? 'bg-white text-indigo-600 shadow-3xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                最新上架
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            {/* View Mode Toggle: Grid & List */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="网格视图"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="列表视图"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 创建 Skill 按钮 */}
            <button
              onClick={() => setIsCreatingSkill(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-xs hover:shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>创建 Skill</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            <div className="text-xs text-slate-500 font-medium whitespace-nowrap px-1">
              符合条件：<span className="text-indigo-600 font-extrabold font-mono text-sm">{filteredSkills.length}</span> 款
            </div>
          </div>

        </div>

        {/* Skill Card Grid / List */}
        {filteredSkills.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">未找到符合条件的 Skill 插件</h3>
            <p className="text-xs text-slate-400">尝试清空筛选条件或更换搜索关键词</p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition cursor-pointer mx-auto"
            >
              清空所有筛选条件
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
            {filteredSkills.map(sk => (
              <div
                key={sk.id}
                onClick={() => setSelectedSkill(sk)}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between cursor-pointer group space-y-3.5"
              >
                {/* Card Header: Icon, Title, Badges, Category */}
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    {/* Brand Icon */}
                    <div className="shrink-0 group-hover:scale-105 transition-transform">
                      {getSkillIcon(sk)}
                    </div>

                    {/* Title and Category Badges */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {sk.name}
                        </h3>
                        {sk.isOfficial && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="#3b82f6" stroke="#ffffff" />
                        )}
                      </div>

                      {/* Badge Chips & Uploader */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {sk.category}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          sk.uploaderType === 'platform' || sk.isOfficial
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {sk.uploaderType === 'platform' || sk.isOfficial ? <ShieldCheck className="w-3 h-3 text-blue-600" /> : <User className="w-3 h-3 text-amber-600" />}
                          <span>{sk.uploaderType === 'platform' || sk.isOfficial ? '平台管理' : (sk.uploaderName || sk.developer || '用户上传')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-3 min-h-[48px]">
                    {sk.description}
                  </p>
                </div>

                {/* Card Footer: Downloads and ONLY Download Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  
                  {/* Meta stats: Downloads */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Download className="w-3 h-3 text-slate-400" />
                      {formatCount(sk.downloadsCount || sk.installs)}
                    </span>
                  </div>

                  {/* Download Action Button on Card */}
                  <button
                    onClick={e => handleDownloadSkill(e, sk)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer shrink-0"
                  >
                    <Download className="w-3 h-3" />
                    <span>下载</span>
                  </button>

                </div>
              </div>
            ))}
          </div>

        ) : (

          /* List Layout */
          <div className="space-y-2.5">
            {filteredSkills.map(sk => (
              <div
                key={sk.id}
                onClick={() => setSelectedSkill(sk)}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 group-hover:scale-105 transition-transform">
                    {getSkillIcon(sk)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {sk.name}
                      </h3>
                      {sk.isOfficial && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="#3b82f6" stroke="#ffffff" />
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {sk.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {sk.description}
                    </p>
                  </div>
                </div>

                {/* List item right side */}
                <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Download className="w-3 h-3 text-slate-400" />
                      {formatCount(sk.downloadsCount || sk.installs)}
                    </span>
                  </div>

                  {/* Download Action Button on Card */}
                  <button
                    onClick={e => handleDownloadSkill(e, sk)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下载</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        )}

      </div>

    </div>
  </div>
);
};
