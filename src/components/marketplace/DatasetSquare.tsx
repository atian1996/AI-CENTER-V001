import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DatasetItem } from '../../types';
import { DatasetDetail } from './DatasetDetail';
import { UserDatasetUploadForm } from './UserDatasetUploadForm';
import { 
  Database, 
  Download, 
  Eye, 
  Search, 
  Grid, 
  List, 
  Layers, 
  SlidersHorizontal, 
  ChevronRight, 
  RotateCcw, 
  ChevronDown,
  FileSpreadsheet,
  Building2,
  Tag,
  Clock,
  Plus,
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const DatasetSquare: React.FC = () => {
  const { datasets, datasetTagDimensions } = useApp();

  // Selected dataset for viewing details
  const [activeDetailDataset, setActiveDetailDataset] = useState<DatasetItem | null>(null);
  const [isUploadingDataset, setIsUploadingDataset] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter Categories directly driven by backend datasetTagDimensions
  const modalityList = [
    { key: 'all', label: '全部模态' },
    ...(datasetTagDimensions?.modality || ['表格数据', '计算机视觉', '自然语言处理', '多模态', '音频']).map(m => ({ key: m, label: m }))
  ];

  const taskTypeList = [
    { key: 'all', label: '全部任务' },
    ...(datasetTagDimensions?.taskType || ['分类任务', '回归预测', '时间序列预测', '物体检测', '图像分类', '文本生成', '问答']).map(t => ({ key: t, label: t }))
  ];

  const domainList = [
    { key: 'all', label: '全部领域' },
    ...(datasetTagDimensions?.domain || ['商业/管理', '金融科技', '医疗健康', '科技互联网', '地球气象', '教育科学']).map(d => ({ key: d, label: d }))
  ];

  const formatList = [
    { key: 'all', label: '全部格式' },
    ...(datasetTagDimensions?.format || ['CSV/XLSX', 'JSON/JSONL', 'NC/GeoTIFF', 'PNG/JPG', 'Parquet', 'TXT/ZIP']).map(f => ({ key: f, label: f }))
  ];

  const handleResetFilters = () => {
    setSelectedModality('all');
    setSelectedTaskType('all');
    setSelectedDomain('all');
    setSelectedFormat('all');
    setSearchQuery('');
  };

  const activeFiltersCount = 
    (selectedModality !== 'all' ? 1 : 0) + 
    (selectedTaskType !== 'all' ? 1 : 0) + 
    (selectedDomain !== 'all' ? 1 : 0) + 
    (selectedFormat !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  // Filtering Logic - only published datasets in square
  const publishedDatasets = datasets.filter(ds => ds.status !== '已下架' && ds.status !== '草稿');

  const filteredDatasets = publishedDatasets.filter(ds => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ds.name.toLowerCase().includes(q);
      const matchBrief = (ds.brief || '').toLowerCase().includes(q);
      const matchDesc = (ds.description || '').toLowerCase().includes(q);
      const matchTags = (ds.domains || ds.domainTags || []).some(t => t.toLowerCase().includes(q));
      const matchModality = (ds.modalities || [ds.modalityCategory]).some(m => (m || '').toLowerCase().includes(q));
      const matchTask = (ds.taskTypes || [ds.taskType]).some(t => (t || '').toLowerCase().includes(q));
      const matchFormat = (ds.formats || [ds.fileFormats || ds.format]).some(f => (f || '').toLowerCase().includes(q));
      if (!matchName && !matchBrief && !matchDesc && !matchTags && !matchModality && !matchTask && !matchFormat) return false;
    }

    // Modality filter
    if (selectedModality !== 'all') {
      const mods = ds.modalities || (ds.modalityCategory ? [ds.modalityCategory] : []);
      const matched = mods.some(m => m === selectedModality || (selectedModality === '表格数据' && m === '表格'));
      if (!matched) return false;
    }

    // Task Type filter
    if (selectedTaskType !== 'all') {
      const tasks = ds.taskTypes || (ds.taskType ? [ds.taskType] : []);
      const matched = tasks.some(t => t === selectedTaskType || t?.includes(selectedTaskType) || selectedTaskType?.includes(t));
      if (!matched) return false;
    }

    // Domain filter
    if (selectedDomain !== 'all') {
      const domains = ds.domains || ds.domainTags || (ds.theme ? [ds.theme] : []);
      const matched = domains.some(d => d === selectedDomain || d?.includes(selectedDomain) || selectedDomain?.includes(d));
      if (!matched) return false;
    }

    // Format filter
    if (selectedFormat !== 'all') {
      const formats = ds.formats || (ds.fileFormats ? ds.fileFormats.split(/[,/]/).map(s => s.trim()) : ds.format ? [ds.format] : []);
      const matched = formats.some(f => f.toUpperCase().includes(selectedFormat.toUpperCase()) || selectedFormat.toUpperCase().includes(f.toUpperCase()));
      if (!matched) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'updated') return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    if (sortBy === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0);
    if (sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
    return 0;
  });

  // If Upload Subpage is active, render UserDatasetUploadForm
  if (isUploadingDataset) {
    return (
      <UserDatasetUploadForm onBack={() => setIsUploadingDataset(false)} />
    );
  }

  // If Detail View is active, render Detail Component directly
  if (activeDetailDataset) {
    return (
      <DatasetDetail 
        dataset={activeDetailDataset} 
        onBack={() => setActiveDetailDataset(null)} 
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
            <span>数据集多维筛选</span>
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

        {/* 1. 数据模态 Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>数据模态</span>
            </div>
            {selectedModality !== 'all' && (
              <button 
                onClick={() => setSelectedModality('all')} 
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600">
            {modalityList.map(item => {
              const isActive = selectedModality === item.key;
              const count = item.key === 'all'
                ? publishedDatasets.length
                : publishedDatasets.filter(d => {
                    const mods = d.modalities || (d.modalityCategory ? [d.modalityCategory] : []);
                    return mods.some(m => m === item.key || (item.key === '表格数据' && m === '表格'));
                  }).length;

              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedModality(item.key)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    isActive 
                      ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{item.label}</span>
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

        {/* 2. 任务类型 Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              <span>任务类型</span>
            </div>
            {selectedTaskType !== 'all' && (
              <button 
                onClick={() => setSelectedTaskType('all')} 
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {taskTypeList.map(item => {
              const isActive = selectedTaskType === item.key;
              const count = item.key === 'all'
                ? publishedDatasets.length
                : publishedDatasets.filter(d => {
                    const tasks = d.taskTypes || (d.taskType ? [d.taskType] : []);
                    return tasks.some(t => t === item.key || t?.includes(item.key));
                  }).length;

              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedTaskType(item.key)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    isActive 
                      ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
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
              <Building2 className="w-3.5 h-3.5 text-purple-500" />
              <span>行业领域</span>
            </div>
            {selectedDomain !== 'all' && (
              <button 
                onClick={() => setSelectedDomain('all')} 
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {domainList.map(item => {
              const isActive = selectedDomain === item.key;
              const count = item.key === 'all'
                ? publishedDatasets.length
                : publishedDatasets.filter(d => {
                    const domains = d.domains || d.domainTags || (d.theme ? [d.theme] : []);
                    return domains.some(dom => dom === item.key || dom?.includes(item.key));
                  }).length;

              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedDomain(item.key)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    isActive 
                      ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
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

        {/* 4. 文件格式 Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-600" />
              <span>文件格式</span>
            </div>
            {selectedFormat !== 'all' && (
              <button 
                onClick={() => setSelectedFormat('all')} 
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600">
            {formatList.map(item => {
              const isActive = selectedFormat === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedFormat(item.key)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    isActive 
                      ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. 右侧主内容展示区 (Right Main Content Area) */}
      <div className="flex-1 space-y-5 w-full min-w-0">
        
        {/* Top Control Bar: Search Box + Sort + View Mode + Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索数据集名称、简介、格式、任务类型、领域标签..."
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

          {/* Sorter, View Switcher & Counter */}
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* 排序下拉 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold whitespace-nowrap">排序:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none hover:border-slate-300 hover:bg-white transition cursor-pointer appearance-none min-w-[105px]"
                >
                  <option value="recommended">推荐排序</option>
                  <option value="downloads">下载最多</option>
                  <option value="views">访问最多</option>
                  <option value="updated">最新更新</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            {/* 视图模式切换 */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="网格视图"
              >
                <Grid className="w-3.5 h-3.5" />
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

            {/* 上传数据集按钮 */}
            <button
              onClick={() => setIsUploadingDataset(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xs hover:shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>上传数据集</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            <div className="text-xs text-slate-500 font-medium whitespace-nowrap px-1">
              符合条件：<span className="text-indigo-600 font-extrabold font-mono text-sm">{filteredDatasets.length}</span> 个
            </div>
          </div>

        </div>

        {/* Datasets View (Grid / List) */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
            {filteredDatasets.map(ds => {
              const primaryModality = ds.modalities?.[0] || ds.modalityCategory || '表格数据';
              const primaryTask = ds.taskTypes?.[0] || ds.taskType || '通用任务';
              const primaryFormat = ds.formats?.[0] || ds.fileFormats || ds.format || 'CSV';
              const displayBrief = ds.brief || ds.description;
              const domainTagsList = ds.domains || ds.domainTags || [];
              const isPlatformUploader = ds.uploaderType === 'platform' || !ds.uploaderType || ds.uploaderName === '平台管理';
              const uploaderDisplay = isPlatformUploader ? '平台管理' : (ds.uploaderName || ds.author || '用户上传');

              return (
                <div
                  key={ds.id}
                  onClick={() => setActiveDetailDataset(ds)}
                  className="group rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 p-5 shadow-2xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
                >
                  <div className="space-y-3">
                    
                    {/* Header: Modality & Task Type Badges + Uploader Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shrink-0">
                          {primaryModality}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                          {primaryTask}
                        </span>
                      </div>
                      
                      {/* Uploader Field */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                        isPlatformUploader 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isPlatformUploader ? <ShieldCheck className="w-3 h-3 text-blue-600" /> : <User className="w-3 h-3 text-amber-600" />}
                        <span>上传者: {uploaderDisplay}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {ds.name}
                    </h3>

                    {/* Brief / Description (Limit to 50 chars cleanly) */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium min-h-[32px]">
                      {displayBrief}
                    </p>

                    {/* Domain Tags & Format */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div className="flex flex-wrap items-center gap-1">
                        {domainTagsList.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold"
                          >
                            #{tag}
                          </span>
                        ))}
                        {domainTagsList.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            +{domainTagsList.length - 3}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                        {primaryFormat}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Metrics & Direct Action (Size, Downloads, Views, Date) */}
                  <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ds.viewsCount ?? 0}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ds.downloadCount ?? 0}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span>{ds.updatedAt?.split(' ')?.[0] || ds.updatedAt}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-700">
                        {ds.fileSize || ds.scale || '0 B'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition group-hover:translate-x-0.5" />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
                <tr>
                  <th className="p-4">数据集名称与简介</th>
                  <th className="p-4">上传者</th>
                  <th className="p-4">模态 / 任务类型</th>
                  <th className="p-4">行业领域</th>
                  <th className="p-4">文件格式 / 大小</th>
                  <th className="p-4">浏览 / 下载</th>
                  <th className="p-4">更新时间</th>
                  <th className="p-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredDatasets.map(ds => {
                  const isPlatformUploader = ds.uploaderType === 'platform' || !ds.uploaderType || ds.uploaderName === '平台管理';
                  const uploaderDisplay = isPlatformUploader ? '平台管理' : (ds.uploaderName || ds.author || '用户上传');

                  return (
                    <tr
                      key={ds.id}
                      onClick={() => setActiveDetailDataset(ds)}
                      className="hover:bg-indigo-50/40 transition cursor-pointer"
                    >
                      <td className="p-4 max-w-xs">
                        <div className="font-extrabold text-slate-900 hover:text-indigo-600 transition truncate">
                          {ds.name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {ds.brief || ds.description?.slice(0, 45) || '高质量公开数据集'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          isPlatformUploader 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {isPlatformUploader ? <ShieldCheck className="w-3 h-3 text-blue-600" /> : <User className="w-3 h-3 text-amber-600" />}
                          <span>{uploaderDisplay}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          {ds.modalities?.[0] || ds.modalityCategory || '表格数据'}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {ds.taskTypes?.[0] || ds.taskType || '分类任务'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(ds.domains || ds.domainTags || ['通用']).slice(0, 2).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono font-bold text-slate-700">
                          {ds.fileSize || ds.scale || '0 B'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {ds.formats?.[0] || ds.fileFormats || 'CSV'}
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 font-mono">
                        {ds.viewsCount ?? 0} 浏览 · {ds.downloadCount ?? 0} 下载
                      </td>
                      <td className="p-4 text-slate-400">
                        {ds.updatedAt}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDetailDataset(ds);
                          }}
                          className="px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 font-bold text-xs transition cursor-pointer"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredDatasets.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">没有找到符合条件的数据集</h3>
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
  </div>
);
};

