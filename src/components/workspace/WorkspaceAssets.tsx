import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { useApp } from '../../context/AppContext';
import { AgentItem, AppType, DatasetApplication, DatasetItem, SkillPluginItem } from '../../types';
import { mockDatasetApplications } from '../../data/mockData';
import { AppOrchestrationView } from '../orchestration/AppOrchestrationView';
import { DatasetDetail } from '../marketplace/DatasetDetail';
import { SkillDetail } from '../marketplace/SkillDetail';
import { UserDatasetUploadForm } from '../marketplace/UserDatasetUploadForm';
import { UserSkillCreateForm } from '../marketplace/UserSkillCreateForm';
import { 
  Bot, 
  Database, 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Edit3, 
  Trash2, 
  Key, 
  BarChart2, 
  Download, 
  UserCheck, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  Globe,
  Tag,
  Code2,
  GitFork,
  MessageSquareShare,
  Sparkles,
  FileText,
  UploadCloud,
  LayoutGrid,
  Building2,
  Coins,
  FileCode,
  HardDrive,
  Copy,
  Check,
  Layers,
  FolderOpen,
  X,
  FileSpreadsheet
} from 'lucide-react';

// 只读 Skill 详情弹窗组件
const SkillReadOnlyModal: React.FC<{
  skill: SkillPluginItem;
  onClose: () => void;
  onDownload: (sk: SkillPluginItem) => void;
}> = ({ skill, onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">Skill 详情 (只读)</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  skill.status === '已上架'
                    ? 'bg-emerald-100 text-emerald-800'
                    : skill.status === '待审核'
                    ? 'bg-amber-100 text-amber-800'
                    : skill.status === '已驳回'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {skill.status || '未上架'}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-0.5">{skill.name}</h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-bold block mb-1">Slug 唯一标识</span>
              <span className="font-mono font-bold text-slate-800">{skill.repoPath || skill.id}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-1">场景分类</span>
              <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                {skill.category || '效率工具'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-1">创建时间</span>
              <span className="text-slate-700 font-medium">{skill.updatedAt || '刚刚'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-1">资源包大小</span>
              <span className="font-mono text-slate-700">{skill.packageSize || '1.8 MB'}</span>
            </div>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-1.5">插件功能描述</h4>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed">
              {skill.description || '暂无详细描述'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-slate-400 text-[11px]">只读展示模式，无法直接编辑修改</span>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition">
              关闭
            </button>
            <button 
              onClick={() => {
                onDownload(skill);
                onClose();
              }} 
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <Download className="w-4 h-4" />
              <span>下载源码包</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// 只读 Dataset 详情弹窗组件 (严格参考设计稿规范构建)
const DatasetReadOnlyModal: React.FC<{
  dataset: DatasetItem;
  onClose: () => void;
  onDownload?: (ds: DatasetItem) => void;
}> = ({ dataset, onClose, onDownload }) => {
  const statusDisplay = (dataset as any).status || '已下架';
  const getStatusBadge = (status: string) => {
    switch (status) {
      case '已上架':
        return <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/70">已上架</span>;
      case '待审核':
        return <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/70">待审核</span>;
      case '已驳回':
        return <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/70">已驳回</span>;
      case '未上架':
        return <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">未上架</span>;
      default:
        return <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">已下架</span>;
    }
  };

  const domainTags = dataset.domainTags && dataset.domainTags.length > 0 
    ? dataset.domainTags 
    : ['商业', '数据挖掘', '零售分析'];

  const introText = dataset.description || dataset.brief || 'PowerBI零售数据分析实战这本书作者提供的数据集，涵盖中型连锁品牌门店销售、会员生命周期、库存流转等多维度真实商业脱敏数据。示例数据可以在Excel中直接处理，完整数据建议使用R/Python或者PowerBI等工具。';

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200/80 p-7 space-y-5 animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Left Icon */}
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
              <Database className="w-6 h-6" />
            </div>
            
            {/* Title & Badges */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                  数据集详情 (只读)
                </span>
                {getStatusBadge(statusDisplay)}
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1 tracking-tight truncate">
                {dataset.name}
              </h3>
            </div>
          </div>

          {/* Close X */}
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Meta Grid Cards (3 cols x 2 rows) */}
        <div className="grid grid-cols-3 gap-3">
          {/* 1. 模态类型 */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100/90 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium mb-1.5">模态类型</span>
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-bold text-xs inline-block">
                {dataset.modalityCategory || '表格'}
              </span>
            </div>
          </div>

          {/* 2. 任务类型 */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100/90 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium mb-1.5">任务类型</span>
            <span className="text-xs font-bold text-slate-800 truncate">
              {dataset.taskType || '表格回归'}
            </span>
          </div>

          {/* 3. 数据大小 */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100/90 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium mb-1.5">数据大小</span>
            <span className="text-xs font-bold text-slate-800 font-mono truncate">
              {dataset.fileSize || dataset.scale || '267.5 MB'}
            </span>
          </div>

          {/* 4. 文件格式 */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100/90 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium mb-1.5">文件格式</span>
            <span className="text-xs font-bold text-slate-800 font-mono truncate">
              {dataset.fileFormats || (dataset as any).format || '.csv, .xlsx'}
            </span>
          </div>

          {/* 5. 开源协议 */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100/90 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium mb-1.5">开源协议</span>
            <span className="text-xs font-bold text-slate-800 truncate">
              {dataset.license || 'CC0 公共领域共享'}
            </span>
          </div>

          {/* 6. 更新时间 */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100/90 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium mb-1.5">更新时间</span>
            <span className="text-xs font-bold text-slate-800 font-mono truncate">
              {dataset.updatedAt || '2026/08/07 14:20'}
            </span>
          </div>
        </div>

        {/* Category Domain Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {domainTags.map((tag, idx) => (
            <span 
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-indigo-50/80 text-indigo-700 text-xs font-bold border border-indigo-100/70"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Data Introduction */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-slate-900">数据简介</h4>
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100/90 text-xs text-slate-600 leading-relaxed font-normal">
            {introText}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            下载次数: {dataset.downloadCount ?? 9}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              关闭
            </button>
            <button
              onClick={() => {
                if (onDownload) {
                  onDownload(dataset);
                }
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载数据集</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Skill 修改弹窗 (已驳回状态下编辑并重新提交)
const SkillEditModal: React.FC<{
  skill: SkillPluginItem;
  onClose: () => void;
  onSave: (updates: Partial<SkillPluginItem>) => void;
}> = ({ skill, onClose, onSave }) => {
  const [name, setName] = useState(skill.name);
  const [slug, setSlug] = useState(skill.repoPath ? skill.repoPath.split('/')[1] || skill.id : skill.id);
  const [category, setCategory] = useState(skill.category || '效率工具');
  const [description, setDescription] = useState(skill.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      id: slug.trim(),
      repoPath: `@user/${slug.trim()}`,
      category,
      description: description.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-purple-600" />
            <span>修改 Skill 插件 (重新提交审核)</span>
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {skill.auditReason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs">
            <div className="font-bold mb-0.5">上次驳回原因:</div>
            <div>{skill.auditReason}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Skill 名称 *</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold focus:border-purple-500 outline-hidden" 
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Slug *</label>
            <input 
              type="text" 
              value={slug} 
              onChange={e => setSlug(e.target.value)} 
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:border-purple-500 outline-hidden" 
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">场景分类</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold focus:border-purple-500 outline-hidden"
            >
              {['知识管理', '效率工具', '数据分析', '内容创作', '编程开发', '图像影音', '生活娱乐'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">描述</label>
            <textarea 
              rows={3} 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
              取消
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-xs cursor-pointer">
              保存并再次提交
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 数据集修改弹窗 (已驳回状态下编辑并重新提交)
const DatasetEditModal: React.FC<{
  dataset: DatasetItem;
  onClose: () => void;
  onSave: (updates: Partial<DatasetItem>) => void;
}> = ({ dataset, onClose, onSave }) => {
  const [name, setName] = useState(dataset.name);
  const [brief, setBrief] = useState(dataset.brief || dataset.description?.slice(0, 50) || '');
  const [description, setDescription] = useState(dataset.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      brief: brief.trim(),
      description: description.trim(),
      status: '待审核',
      auditReason: undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-600" />
            <span>修改数据集信息 (重新提交审核)</span>
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {dataset.auditReason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs">
            <div className="font-bold mb-0.5">上次驳回原因:</div>
            <div>{dataset.auditReason}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">数据集名称 *</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold focus:border-blue-500 outline-hidden" 
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">一句话简介</label>
            <input 
              type="text" 
              value={brief} 
              onChange={e => setBrief(e.target.value)} 
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:border-blue-500 outline-hidden" 
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">详细描述</label>
            <textarea 
              rows={4} 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
              取消
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-xs cursor-pointer">
              保存并再次提交
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const WorkspaceAssets: React.FC = () => {
  const { 
    agents,
    userAgents, 
    user,
    subscriptions,
    payPerTokenAgents,
    datasets, 
    skills, 
    favorites, 
    datasetDownloads,
    setDatasetDownloads,
    skillDownloads,
    setSkillDownloads,
    downloadDataset,
    downloadSkill,
    toggleDatasetStatus,
    updateDataset,
    deleteDataset,
    toggleSkillStatus,
    updateSkill,
    deleteSkill,
    setWorkspaceSubTab, 
    showToast, 
    openModal,
    setSelectedMainTab,
    toggleFavoriteAgent,
    openAgentDetail
  } = useApp();

  const [orchestratingAgent, setOrchestratingAgent] = useState<AgentItem | null>(null);
  const [activeAssetTab, setActiveAssetTab] = useState<'agents' | 'datasets' | 'skills'>('agents');
  
  // Agent Sub-tab: 我创建的 vs 我订阅的 (默认展示我调用的)
  const [agentScopeTab, setAgentScopeTab] = useState<'created' | 'subscribed'>('subscribed');

  // Dataset Sub-tab: 我上传的 vs 已下载的
  const [datasetScopeTab, setDatasetScopeTab] = useState<'created' | 'downloaded'>('created');
  
  // Skill Sub-tab: 我创建的 vs 已下载的
  const [skillScopeTab, setSkillScopeTab] = useState<'created' | 'downloaded'>('created');

  const [activeDatasetDetail, setActiveDatasetDetail] = useState<DatasetItem | null>(null);
  const [activeSkillDetail, setActiveSkillDetail] = useState<SkillPluginItem | null>(null);

  // Forms and Modals
  const [isUploadingDataset, setIsUploadingDataset] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [readOnlyDatasetModal, setReadOnlyDatasetModal] = useState<DatasetItem | null>(null);
  const [readOnlySkillModal, setReadOnlySkillModal] = useState<SkillPluginItem | null>(null);
  const [editingDataset, setEditingDataset] = useState<DatasetItem | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillPluginItem | null>(null);

  // Filters for Application List
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedSceneFilter, setSelectedSceneFilter] = useState<string>('all');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent_modified');

  // Filter dropdown toggles
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showSceneDropdown, setShowSceneDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Dataset applications state
  const [applications, setApplications] = useState<DatasetApplication[]>(mockDatasetApplications);

  // If in dataset upload subpage, render UserDatasetUploadForm
  if (isUploadingDataset) {
    return (
      <UserDatasetUploadForm 
        onBack={() => setIsUploadingDataset(false)} 
        fromTitle="我的资产"
      />
    );
  }

  // If in skill create subpage, render UserSkillCreateForm
  if (isCreatingSkill) {
    return (
      <UserSkillCreateForm 
        onBack={() => setIsCreatingSkill(false)} 
        fromTitle="我的资产"
      />
    );
  }

  // If in orchestration studio, render full screen orchestration view
  if (orchestratingAgent) {
    return (
      <AppOrchestrationView 
        agent={orchestratingAgent} 
        onBack={() => setOrchestratingAgent(null)} 
      />
    );
  }

  // If in dataset detail view, render full screen DatasetDetail
  if (activeDatasetDetail) {
    return (
      <DatasetDetail 
        dataset={activeDatasetDetail} 
        onBack={() => setActiveDatasetDetail(null)} 
        fromTitle="我的资产"
      />
    );
  }

  // If in skill detail view, render full screen SkillDetail
  if (activeSkillDetail) {
    return (
      <SkillDetail 
        skill={activeSkillDetail} 
        onBack={() => setActiveSkillDetail(null)} 
        fromTitle="我的资产"
      />
    );
  }

  // Filtered lists for 我创建的 vs 我订阅的
  const subscribedAgents = agents.filter(ag => ag.isPurchased || !!subscriptions[ag.id] || !!payPerTokenAgents[ag.id]);
  const createdAgents = agents.filter(ag => (ag.author === user.name || ag.author === 'zj' || ag.isDeveloped || ag.id.startsWith('app_') || ag.id.startsWith('ag_custom')) && !subscribedAgents.some(s => s.id === ag.id));

  // Filtered lists for 数据集: 我创建的 (我上传的)
  const createdDatasets = datasets.filter(d => d.isCreatedByMe || d.author === 'zj' || d.id === 'ds_powerbi_retail');
  const mountedDatasets = datasets.filter(d => d.isMounted || d.isFavorite || !d.isCreatedByMe);
  const currentDisplayDatasets = datasetScopeTab === 'created' ? createdDatasets : mountedDatasets;

  const currentDisplayAgents = (agentScopeTab === 'created' ? createdAgents : subscribedAgents).filter(ag => {
    // 1. Type filter
    if (selectedTypeFilter !== 'all') {
      const form = ag.appType || ag.techForm || '';
      if (selectedTypeFilter === '工作流' && !form.includes('工作流') && !form.includes('Workflow')) return false;
      if (selectedTypeFilter === '对话流' && !form.includes('对话流')) return false;
      if (selectedTypeFilter === '聊天助手' && !form.includes('聊天助手') && !form.includes('Chatbot')) return false;
      if (selectedTypeFilter === 'Agent' && !form.includes('Agent')) return false;
      if (selectedTypeFilter === '文本生成应用' && !form.includes('文本生成')) return false;
    }

    // 2. Application Scene Filter
    if (selectedSceneFilter !== 'all') {
      const sceneVal = ag.scene || (ag.categoryTags && ag.categoryTags[0]);
      const hasScene = sceneVal === selectedSceneFilter;
      const hasCategoryTag = ag.categoryTags && ag.categoryTags.includes(selectedSceneFilter);
      const hasTag = ag.tags && ag.tags.includes(selectedSceneFilter);
      if (!hasScene && !hasCategoryTag && !hasTag) return false;
    }

    // 3. Industry Domain Filter
    if (selectedIndustryFilter !== 'all') {
      const industryVal = ag.industry || (ag.industryTags && ag.industryTags[0]);
      const hasIndustry = industryVal === selectedIndustryFilter;
      const hasIndustryTag = ag.industryTags && ag.industryTags.includes(selectedIndustryFilter);
      const hasTag = ag.tags && ag.tags.includes(selectedIndustryFilter);
      if (!hasIndustry && !hasIndustryTag && !hasTag) return false;
    }

    // 4. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ag.name.toLowerCase().includes(q);
      const matchDesc = ag.description?.toLowerCase().includes(q);
      const matchType = (ag.appType || ag.techForm || '').toLowerCase().includes(q);
      const matchScene = (ag.scene || (ag.categoryTags && ag.categoryTags[0]) || '').toLowerCase().includes(q);
      const matchIndustry = (ag.industry || (ag.industryTags && ag.industryTags[0]) || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchType && !matchScene && !matchIndustry) return false;
    }
    return true;
  });

  // Render monochrome wireframe icon for Agent cards
  const renderAgentWireframeIcon = (ag: AgentItem) => {
    const form = (ag.appType || ag.techForm || '工作流') as string;
    if (form === '工作流' || form === 'Workflow') {
      return <GitFork className="w-4 h-4" />;
    }
    if (form === '对话流') {
      return <MessageSquareShare className="w-4 h-4" />;
    }
    if (form === '聊天助手' || form === 'Chatbot') {
      return <Bot className="w-4 h-4" />;
    }
    if (form === 'Agent') {
      return <Sparkles className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none text-[#1A1A1A]">
      
      {/* Header & Asset Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight flex items-center gap-2.5">
            <span>我的资产</span>
            <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-[#F5F5F5] text-[#555555] border border-[#EAEAEA]">
              资产库中心
            </span>
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            统一管理您创建、编排与授权的 AI 工作流应用、智能体、数据集与开发者资源
          </p>
        </div>

        {/* Global Action Button */}
        <div>
          {activeAssetTab === 'datasets' && (
            <button
              onClick={() => setIsUploadingDataset(true)}
              className="px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>上传数据集</span>
            </button>
          )}

          {activeAssetTab === 'skills' && (
            <button
              onClick={() => setIsCreatingSkill(true)}
              className="px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>创建 Skill</span>
            </button>
          )}
        </div>
      </div>

      {/* SubTabs bar */}
      <div className="flex items-center gap-6 border-b border-[#EAEAEA] text-xs">
        {[
          { key: 'agents', label: '我的 Agent', count: subscribedAgents.length, icon: Bot },
          { key: 'datasets', label: '我的数据集', count: datasets.length, icon: Database },
          { key: 'skills', label: '我的 Skill', count: skills.length, icon: Wrench },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAssetTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveAssetTab(tab.key as any)}
              className={`pb-3 px-1 flex items-center gap-2 border-b-2 transition cursor-pointer -mb-px ${
                isActive 
                  ? 'border-[#1A1A1A] text-[#1A1A1A] font-semibold' 
                  : 'border-transparent text-[#666666] hover:text-[#1A1A1A] font-medium'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                isActive ? 'bg-[#1A1A1A] text-white' : 'bg-[#F5F5F5] text-[#666666]'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 1. SubTab: 我的 Agent (Application List & Orchestration Entrance) */}
      {activeAssetTab === 'agents' && (
        <div className="space-y-5">
          
          {/* Top Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Left Filter Dropdowns & Search */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-[#333333]">
              
              {/* Filter 1: 类型 ∨ */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowSceneDropdown(false); setShowIndustryDropdown(false); setShowSortDropdown(false); }}
                  className={`px-3 py-1.5 rounded-md border bg-white flex items-center gap-1.5 transition cursor-pointer ${
                    selectedTypeFilter !== 'all' ? 'border-[#1A1A1A] text-[#1A1A1A] bg-[#F5F5F5] font-semibold' : 'border-[#E0E0E0] hover:border-[#BDBDBD] text-[#333333]'
                  }`}
                >
                  <span>{selectedTypeFilter === 'all' ? '类型' : selectedTypeFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#888888]" />
                </button>

                {showTypeDropdown && (
                  <div className="absolute left-0 top-10 z-40 w-36 bg-white border border-[#EAEAEA] rounded-md py-1 text-xs animate-fade-in">
                    {[
                      { key: 'all', label: '全部类型' },
                      { key: '工作流', label: '工作流' },
                      { key: '对话流', label: '对话流' },
                      { key: '聊天助手', label: '聊天助手' },
                      { key: 'Agent', label: 'Agent' },
                      { key: '文本生成应用', label: '文本生成应用' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => { setSelectedTypeFilter(item.key); setShowTypeDropdown(false); }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-[#F5F5F5] transition cursor-pointer ${
                          selectedTypeFilter === item.key ? 'text-[#1A1A1A] font-semibold bg-[#F5F5F5]' : 'text-[#555555]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter 2: 应用场景 ∨ */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowSceneDropdown(!showSceneDropdown); setShowTypeDropdown(false); setShowIndustryDropdown(false); setShowSortDropdown(false); }}
                  className={`px-3 py-1.5 rounded-md border bg-white flex items-center gap-1.5 transition cursor-pointer ${
                    selectedSceneFilter !== 'all' ? 'border-[#1A1A1A] text-[#1A1A1A] bg-[#F5F5F5] font-semibold' : 'border-[#E0E0E0] hover:border-[#BDBDBD] text-[#333333]'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-[#666666]" />
                  <span>{selectedSceneFilter === 'all' ? '应用场景' : selectedSceneFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#888888]" />
                </button>

                {showSceneDropdown && (
                  <div className="absolute left-0 top-10 z-40 w-36 bg-white border border-[#EAEAEA] rounded-md py-1 text-xs animate-fade-in max-h-56 overflow-y-auto scrollbar-thin">
                    {['全部场景', '内容创作', '数据分析', '智能客服', '办公助理', '编程开发', '营销推广', '教育培训', '行业垂直'].map((scene) => (
                      <button
                        key={scene}
                        onClick={() => { setSelectedSceneFilter(scene === '全部场景' ? 'all' : scene); setShowSceneDropdown(false); }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-[#F5F5F5] transition cursor-pointer ${
                          (selectedSceneFilter === 'all' && scene === '全部场景') || selectedSceneFilter === scene ? 'text-[#1A1A1A] font-semibold bg-[#F5F5F5]' : 'text-[#555555]'
                        }`}
                      >
                        {scene}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter 3: 行业领域 ∨ */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowIndustryDropdown(!showIndustryDropdown); setShowTypeDropdown(false); setShowSceneDropdown(false); setShowSortDropdown(false); }}
                  className={`px-3 py-1.5 rounded-md border bg-white flex items-center gap-1.5 transition cursor-pointer ${
                    selectedIndustryFilter !== 'all' ? 'border-[#1A1A1A] text-[#1A1A1A] bg-[#F5F5F5] font-semibold' : 'border-[#E0E0E0] hover:border-[#BDBDBD] text-[#333333]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-[#666666]" />
                  <span>{selectedIndustryFilter === 'all' ? '行业领域' : selectedIndustryFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#888888]" />
                </button>

                {showIndustryDropdown && (
                  <div className="absolute left-0 top-10 z-40 w-36 bg-white border border-[#EAEAEA] rounded-md py-1 text-xs animate-fade-in max-h-56 overflow-y-auto scrollbar-thin">
                    {['全部领域', '通用', '政务', '制造', '零售', '金融', '医疗', '教育', '文旅', '物流'].map((ind) => (
                      <button
                        key={ind}
                        onClick={() => { setSelectedIndustryFilter(ind === '全部领域' ? 'all' : ind); setShowIndustryDropdown(false); }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-[#F5F5F5] transition cursor-pointer ${
                          (selectedIndustryFilter === 'all' && ind === '全部领域') || selectedIndustryFilter === ind ? 'text-[#1A1A1A] font-semibold bg-[#F5F5F5]' : 'text-[#555555]'
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索Agent名称"
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E0E0E0] focus:border-[#1A1A1A] rounded-md text-xs text-[#1A1A1A] placeholder-[#999999] outline-none transition"
                />
              </div>

            </div>

          </div>

          {/* Application Cards Grid */}
          {currentDisplayAgents.length === 0 ? (
            <div className="bg-white rounded-md border border-[#EAEAEA] p-12 text-center space-y-3">
              <div className="w-11 h-11 rounded-md bg-[#F5F5F5] border border-[#EAEAEA] text-[#888888] flex items-center justify-center mx-auto">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#1A1A1A]">
                {agentScopeTab === 'created' ? '暂未创建任何 Agent' : '暂未调用任何 Agent'}
              </h4>
              <p className="text-xs text-[#666666] max-w-md mx-auto">
                {agentScopeTab === 'created' 
                  ? '点击页面右上方的“创建 Agent”按钮，即可快速创建专属工作流、智能体与助手应用。' 
                  : '前往 Agent 商店浏览丰富多样的场景化智能体，一键极速体验调用！'}
              </p>
              {agentScopeTab === 'subscribed' && (
                <button
                  onClick={() => setSelectedMainTab('marketplace')}
                  className="px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold transition cursor-pointer"
                >
                  探索 Agent 商店
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentDisplayAgents.map((ag) => {
                const sceneTag = ag.scene || (ag.categoryTags && ag.categoryTags[0]) || (ag.category === 'coding' ? '编程开发' : ag.category === 'data' ? '数据分析' : ag.category === 'image' ? '内容创作' : '办公助理');
                const industryTag = ag.industry || (ag.industryTags && ag.industryTags[0]) || '通用';
                const quotaText = `${(ag.freeTokenQuota ?? 50000).toLocaleString()} Tokens`;

                return (
                  <div
                    key={ag.id}
                    onClick={() => {
                      if (agentScopeTab === 'created') {
                        setOrchestratingAgent(ag);
                      } else {
                        const targetUrl = (ag.id === 'ag_22' || ag.name.includes('企业客服'))
                          ? 'https://agent001-six.vercel.app/'
                          : (ag.trialUrl || `${window.location.origin}${window.location.pathname}?trial=${ag.id}`);
                        window.open(targetUrl, '_blank');
                      }
                    }}
                    className="bg-white p-4 rounded-md border border-[#EAEAEA] hover:border-[#CCCCCC] transition-colors cursor-pointer flex flex-col justify-between group min-h-[188px]"
                    title={agentScopeTab === 'created' ? '点击进入应用编排界面' : '点击在独立标签页立即体验该 Agent'}
                  >
                    
                    <div className="space-y-3">
                      {/* Top: Monochrome Wireframe Icon + App Name & App Type */}
                      <div className="flex items-start gap-3">
                        
                        {/* Monochrome Wireframe Icon Container */}
                        <div className="w-10 h-10 rounded-md bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333] flex items-center justify-center shrink-0">
                          {renderAgentWireframeIcon(ag)}
                        </div>

                        {/* App Name & App Type text */}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-[#1A1A1A] truncate leading-snug">
                            {ag.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-[#555555] font-medium bg-[#F5F5F5] border border-[#EAEAEA] px-1.5 py-0.5 rounded uppercase tracking-tight">
                              {ag.appType || ag.techForm || '工作流'}
                            </span>
                            {ag.baseModel && (
                              <span className="text-[10px] text-[#888888] font-normal truncate hidden sm:inline">
                                {ag.baseModel}
                              </span>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Scene & Industry Tags (统一极浅灰底/细灰框 + 深灰字) */}
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-[#F5F5F5] text-[#555555] border border-[#EAEAEA]">
                          <LayoutGrid className="w-2.5 h-2.5 text-[#777777]" />
                          <span>{sceneTag}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-white text-[#555555] border border-[#E2E2E2]">
                          <Building2 className="w-2.5 h-2.5 text-[#777777]" />
                          <span>{industryTag}</span>
                        </span>
                      </div>

                      {/* Description */}
                      {ag.description && (
                        <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                          {ag.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom section: 透明底 + 顶部细分割线 + 纯黑描边线框按钮 */}
                    <div className="pt-3 mt-3 border-t border-[#F0F0F0]">
                      
                      {agentScopeTab === 'subscribed' ? (
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center gap-1 text-[#666666] truncate">
                            <span className="shrink-0">免费额度:</span>
                            <span className="font-mono tabular-nums font-semibold text-[#1A1A1A] truncate">{quotaText}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const targetUrl = (ag.id === 'ag_22' || ag.name.includes('企业客服'))
                                ? 'https://agent001-six.vercel.app/'
                                : (ag.trialUrl || `${window.location.origin}${window.location.pathname}?trial=${ag.id}`);
                              window.open(targetUrl, '_blank');
                            }}
                            className="text-[11px] font-medium px-2.5 py-1 bg-transparent hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A] rounded transition-colors cursor-pointer shrink-0"
                          >
                            立即体验
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[11px] text-[#888888]">
                          <span className="truncate">
                            {ag.author || '极客小千'} · {ag.updatedAt ? `编辑于 ${ag.updatedAt}` : '已就绪'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOrchestratingAgent(ag);
                            }}
                            className="text-[11px] font-medium px-2.5 py-1 bg-transparent hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A] rounded transition-colors cursor-pointer shrink-0 ml-1"
                          >
                            进入编排
                          </button>
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* 2. SubTab: 我的数据集 */}
      {activeAssetTab === 'datasets' && (
        <div className="space-y-5">
          
          {/* Sub-level Tabs: 我上传的 / 已下载的数据集 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAEAEA]">
            <div className="flex items-center gap-1 bg-[#F5F5F5] border border-[#EAEAEA] p-1 rounded-md">
              <button
                type="button"
                onClick={() => setDatasetScopeTab('created')}
                className={`px-3.5 py-1.5 rounded text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                  datasetScopeTab === 'created'
                    ? 'bg-white text-[#1A1A1A] font-semibold border border-[#E0E0E0]'
                    : 'text-[#666666] hover:text-[#1A1A1A]'
                }`}
              >
                <span>我上传的</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                  datasetScopeTab === 'created' ? 'bg-[#1A1A1A] text-white' : 'bg-[#EAEAEA] text-[#555555]'
                }`}>
                  {createdDatasets.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDatasetScopeTab('downloaded')}
                className={`px-3.5 py-1.5 rounded text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                  datasetScopeTab === 'downloaded'
                    ? 'bg-white text-[#1A1A1A] font-semibold border border-[#E0E0E0]'
                    : 'text-[#666666] hover:text-[#1A1A1A]'
                }`}
              >
                <span>已下载的数据集</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                  datasetScopeTab === 'downloaded' ? 'bg-[#1A1A1A] text-white' : 'bg-[#EAEAEA] text-[#555555]'
                }`}>
                  {datasetDownloads.length}
                </span>
              </button>
            </div>

            <div className="text-xs text-[#666666]">
              共管理 <span className="font-mono tabular-nums font-semibold text-[#1A1A1A]">{createdDatasets.length}</span> 个数据集资产
            </div>
          </div>

          {datasetScopeTab === 'downloaded' ? (
            /* 已下载的数据集 Table */
            <div className="bg-white rounded-md border border-[#EAEAEA] overflow-hidden">
              {datasetDownloads.length === 0 ? (
                <div className="p-12 text-center text-[#888888] text-xs">
                  暂无数据集下载记录。您可以在数据集广场浏览并一键极速下载数据包。
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
                    <tr>
                      <th className="py-3.5 px-4">数据集名称</th>
                      <th className="py-3.5 px-4">模态</th>
                      <th className="py-3.5 px-4">数据集大小</th>
                      <th className="py-3.5 px-4">创建者</th>
                      <th className="py-3.5 px-4">下载时间</th>
                      <th className="py-3.5 px-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F2F2] text-[#333333]">
                    {datasetDownloads.map(rec => {
                      const targetDs = datasets.find(d => d.id === rec.datasetId);
                      return (
                        <tr key={rec.id} className="hover:bg-[#FAFAFA] transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">{rec.datasetName}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-[#F5F5F5] text-[#4B5563] border border-[#EAEAEA] text-[11px] font-medium">
                              {rec.modality || '表格数据'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono tabular-nums font-medium text-[#333333]">{rec.fileSize || '267.5 MB'}</td>
                          <td className="py-3.5 px-4 text-[#666666]">{rec.uploaderName || '平台提供'}</td>
                          <td className="py-3.5 px-4 text-[#888888] font-mono tabular-nums text-[11px]">{rec.downloadTime || rec.downloadedAt}</td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => {
                                if (targetDs) setReadOnlyDatasetModal(targetDs);
                                else showToast(`查看【${rec.datasetName}】详情`);
                              }}
                              className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#333333] hover:text-[#1A1A1A] font-medium text-xs cursor-pointer transition"
                            >
                              详情
                            </button>
                            <button
                              onClick={() => {
                                if (targetDs) downloadDataset(targetDs);
                                showToast(`已重新下载数据集【${rec.datasetName}】`);
                              }}
                              className="px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-[#333333] text-white font-medium text-xs cursor-pointer transition"
                            >
                              再次下载
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`确定要从已下载列表中移除数据集【${rec.datasetName}】吗？`)) {
                                  setDatasetDownloads(prev => prev.filter(r => r.id !== rec.id));
                                  showToast(`已删除数据集【${rec.datasetName}】下载记录`);
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-white hover:bg-[#FEF2F2] text-[#991B1B] border border-[#E5C5C5] text-xs font-medium transition cursor-pointer"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            /* 我上传的数据集 Table */
            <div className="bg-white rounded-md border border-[#EAEAEA] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
                  <tr>
                    <th className="py-3.5 px-4">数据集名称</th>
                    <th className="py-3.5 px-4">模态</th>
                    <th className="py-3.5 px-4">数据集大小</th>
                    <th className="py-3.5 px-4">上传时间</th>
                    <th className="py-3.5 px-4">状态</th>
                    <th className="py-3.5 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F2F2] text-[#333333]">
                  {createdDatasets.map((ds) => {
                    const isPending = ds.status === '待审核';
                    const isRejected = ds.status === '已驳回';
                    const isListed = ds.status === '已上架';

                    return (
                      <tr key={ds.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#1A1A1A]">{ds.name}</div>
                          <div className="text-[11px] text-[#888888] mt-0.5 max-w-xs truncate">
                            {ds.brief || ds.description?.slice(0, 35) || '暂无描述'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-[#F5F5F5] text-[#4B5563] border border-[#EAEAEA] text-[11px] font-medium">
                            {ds.modalityCategory || '表格数据'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono tabular-nums font-medium text-[#333333]">
                          {ds.fileSize || ds.scale || '18.4 MB'}
                        </td>

                        <td className="py-3.5 px-4 text-[#888888] font-mono tabular-nums text-[11px]">
                          {ds.updatedAt || '2025-05-20'}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                            isListed
                              ? 'text-[#166534]'
                              : isPending
                              ? 'text-[#666666]'
                              : isRejected
                              ? 'text-[#991B1B]'
                              : 'text-[#888888]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isListed
                                ? 'bg-[#15803D]'
                                : isPending
                                ? 'bg-[#D97706]'
                                : isRejected
                                ? 'bg-[#991B1B]'
                                : 'bg-[#9CA3AF]'
                            }`} />
                            {isListed ? '已上架' : isPending ? '待审核' : isRejected ? '已驳回' : '未上架'}
                          </span>
                          {isRejected && ds.auditReason && (
                            <div className="text-[10px] text-[#991B1B] mt-0.5 max-w-xs truncate" title={ds.auditReason}>
                              驳回: {ds.auditReason}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* 1. 待审核: 支持【详情】和【删除】 */}
                          {isPending && (
                            <>
                              <button
                                onClick={() => setReadOnlyDatasetModal(ds)}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#333333] hover:text-[#1A1A1A] text-xs font-medium transition cursor-pointer"
                              >
                                详情
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`确定要删除待审核的数据集【${ds.name}】吗？`)) {
                                    deleteDataset(ds.id);
                                    showToast(`待审核数据集【${ds.name}】已成功删除`);
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#FEF2F2] text-[#991B1B] border border-[#E5C5C5] text-xs font-medium transition cursor-pointer"
                              >
                                删除
                              </button>
                            </>
                          )}

                          {/* 2. 已驳回: 支持【修改】和【删除】 */}
                          {isRejected && (
                            <>
                              <button
                                onClick={() => setEditingDataset(ds)}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#1A1A1A] text-xs font-medium transition cursor-pointer"
                              >
                                修改
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`确定要删除驳回的数据集【${ds.name}】吗？`)) {
                                    deleteDataset(ds.id);
                                    showToast(`数据集【${ds.name}】已成功删除`);
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#FEF2F2] text-[#991B1B] border border-[#E5C5C5] text-xs font-medium transition cursor-pointer"
                              >
                                删除
                              </button>
                            </>
                          )}

                          {/* 3. 未上架 / 已上架: 支持【详情】、【上架/下架】和【删除】 */}
                          {!isPending && !isRejected && (
                            <>
                              <button
                                onClick={() => setReadOnlyDatasetModal(ds)}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#333333] hover:text-[#1A1A1A] text-xs font-medium transition cursor-pointer"
                              >
                                详情
                              </button>

                              {isListed ? (
                                <button
                                  onClick={() => {
                                    toggleDatasetStatus(ds.id, '已下架');
                                    showToast(`数据集【${ds.name}】已下架`);
                                  }}
                                  className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#333333] hover:text-[#1A1A1A] text-xs font-medium transition cursor-pointer"
                                >
                                  下架
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    toggleDatasetStatus(ds.id, '已上架');
                                    showToast(`数据集【${ds.name}】已成功上架`);
                                  }}
                                  className="px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-medium transition cursor-pointer"
                                >
                                  上架
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (confirm(`确定要删除数据集【${ds.name}】吗？`)) {
                                    deleteDataset(ds.id);
                                    showToast(`数据集【${ds.name}】已成功删除`);
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#FEF2F2] text-[#991B1B] border border-[#E5C5C5] text-xs font-medium transition cursor-pointer"
                              >
                                删除
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* 3. SubTab: 我的 Skill */}
      {activeAssetTab === 'skills' && (
        <div className="space-y-5">
          {/* Sub-level Tabs: 我创建的 / 已下载的 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAEAEA]">
            <div className="flex items-center gap-1 bg-[#F5F5F5] border border-[#EAEAEA] p-1 rounded-md">
              <button
                type="button"
                onClick={() => setSkillScopeTab('created')}
                className={`px-3.5 py-1.5 rounded text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                  skillScopeTab === 'created'
                    ? 'bg-white text-[#1A1A1A] font-semibold border border-[#E0E0E0]'
                    : 'text-[#666666] hover:text-[#1A1A1A]'
                }`}
              >
                <span>我创建的 Skill</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                  skillScopeTab === 'created' ? 'bg-[#1A1A1A] text-white' : 'bg-[#EAEAEA] text-[#555555]'
                }`}>
                  {skills.filter(s => s.isCreatedByMe || s.uploaderType === 'user').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSkillScopeTab('downloaded')}
                className={`px-3.5 py-1.5 rounded text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                  skillScopeTab === 'downloaded'
                    ? 'bg-white text-[#1A1A1A] font-semibold border border-[#E0E0E0]'
                    : 'text-[#666666] hover:text-[#1A1A1A]'
                }`}
              >
                <span>已下载的 Skill</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                  skillScopeTab === 'downloaded' ? 'bg-[#1A1A1A] text-white' : 'bg-[#EAEAEA] text-[#555555]'
                }`}>
                  {skillDownloads.length}
                </span>
              </button>
            </div>

            <div className="text-xs text-[#666666]">
              管理与调试 Agent 扩展插件工具箱
            </div>
          </div>

          {skillScopeTab === 'downloaded' ? (
            /* 已下载的 Skill Table */
            <div className="bg-white rounded-md border border-[#EAEAEA] overflow-hidden">
              {skillDownloads.length === 0 ? (
                <div className="p-12 text-center text-[#888888] text-xs">
                  暂无下载记录。您可以在 Skill 插件集市中浏览并极速下载需要的工具插件。
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
                    <tr>
                      <th className="py-3.5 px-4">Skill 名称</th>
                      <th className="py-3.5 px-4">slug</th>
                      <th className="py-3.5 px-4">场景分类</th>
                      <th className="py-3.5 px-4">上传者</th>
                      <th className="py-3.5 px-4">下载时间</th>
                      <th className="py-3.5 px-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F2F2] text-[#333333]">
                    {skillDownloads.map(rec => {
                      const targetSk = skills.find(s => s.id === rec.skillId);
                      return (
                        <tr key={rec.id} className="hover:bg-[#FAFAFA] transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">{rec.skillName}</td>
                          <td className="py-3.5 px-4">
                            <code className="px-1.5 py-0.5 rounded bg-[#F5F5F5] border border-[#EAEAEA] font-mono text-[11px] text-[#4B5563]">
                              {targetSk?.repoPath || rec.skillId}
                            </code>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-[#F5F5F5] text-[#4B5563] border border-[#EAEAEA] text-[11px] font-medium">
                              {rec.category || targetSk?.category || '效率工具'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#666666]">
                            {rec.uploaderName || rec.developer || targetSk?.developer || '极客社区'}
                          </td>
                          <td className="py-3.5 px-4 text-[#888888] font-mono tabular-nums text-[11px]">
                            {rec.downloadTime || rec.downloadedAt}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => {
                                if (targetSk) setReadOnlySkillModal(targetSk);
                                else showToast(`查看【${rec.skillName}】详情`);
                              }}
                              className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#333333] hover:text-[#1A1A1A] font-medium text-xs cursor-pointer transition"
                            >
                              详情
                            </button>
                            <button
                              onClick={() => {
                                if (targetSk) downloadSkill(targetSk);
                                showToast(`已重新下载 Skill【${rec.skillName}】`);
                              }}
                              className="px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-[#333333] text-white font-medium text-xs cursor-pointer transition"
                            >
                              再次下载
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`确定要从已下载列表中移除 Skill【${rec.skillName}】吗？`)) {
                                  setSkillDownloads(prev => prev.filter(r => r.id !== rec.id));
                                  showToast(`已删除 Skill【${rec.skillName}】下载记录`);
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-white hover:bg-[#FEF2F2] text-[#991B1B] border border-[#E5C5C5] text-xs font-medium transition cursor-pointer"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            /* 我创建的 Skill Table */
            <div className="bg-white rounded-md border border-[#EAEAEA] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
                  <tr>
                    <th className="py-3.5 px-4">skill名称</th>
                    <th className="py-3.5 px-4">slug</th>
                    <th className="py-3.5 px-4">场景分类</th>
                    <th className="py-3.5 px-4">创建时间</th>
                    <th className="py-3.5 px-4">状态</th>
                    <th className="py-3.5 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F2F2] text-[#333333]">
                  {skills.map((sk) => {
                    const isPending = sk.status === '待审核';
                    const isRejected = sk.status === '已驳回';
                    const isListed = sk.status === '已上架';

                    const slugVal = sk.repoPath ? sk.repoPath.split('/')[1] || sk.id : sk.id;

                    return (
                      <tr key={sk.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">
                          {sk.name}
                        </td>

                        <td className="py-3.5 px-4">
                          <code className="px-1.5 py-0.5 rounded bg-[#F5F5F5] border border-[#EAEAEA] font-mono text-[11px] text-[#4B5563]">
                            {slugVal}
                          </code>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-[#F5F5F5] text-[#4B5563] text-[11px] font-medium border border-[#EAEAEA]">
                            {sk.category || '效率工具'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[#888888] font-mono tabular-nums text-[11px]">
                          {sk.updatedAt || '2025-05-20'}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                            isListed
                              ? 'text-[#166534]'
                              : isPending
                              ? 'text-[#666666]'
                              : isRejected
                              ? 'text-[#991B1B]'
                              : 'text-[#888888]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isListed
                                ? 'bg-[#15803D]'
                                : isPending
                                ? 'bg-[#D97706]'
                                : isRejected
                                ? 'bg-[#991B1B]'
                                : 'bg-[#9CA3AF]'
                            }`} />
                            {isListed ? '已上架' : isPending ? '待审核' : isRejected ? '已驳回' : '未上架'}
                          </span>
                          {isRejected && sk.auditReason && (
                            <div className="text-[10px] text-[#991B1B] mt-0.5 max-w-xs truncate" title={sk.auditReason}>
                              驳回: {sk.auditReason}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* 1. 待审核: 支持【详情】和【删除】 */}
                          {isPending && (
                            <>
                              <button
                                onClick={() => setReadOnlySkillModal(sk)}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#333333] hover:text-[#1A1A1A] text-xs font-medium transition cursor-pointer"
                              >
                                详情
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`确定要删除待审核的 Skill 插件【${sk.name}】吗？`)) {
                                    deleteSkill(sk.id);
                                    showToast(`待审核 Skill 插件【${sk.name}】已成功删除`);
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#FEF2F2] text-[#991B1B] border border-[#E5C5C5] text-xs font-medium transition cursor-pointer"
                              >
                                删除
                              </button>
                            </>
                          )}

                          {/* 2. 已驳回: 支持【修改】和【删除】，修改后再次提交 */}
                          {isRejected && (
                            <>
                              <button
                                onClick={() => setEditingSkill(sk)}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#1A1A1A] text-xs font-medium transition cursor-pointer"
                              >
                                修改
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`确定要删除驳回的 Skill 插件【${sk.name}】吗？`)) {
                                    deleteSkill(sk.id);
                                    showToast(`Skill 插件【${sk.name}】已成功删除`);
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#FEF2F2] text-[#991B1B] border border-[#E5C5C5] text-xs font-medium transition cursor-pointer"
                              >
                                删除
                              </button>
                            </>
                          )}

                          {/* 3. 未上架 / 已上架: 支持【详情】、【上架/下架】和【删除】 */}
                          {!isPending && !isRejected && (
                            <>
                              <button
                                onClick={() => setReadOnlySkillModal(sk)}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#333333] hover:text-[#1A1A1A] text-xs font-medium transition cursor-pointer"
                              >
                                详情
                              </button>

                              {isListed ? (
                                <button
                                  onClick={() => {
                                    toggleSkillStatus(sk.id, '已下架');
                                    showToast(`Skill【${sk.name}】已成功下架`);
                                  }}
                                  className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#333333] hover:text-[#1A1A1A] text-xs font-medium transition cursor-pointer"
                                >
                                  下架
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    toggleSkillStatus(sk.id, '已上架');
                                    showToast(`Skill【${sk.name}】已成功上架`);
                                  }}
                                  className="px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-medium transition cursor-pointer"
                                >
                                  上架
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (confirm(`确定要删除 Skill 插件【${sk.name}】吗？`)) {
                                    deleteSkill(sk.id);
                                    showToast(`Skill 插件【${sk.name}】已成功删除`);
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-white hover:bg-[#FEF2F2] text-[#991B1B] border border-[#E5C5C5] text-xs font-medium transition cursor-pointer"
                              >
                                删除
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 只读数据集详情弹窗 */}
      {readOnlyDatasetModal && (
        <DatasetReadOnlyModal
          dataset={readOnlyDatasetModal}
          onClose={() => setReadOnlyDatasetModal(null)}
          onDownload={(ds) => downloadDataset(ds)}
        />
      )}

      {/* 只读 Skill 详情弹窗 */}
      {readOnlySkillModal && (
        <SkillReadOnlyModal
          skill={readOnlySkillModal}
          onClose={() => setReadOnlySkillModal(null)}
          onDownload={(sk) => downloadSkill(sk)}
        />
      )}

      {/* 编辑 Skill (驳回状态下编辑并重新提交) */}
      {editingSkill && (
        <SkillEditModal
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
          onSave={(updates) => {
            updateSkill(editingSkill.id, {
              ...updates,
              status: '待审核',
              auditReason: undefined
            });
            showToast(`Skill 插件【${updates.name || editingSkill.name}】已修改并重新提交`);
            setEditingSkill(null);
          }}
        />
      )}

      {/* 编辑数据集 (驳回状态下编辑并重新提交) */}
      {editingDataset && (
        <DatasetEditModal
          dataset={editingDataset}
          onClose={() => setEditingDataset(null)}
          onSave={(updates) => {
            updateDataset(editingDataset.id, updates);
            showToast(`数据集【${updates.name || editingDataset.name}】已修改并重新提交`);
            setEditingDataset(null);
          }}
        />
      )}

    </div>
  );
};
