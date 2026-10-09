import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ModelItem } from '../../types';
import { ModelDetail } from './ModelDetail';
import { 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Binary, 
  Info,
  Check,
  Search,
  Sparkles,
  Zap,
  Server,
  RotateCcw,
  SlidersHorizontal,
  Cpu,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const ModelSquare: React.FC = () => {
  const { 
    models, 
    showToast 
  } = useApp();

  // Active detail model for subpage
  const [activeDetailModel, setActiveDetailModel] = useState<ModelItem | null>(null);

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // 1. 左侧多维筛选条件 state
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedInputModality, setSelectedInputModality] = useState('all');
  const [selectedContextLength, setSelectedContextLength] = useState('all');

  // 展开更多 collapse 状态
  const [showMoreAuthors, setShowMoreAuthors] = useState(false);
  const [showMoreProviders, setShowMoreProviders] = useState(false);

  // 2. 顶部分类 Tabs state
  const [topTabModality, setTopTabModality] = useState<string>('all');

  // 动态数据源
  const authorsList = [
    'Alibaba', 'ByteDance', 'DeepSeek', 'JinaAI', 'Minimax', 'MoonshotAI', 'Qwen', 'Z.ai', 'Google', 'BAAI'
  ];
  const providersList = [
    '阿里云', '阿里云百炼', '百度千帆', '百度智能云', '捷查', '腾讯云', '火山引擎'
  ];

  const handleResetFilters = () => {
    setSelectedAuthor('all');
    setSelectedProvider('all');
    setSelectedInputModality('all');
    setSelectedContextLength('all');
    setTopTabModality('all');
    setSearchQuery('');
  };

  const activeFiltersCount = 
    (selectedAuthor !== 'all' ? 1 : 0) +
    (selectedProvider !== 'all' ? 1 : 0) +
    (selectedInputModality !== 'all' ? 1 : 0) +
    (selectedContextLength !== 'all' ? 1 : 0) +
    (topTabModality !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  // 过滤函数
  const filteredModels = models.filter(m => {
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchVendor = m.vendor.toLowerCase().includes(q);
      const matchDesc = (m.description || '').toLowerCase().includes(q);
      const matchAuthor = (m.author || '').toLowerCase().includes(q);
      if (!matchName && !matchVendor && !matchDesc && !matchAuthor) return false;
    }

    if (selectedAuthor !== 'all' && m.author !== selectedAuthor && m.vendor !== selectedAuthor) return false;
    if (selectedProvider !== 'all' && !m.providerList?.includes(selectedProvider)) return false;
    if (selectedInputModality !== 'all' && !m.inputModalities?.includes(selectedInputModality) && m.typeTag !== selectedInputModality) return false;
    
    if (selectedContextLength !== 'all') {
      if (selectedContextLength === '200K+') {
        const is200KPlus = m.contextLength.includes('200K') || 
                           m.contextLength.includes('256K') || 
                           m.contextLength.includes('1.0M') || 
                           m.contextLength.includes('1M') ||
                           m.contextLength.includes('50素材') ||
                           m.contextLength.includes('50个素材') ||
                           m.contextLength.includes('500K');
        if (!is200KPlus) return false;
      } else if (selectedContextLength === '128K+') {
        const is128KPlus = m.contextLength.includes('128K') || 
                           m.contextLength.includes('200K') || 
                           m.contextLength.includes('256K') || 
                           m.contextLength.includes('1.0M') || 
                           m.contextLength.includes('1M');
        if (!is128KPlus) return false;
      } else if (selectedContextLength === '32K+') {
        const is32KPlus = m.contextLength.includes('32K') || 
                          m.contextLength.includes('128K') || 
                          m.contextLength.includes('200K') || 
                          m.contextLength.includes('256K') || 
                          m.contextLength.includes('1.0M') || 
                          m.contextLength.includes('1M');
        if (!is32KPlus) return false;
      } else if (selectedContextLength === '8K+') {
        const is8KPlus = m.contextLength.includes('8.0K') || 
                         m.contextLength.includes('8K') || 
                         m.contextLength.includes('32K') || 
                         m.contextLength.includes('128K') || 
                         m.contextLength.includes('200K') || 
                         m.contextLength.includes('256K') || 
                         m.contextLength.includes('1.0M') || 
                         m.contextLength.includes('1M');
        if (!is8KPlus) return false;
      }
    }

    if (topTabModality !== 'all') {
      if (topTabModality === '文本' && m.typeTag !== '文本') return false;
      if (topTabModality === '图像' && m.typeTag !== '图像') return false;
      if (topTabModality === '视频' && m.typeTag !== '视频') return false;
      if (topTabModality === '音频' && m.typeTag !== '音频') return false;
      if (topTabModality === '向量' && m.typeTag !== 'Embedding' && m.typeTag !== '向量') return false;
    }

    return true;
  });

  // 各分类统计数量
  const textCount = models.filter(m => m.typeTag === '文本').length;
  const imageCount = models.filter(m => m.typeTag === '图像').length;
  const videoCount = models.filter(m => m.typeTag === '视频').length;
  const audioCount = models.filter(m => m.typeTag === '音频').length;
  const vectorCount = models.filter(m => m.typeTag === 'Embedding' || m.typeTag === '向量').length;

  // 如果选中了具体模型，渲染二级详情页面
  if (activeDetailModel) {
    return (
      <ModelDetail 
        model={activeDetailModel} 
        onBack={() => setActiveDetailModel(null)} 
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 select-none items-start">
      
      {/* 1. 左侧多维筛选侧边栏 Panel (统一规范) */}
      <div className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200/80 p-4.5 shrink-0 space-y-5 text-xs shadow-2xs font-medium">
        
        {/* 侧边栏顶部标题与重置 */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>模型维度筛选</span>
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

        {/* 输入模态 Input Modality Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>输入模态</span>
            </div>
            {selectedInputModality !== 'all' && (
              <button 
                onClick={() => setSelectedInputModality('all')} 
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
              >
                重置
              </button>
            )}
          </div>
          <div className="space-y-1 text-slate-600">
            {['all', '文本', '图像', '音频', '视频', '向量'].map(mod => {
              const isActive = selectedInputModality === mod;
              const count = mod === 'all' 
                ? models.length 
                : models.filter(m => (m.inputModalities && m.inputModalities.includes(mod)) || m.typeTag === mod || (mod === '向量' && m.typeTag === 'Embedding')).length;

              return (
                <button
                  key={mod}
                  onClick={() => setSelectedInputModality(mod)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    isActive ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{mod === 'all' ? '全部模态' : mod}</span>
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

        {/* 上下文长度 Context Length Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>上下文长度</span>
            </div>
            {selectedContextLength !== 'all' && (
              <button 
                onClick={() => setSelectedContextLength('all')} 
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
              >
                重置
              </button>
            )}
          </div>
          <div className="space-y-1 text-slate-600">
            {['all', '8K+', '32K+', '128K+', '200K+'].map(ctx => {
              const isActive = selectedContextLength === ctx;
              return (
                <button
                  key={ctx}
                  onClick={() => setSelectedContextLength(ctx)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    isActive ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{ctx === 'all' ? '全部长度' : ctx}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* 作者/开发商 Author Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>开发机构/作者</span>
            </div>
            {selectedAuthor !== 'all' && (
              <button onClick={() => setSelectedAuthor('all')} className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer">
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            <button
              onClick={() => setSelectedAuthor('all')}
              className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                selectedAuthor === 'all' ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>全部机构</span>
              {selectedAuthor === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
            </button>
            {(showMoreAuthors ? authorsList : authorsList.slice(0, 6)).map(author => (
              <button
                key={author}
                onClick={() => setSelectedAuthor(author)}
                className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer truncate flex items-center justify-between text-xs ${
                  selectedAuthor === author ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="truncate">{author}</span>
                {selectedAuthor === author && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
              </button>
            ))}

            <button
              onClick={() => setShowMoreAuthors(!showMoreAuthors)}
              className="text-[11px] text-slate-400 hover:text-slate-700 py-1 px-2.5 flex items-center gap-1 cursor-pointer font-bold transition"
            >
              {showMoreAuthors ? (
                <>收起 <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>+ 展开更多 <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* 服务商 Provider Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <div className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-500" />
              <span>部署服务商</span>
            </div>
            {selectedProvider !== 'all' && (
              <button onClick={() => setSelectedProvider('all')} className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer">
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            <button
              onClick={() => setSelectedProvider('all')}
              className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                selectedProvider === 'all' ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>全部服务商</span>
              {selectedProvider === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
            </button>
            {(showMoreProviders ? providersList : providersList.slice(0, 5)).map(provider => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer truncate flex items-center justify-between text-xs ${
                  selectedProvider === provider ? 'bg-indigo-50/90 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="truncate">{provider}</span>
                {selectedProvider === provider && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
              </button>
            ))}

            <button
              onClick={() => setShowMoreProviders(!showMoreProviders)}
              className="text-[11px] text-slate-400 hover:text-slate-700 py-1 px-2.5 flex items-center gap-1 cursor-pointer font-bold transition"
            >
              {showMoreProviders ? (
                <>收起 <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>+ 展开更多 <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* 2. 右侧主内容展示区 (Right Main Area) */}
      <div className="flex-1 space-y-5 w-full min-w-0">
        
        {/* Top Control Bar: Search Input & Quick Modality Tabs & Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索模型名称、厂商、能力或说明..."
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

          {/* Quick Modality Switcher */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0">
            {[
              { id: 'all', label: '全部', count: models.length },
              { id: '文本', label: '文本', count: textCount },
              { id: '图像', label: '图像', count: imageCount },
              { id: '音频', label: '音频', count: audioCount },
              { id: '视频', label: '视频', count: videoCount },
              { id: '向量', label: '向量', count: vectorCount },
            ].map(tab => {
              const isActive = topTabModality === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTopTabModality(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-3xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

          <div className="text-xs text-slate-500 font-medium whitespace-nowrap px-1">
            符合条件：<span className="text-indigo-600 font-extrabold font-mono text-sm">{filteredModels.length}</span> 款
          </div>
        </div>

        {/* Model Cards Grid Matrix (双列/三列精细卡片) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
          {filteredModels.map(m => {
            return (
              <div
                key={m.id}
                onClick={() => setActiveDetailModel(m)}
                className="group rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 p-5 shadow-2xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
              >
                <div>
                  {/* Card Header: Brand Icon + Title + Tokens Usage Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        {m.vendor.slice(0, 1)}
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {m.vendor}: {m.name}
                      </h3>
                    </div>

                    <span className="text-[11px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg font-medium shrink-0 border border-slate-200/60">
                      {m.totalTokensUsed || '1.11B tokens'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-medium mb-4 h-9">
                    {m.description}
                  </p>

                  {/* Specs Pill Bar */}
                  <div className={`p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center text-[11px] font-mono mb-4 ${m.contextLength ? 'justify-between' : 'justify-end'}`}>
                    {m.contextLength && (
                      <div className="text-slate-700 font-bold flex items-center gap-1">
                        <span className="text-indigo-600">{m.contextLength}</span>
                        <span className="text-slate-400 font-normal">context</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      {m.typeTag === '图像' ? (
                        <>
                          <span className="text-slate-500">
                            输出 <strong className="text-emerald-600 font-bold">{m.priceOutput}</strong>
                          </span>
                          <span className="text-slate-500">
                            输入 <strong className="text-emerald-600 font-bold">{m.priceInput}</strong>
                          </span>
                        </>
                      ) : m.typeTag === '视频' ? (
                        <>
                          <span className="text-slate-500">
                            <strong className="text-emerald-600 font-bold">{m.priceInput}</strong>
                          </span>
                          <span className="text-slate-500">
                            <strong className="text-emerald-600 font-bold">{m.priceOutput}</strong>
                          </span>
                        </>
                      ) : m.typeTag === '音频' ? (
                        <>
                          {m.priceInput !== '免费' && (
                            <span className="text-slate-500">
                              输入 <strong className="text-emerald-600 font-bold">{m.priceInput}</strong>
                            </span>
                          )}
                          <span className="text-slate-500">
                            输出 <strong className="text-emerald-600 font-bold">{m.priceOutput}</strong>
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-slate-500">
                            输入 <strong className="text-emerald-600 font-bold">{m.priceInput}</strong>
                          </span>
                          <span className="text-slate-500">
                            输出 <strong className="text-emerald-600 font-bold">{m.priceOutput}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Row: 查看模型详情 */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition">
                  <span>了解模型能力与 API 接入</span>
                  <div className="flex items-center gap-1 text-indigo-600 font-extrabold group-hover:translate-x-1 transition-transform">
                    <span>查看详情</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {filteredModels.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <Cpu className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">没有找到符合条件的模型</h3>
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
