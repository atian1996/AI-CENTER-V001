import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../../context/AppContext';
import { SkillPluginItem, AdminMenuKey } from '../../../types';
import {
  Puzzle,
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  ArrowLeft,
  Upload,
  Folder,
  FileArchive,
  CheckCircle2,
  Zap,
  Sparkles,
  Terminal,
  FileText,
  BarChart3,
  Code2,
  BookOpen,
  Bot,
  Palette,
  Check,
  Eye,
  X,
  FileCode,
  ShieldCheck,
  Clock,
  XCircle,
  ChevronRight,
  FolderTree,
  Tag
} from 'lucide-react';
import { MarkdownEditor, DEFAULT_SKILL_OVERVIEW_TEMPLATE } from '../../common/MarkdownEditor';

interface SkillAdminViewProps {
  activeSubMenu?: AdminMenuKey;
}

export const SkillAdminView: React.FC<SkillAdminViewProps> = ({ activeSubMenu }) => {
  if (activeSubMenu === 'skill_audit') {
    return <SkillAuditAdminView />;
  }

  const { skills, setSkills, showToast } = useApp();

  // Mode: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingSkill, setEditingSkill] = useState<SkillPluginItem | null>(null);

  // Filter state for list
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');

  // Form States (Matches "创建SKILL.png" design strictly)
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [slug, setSlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState('知识管理');
  const [iconType, setIconType] = useState<'preset' | 'custom'>('preset');
  const [selectedPresetIcon, setSelectedPresetIcon] = useState('Zap');
  const [customIconUrl, setCustomIconUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // Tags (最多 5 个，对应前台 skill 详情中顶部 skill 描述下方的几个标签)
  const [tags, setTags] = useState<string[]>(['知识管理', '自动化']);
  const [tagInput, setTagInput] = useState('');

  // 概述 (Markdown 编辑器，对应前台 skill 详情中的概述内容)
  const [overviewMarkdown, setOverviewMarkdown] = useState(DEFAULT_SKILL_OVERVIEW_TEMPLATE);
  const [previewModalSkill, setPreviewModalSkill] = useState<SkillPluginItem | null>(null);

  const categoriesList = [
    '知识管理',
    '效率工具',
    '数据分析',
    '内容创作',
    '编程开发',
    '图像影音',
    '生活娱乐'
  ];

  const presetIcons = [
    { name: 'Zap', label: '闪电/通用', icon: <Zap className="w-5 h-5 text-amber-400" /> },
    { name: 'Terminal', label: '终端/代码', icon: <Terminal className="w-5 h-5 text-indigo-400" /> },
    { name: 'FileText', label: '文档/知识', icon: <FileText className="w-5 h-5 text-blue-400" /> },
    { name: 'BarChart3', label: '图表/数据', icon: <BarChart3 className="w-5 h-5 text-emerald-400" /> },
    { name: 'Code2', label: '开发/云端', icon: <Code2 className="w-5 h-5 text-sky-400" /> },
    { name: 'BookOpen', label: '阅读/研报', icon: <BookOpen className="w-5 h-5 text-amber-500" /> },
    { name: 'Sparkles', label: '智能/AI', icon: <Sparkles className="w-5 h-5 text-purple-400" /> },
    { name: 'Bot', label: 'Agent机器人', icon: <Bot className="w-5 h-5 text-violet-400" /> },
    { name: 'Palette', label: '设计/多媒体', icon: <Palette className="w-5 h-5 text-rose-400" /> }
  ];

  const handleAddTag = (tagToAdd?: string) => {
    const rawTag = (tagToAdd !== undefined ? tagToAdd : tagInput).trim();
    if (!rawTag) return;

    if (tags.length >= 5) {
      showToast('最多可添加 5 个标签！');
      return;
    }

    if (tags.includes(rawTag)) {
      showToast('该标签已存在！');
      return;
    }

    setTags(prev => [...prev, rawTag]);
    if (tagToAdd === undefined) {
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleOpenCreate = () => {
    setEditingSkill(null);
    setSlug('');
    setDisplayName('');
    setCategory('知识管理');
    setIconType('preset');
    setSelectedPresetIcon('Zap');
    setCustomIconUrl('');
    setDescription('');
    setTags(['知识管理', '自动化']);
    setTagInput('');
    setOverviewMarkdown(DEFAULT_SKILL_OVERVIEW_TEMPLATE);
    setFileUploaded(false);
    setUploadedFileName('');
    setViewMode('create');
  };

  const handleOpenEdit = (skill: SkillPluginItem) => {
    setEditingSkill(skill);
    setSlug(skill.id || skill.repoPath || '');
    setDisplayName(skill.name);
    setCategory(skill.category || '知识管理');
    setIconType('preset');
    setSelectedPresetIcon('Zap');
    setCustomIconUrl('');
    setDescription(skill.description);
    setTags(skill.tags && skill.tags.length > 0 ? [...skill.tags] : ['知识管理']);
    setTagInput('');
    setOverviewMarkdown(skill.overviewMarkdown || DEFAULT_SKILL_OVERVIEW_TEMPLATE);
    setFileUploaded(true);
    setUploadedFileName(`${skill.id || 'skill'}.zip (1.2 MB)`);
    setViewMode('edit');
  };

  const handleSimulateSelectFolder = () => {
    setFileUploaded(true);
    setUploadedFileName(`skill-package-${slug || 'folder'}/ (含 SKILL.md, 14个文件)`);
    showToast('文件夹已选中，自动解析 SKILL.md 文件结构成功！');
  };

  const handleSimulateSelectZip = () => {
    setFileUploaded(true);
    setUploadedFileName(`${slug || 'skill-bundle'}-v1.0.0.zip (1.8 MB)`);
    showToast('ZIP 压缩包已解析，SKILL.md 验证通过！');
  };

  const handleSimulateUploadImage = () => {
    const mockAvatar = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';
    setCustomIconUrl(mockAvatar);
    showToast('自定义 Icon 图片上传成功！经过系统合规审核');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim()) {
      showToast('请输入唯一标识 Slug！');
      return;
    }
    if (!displayName.trim()) {
      showToast('请输入显示名称！');
      return;
    }

    if (viewMode === 'create') {
      const newSkill: SkillPluginItem = {
        id: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: displayName.trim(),
        category: category,
        developer: '系统管理员',
        developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        version: 'v1.0.0',
        updatedAt: '刚刚',
        installs: 0,
        downloadsCount: 0,
        description: description || '暂无详细描述信息',
        tags: tags.length > 0 ? tags : ['知识管理'],
        overviewMarkdown: overviewMarkdown.trim(),
        compatibleAgents: '全量 Agent 兼容',
        requiredPermissions: ['网络访问', '本地沙盒'],
        packageFormat: 'ZIP / Skill 包',
        packageSize: '1.8 MB',
        repoPath: `@official/${slug.trim()}`
      };
      setSkills(prev => [newSkill, ...prev]);
      showToast(`Skill 插件【${displayName}】创建成功！`);
    } else if (viewMode === 'edit' && editingSkill) {
      setSkills(prev =>
        prev.map(item => {
          if (item.id === editingSkill.id) {
            return {
              ...item,
              name: displayName.trim(),
              category: category,
              description: description || item.description,
              tags: tags.length > 0 ? tags : ['知识管理'],
              overviewMarkdown: overviewMarkdown.trim()
            };
          }
          return item;
        })
      );
      showToast(`Skill 插件【${displayName}】更新成功！`);
    }

    setViewMode('list');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`确定要删除 Skill 插件【${name}】吗？删除后不可恢复。`)) {
      setSkills(prev => prev.filter(s => s.id !== id));
      showToast(`已成功删除 Skill 插件【${name}】`);
    }
  };

  // Filter skills list
  const filteredList = skills.filter(item => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === '全部' || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Render Editor Page (Matching System Admin Dark Theme Style)
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100 shadow-2xl animate-fade-in select-none">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>返回 Skill 列表</span>
            </button>
            <div>
              <h1 className="text-base font-black text-white">
                {viewMode === 'create' ? '创建 Skill 插件' : `编辑 Skill: ${editingSkill?.name}`}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                上传 SKILL.md 扩展包，配置场景分类与交互标识
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer border border-slate-700/60"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>保存 Skill</span>
            </button>
          </div>
        </div>

        {/* Form Container (Strictly matching "创建SKILL.png" with System Theme) */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          
          {/* 1. Skill 压缩包文件 * */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Skill 压缩包文件 <span className="text-rose-400">*</span>
            </label>

            {/* Drag & Drop Upload Zone */}
            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-950/70 hover:bg-slate-950 rounded-2xl p-8 text-center transition cursor-pointer space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
                <FileArchive className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-200">
                  拖拽 ZIP 压缩包到此处，或点击按钮上传
                </p>
                <p className="text-[11px] text-slate-400">
                  请确保压缩包中包含 SKILL.md 核心指令文件（总大小不超过 10.00 MB）
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSimulateSelectZip}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <FileArchive className="w-4 h-4" />
                  <span>选择 ZIP 压缩包</span>
                </button>
              </div>
            </div>

            {/* File status if selected */}
            {fileUploaded && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono font-medium">{uploadedFileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileUploaded(false);
                    setUploadedFileName('');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer text-[11px]"
                >
                  重新选择
                </button>
              </div>
            )}
          </div>

          {/* 2. Slug * */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Slug <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="Skill 的唯一标识符，仅允许小写字母、数字和连字符"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition"
            />
          </div>

          {/* 3. 显示名称 * */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              显示名称 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Skill 显示名称"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition"
            />
          </div>

          {/* 4. 场景分类 * (Required additional field corresponding to frontend) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              场景分类 <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {categoriesList.map(catItem => {
                const isSelected = category === catItem;
                return (
                  <button
                    type="button"
                    key={catItem}
                    onClick={() => setCategory(catItem)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {catItem}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 图标 */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              图标
            </label>

            {/* Tabs: 预设图标 | 自定义 */}
            <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setIconType('preset')}
                className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                  iconType === 'preset'
                    ? 'bg-slate-800 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                预设图标
              </button>
              <button
                type="button"
                onClick={() => setIconType('custom')}
                className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                  iconType === 'custom'
                    ? 'bg-slate-800 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                自定义
              </button>
            </div>

            {/* Preset Icon Selector */}
            {iconType === 'preset' ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
                {presetIcons.map(item => {
                  const isSel = selectedPresetIcon === item.name;
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => setSelectedPresetIcon(item.name)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                        isSel
                          ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300 ring-1 ring-indigo-500/30'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[11px] font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Custom Upload Button */
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSimulateUploadImage}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                  >
                    点击上传图片
                  </button>
                  {customIconUrl && (
                    <img
                      src={customIconUrl}
                      alt="Icon Preview"
                      className="w-10 h-10 rounded-xl border border-slate-700 object-cover shadow-2xs"
                    />
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  支持 jpg / png / webp，最大 5MB；上传后需经过合规审核。
                </p>
              </div>
            )}
          </div>

          {/* 6. 描述 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              描述
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="请输入 Skill 描述，将展示在插件卡片与详情页顶部简介处"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition resize-none"
            />
          </div>

          {/* 7. 标签 (最多5个) - 对应前台skill详情中，顶部skill描述下方的几个标签 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <span>Skill 标签</span>
                <span className="text-[11px] font-normal text-slate-500 font-mono">
                  (最多添加 5 个，对应前台详情页顶部描述下方标签，当前 {tags.length}/5)
                </span>
              </label>
              {tags.length >= 5 && (
                <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/80">
                  已达上限 5 个
                </span>
              )}
            </div>

            {/* Tags list */}
            <div className="flex flex-wrap items-center gap-2 min-h-[38px] p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
              {tags.length === 0 ? (
                <span className="text-xs text-slate-500 pl-1">暂无标签，请在下方输入或点击快捷推荐添加</span>
              ) : (
                tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/60 text-indigo-300 text-xs font-medium shadow-2xs group"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="w-4 h-4 rounded-full hover:bg-indigo-900 flex items-center justify-center text-indigo-400 hover:text-white transition cursor-pointer"
                      title="移除此标签"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Tag Input row */}
            {tags.length < 5 && (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="输入自定义标签名称后按回车或点击添加 (如: 投资研究、数据清洗)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="px-4 py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/80 text-xs font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加标签</span>
                </button>
              </div>
            )}

            {/* Suggested tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-slate-500">快捷添加:</span>
              {['金融分析', '行业专业', '代码审查', '多维表格', '自动化', '办公效率', '知识管理', '研报生成']
                .filter(t => !tags.includes(t))
                .slice(0, 6)
                .map(suggested => (
                  <button
                    key={suggested}
                    type="button"
                    disabled={tags.length >= 5}
                    onClick={() => handleAddTag(suggested)}
                    className="px-2.5 py-0.5 rounded-md bg-slate-950 hover:bg-indigo-950 text-slate-400 hover:text-indigo-300 hover:border-indigo-800 border border-slate-800 text-[11px] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    + {suggested}
                  </button>
                ))}
            </div>
          </div>

          {/* 8. 概述 (Markdown 编辑器) - 对应前台skill详情中的概述中的内容 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Skill 概述 (Markdown 编辑器)</span>
                <span className="text-[11px] font-normal text-slate-500">
                  (对应前台 Skill 详情页【概述】选项卡中渲染的内容)
                </span>
              </label>
            </div>

            <MarkdownEditor
              value={overviewMarkdown}
              onChange={setOverviewMarkdown}
              theme="dark"
              placeholder="在此以 Markdown 格式编写 Skill 插件详细概述（知识产权、使用许可、免责声明、架构及核心模块说明）..."
            />
          </div>

        </form>
      </div>
    );
  }

  // List View Mode (Matching System Admin Dark Theme Style)
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100 shadow-2xl animate-fade-in select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Puzzle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-white tracking-tight">
              Skill 插件管理
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              统一管理平台挂载的 Agent Skill 扩展包，控制场景分类与版本发布
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>创建 SKILL</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索 Skill 名称 / Slug / 描述..."
              className="w-full bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer"
            >
              <option value="全部">全部分类 ({skills.length})</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-mono text-[11px] self-end md:self-auto">
          共 {filteredList.length} 项 Skill 插件
        </div>
      </div>

      {/* Table List */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">Skill 标识 / 名称</th>
                <th className="py-3.5 px-4">创建者</th>
                <th className="py-3.5 px-4">场景分类</th>
                <th className="py-3.5 px-4">版本 / 大小</th>
                <th className="py-3.5 px-4">简介描述</th>
                <th className="py-3.5 px-4">更新时间</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredList.map(sk => (
                <tr key={sk.id} className="hover:bg-slate-800/40 transition">
                  {/* Skill Name & Slug */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 font-bold">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">
                          {sk.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 truncate">
                          {sk.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Creator */}
                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-indigo-400 shrink-0">
                        {(sk.uploaderName || sk.developer || '管')[0].toUpperCase()}
                      </div>
                      <span className="truncate max-w-[90px]">{sk.uploaderName || sk.developer || '系统管理员'}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 font-bold text-[11px]">
                      {sk.category}
                    </span>
                  </td>

                  {/* Version & Size */}
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="text-slate-200 font-bold">{sk.version}</div>
                    <div className="text-slate-500">{sk.packageSize || '1.8 MB'}</div>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-slate-400 truncate" title={sk.description}>
                      {sk.description}
                    </p>
                  </td>

                  {/* Updated At */}
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {sk.updatedAt || '最近更新'}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewModalSkill(sk)}
                        title="预览完整 Skill"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(sk)}
                        title="编辑 Skill"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(sk.id, sk.name)}
                        title="删除 Skill"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    未检索到符合条件的 Skill 插件
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewModalSkill && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-2xl w-full p-6 space-y-4 shadow-2xl text-slate-100 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">
                  {previewModalSkill.name} (SKILL.md 规范预览)
                </h3>
              </div>
              <button
                onClick={() => setPreviewModalSkill(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs space-y-2 max-h-80 overflow-y-auto border border-slate-800">
              <div className="text-emerald-400"># SKILL.md Manifest Specification</div>
              <div>name: {previewModalSkill.name}</div>
              <div>slug: {previewModalSkill.id}</div>
              <div>creator: {previewModalSkill.uploaderName || previewModalSkill.developer || '平台管理员'}</div>
              <div>category: {previewModalSkill.category}</div>
              <div>version: {previewModalSkill.version}</div>
              <div>description: {previewModalSkill.description}</div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewModalSkill(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition border border-slate-700"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// ============================================================================
// Skill 审核视图 (SkillAuditAdminView)
// ============================================================================

export const SkillAuditAdminView: React.FC = () => {
  const { skills, setSkills, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<'全部' | '待审核' | '已通过' | '已驳回'>('待审核');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Skill State
  const [detailSkill, setDetailSkill] = useState<SkillPluginItem | null>(null);
  const [rejectModalSkill, setRejectModalSkill] = useState<SkillPluginItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Active File Tab in Detail Modal File Structure Preview
  const [activeFileKey, setActiveFileKey] = useState<'SKILL.md' | 'scripts/main.py' | 'package.json' | 'requirements.txt'>('SKILL.md');

  // Filter skills list
  const filteredAuditList = React.useMemo(() => {
    return skills.filter(sk => {
      const status = sk.status || '已上架';
      if (statusFilter !== '全部') {
        if (statusFilter === '待审核' && status !== '待审核') return false;
        if (statusFilter === '已通过' && status !== '已通过' && status !== '已上架' && status !== '已下架') return false;
        if (statusFilter === '已驳回' && status !== '已驳回') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = sk.name.toLowerCase().includes(q);
        const matchSlug = sk.id.toLowerCase().includes(q);
        const matchCreator = (sk.uploaderName || sk.developer || '').toLowerCase().includes(q);
        if (!matchName && !matchSlug && !matchCreator) return false;
      }
      return true;
    });
  }, [skills, statusFilter, searchQuery]);

  const handleApprove = (sk: SkillPluginItem) => {
    setSkills(prev => prev.map(item => {
      if (item.id === sk.id) {
        return {
          ...item,
          status: '未上架' as any, // 刚通过审核的 skill 默认为下架/未上架状态，由用户在前台自行上架
          auditReason: ''
        };
      }
      return item;
    }));
    showToast(`Skill 插件【${sk.name}】审核通过！默认初始为下架状态，用户可随时在上架操作。`);
    if (detailSkill?.id === sk.id) {
      setDetailSkill(null);
    }
  };

  const handleOpenRejectModal = (sk: SkillPluginItem) => {
    setRejectModalSkill(sk);
    setRejectReason(sk.auditReason || '');
  };

  const handleConfirmReject = () => {
    if (!rejectModalSkill) return;
    if (!rejectReason.trim()) {
      showToast('请输入驳回原因！');
      return;
    }
    setSkills(prev => prev.map(item => {
      if (item.id === rejectModalSkill.id) {
        return {
          ...item,
          status: '已驳回' as any,
          auditReason: rejectReason.trim()
        };
      }
      return item;
    }));
    showToast(`已驳回 Skill 插件【${rejectModalSkill.name}】审核申请`);
    if (detailSkill?.id === rejectModalSkill.id) {
      setDetailSkill(null);
    }
    setRejectModalSkill(null);
    setRejectReason('');
  };

  // Mock File Content map for tree preview
  const getFileContent = (file: string, sk: SkillPluginItem) => {
    switch (file) {
      case 'SKILL.md':
        return `---
name: "${sk.name}"
description: "${sk.description}"
version: "${sk.version}"
author: "${sk.uploaderName || sk.developer || '平台管理员'}"
category: "${sk.category}"
---

# ${sk.name}

## 概述
${sk.description}

## 安装与依赖
- Python >= 3.10
- pydantic >= 2.0.0
- requests >= 2.28.0

## 调用指南
\`\`\`python
from skill_runner import run_skill

result = run_skill("${sk.id}", input_data={"query": "hello world"})
print(result)
\`\`\`
`;
      case 'scripts/main.py':
        return `# -*- coding: utf-8 -*-
"""
Main Entry point for Skill: ${sk.name} (${sk.id})
Author: ${sk.uploaderName || sk.developer || 'Developer'}
"""

import sys
import json

def execute_skill(params: dict) -> dict:
    # Core execution logic for ${sk.name}
    query = params.get("query", "")
    return {
        "status": "success",
        "output": f"Processed: {query}",
        "skill_id": "${sk.id}"
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        args = json.loads(sys.argv[1])
        print(json.dumps(execute_skill(args)))
`;
      case 'package.json':
        return `{
  "name": "${sk.id}",
  "version": "${sk.version}",
  "description": "${sk.description}",
  "main": "scripts/main.py",
  "author": "${sk.uploaderName || sk.developer || 'Developer'}",
  "license": "MIT"
}`;
      case 'requirements.txt':
        return `pydantic>=2.0.0\nrequests>=2.28.0\ntyping-extensions>=4.5.0`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['待审核', '已通过', '已驳回', '全部'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索 Skill 名称 / slug / 上传者..."
              className="w-full bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:border-indigo-500 outline-none transition"
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          共找到 <span className="text-indigo-400 font-bold">{filteredAuditList.length}</span> 项 Skill 审核队列
        </div>
      </div>

      {/* Audit List Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800 select-none">
              <tr>
                <th className="p-4 min-w-[220px]">Skill 名称 / slug</th>
                <th className="p-4 min-w-[120px]">上传者</th>
                <th className="p-4 min-w-[100px]">版本</th>
                <th className="p-4 min-w-[100px]">文件大小</th>
                <th className="p-4 min-w-[140px]">上传时间</th>
                <th className="p-4 min-w-[100px]">状态</th>
                <th className="p-4 min-w-[180px] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredAuditList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-slate-600 mb-3" />
                    <div className="text-sm font-bold text-slate-400">暂无符合条件的 Skill 审核申请</div>
                  </td>
                </tr>
              ) : (
                filteredAuditList.map(sk => {
                  const status = sk.status || '已上架';
                  const isPending = status === '待审核';
                  const isApproved = status === '已通过' || status === '已上架' || status === '已下架';
                  const isRejected = status === '已驳回';

                  return (
                    <tr key={sk.id} className="hover:bg-slate-800/40 transition">
                      {/* Name & Slug */}
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5 text-indigo-400">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="font-bold text-white truncate max-w-xs">{sk.name}</div>
                            <div className="text-[11px] font-mono text-slate-500 truncate">{sk.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Uploader / Creator */}
                      <td className="p-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-indigo-400 shrink-0">
                            {(sk.uploaderName || sk.developer || '管')[0].toUpperCase()}
                          </div>
                          <span className="truncate max-w-[100px]">{sk.uploaderName || sk.developer || '平台管理员'}</span>
                        </div>
                      </td>

                      {/* Version */}
                      <td className="p-4 font-mono font-bold text-slate-200">
                        {sk.version}
                      </td>

                      {/* Size */}
                      <td className="p-4 font-mono text-slate-300">
                        {sk.packageSize || '1.8 MB'}
                      </td>

                      {/* Time */}
                      <td className="p-4 font-mono text-slate-400 text-[11px]">
                        {sk.updatedAt || '2026-08-22 16:20'}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-[11px] flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" />
                            <span>待审核</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>已通过</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-[11px] flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3" />
                            <span>已驳回</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailSkill(sk)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>查看详情</span>
                          </button>
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(sk)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>通过</span>
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(sk)}
                                className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>驳回</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {detailSkill && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{detailSkill.name} ({detailSkill.id})</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Skill 代码包结构预览与安全离线审计</p>
                </div>
              </div>
              <button
                onClick={() => setDetailSkill(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">一、基本参数</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500">上传者/创建人</span>
                  <div className="font-bold text-slate-200 truncate">{detailSkill.uploaderName || detailSkill.developer || '平台管理员'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500">场景分类</span>
                  <div className="font-bold text-slate-200 truncate">{detailSkill.category}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500">版本</span>
                  <div className="font-bold text-slate-200 font-mono">{detailSkill.version}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500">文件包大小</span>
                  <div className="font-bold text-slate-200 font-mono">{detailSkill.packageSize || '1.8 MB'}</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] text-slate-500 font-bold">Skill 描述说明</span>
                <p className="text-slate-300 leading-relaxed">{detailSkill.description}</p>
              </div>
            </div>

            {/* File Tree & Code Preview */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">二、代码文件结构预览 (Tree Preview)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden text-xs">
                {/* File Tree Left Sidebar */}
                <div className="p-3 border-r border-slate-800 space-y-1.5 bg-slate-950/60">
                  <div className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1 pb-2 border-b border-slate-800/80">
                    <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Package Root</span>
                  </div>
                  {(['SKILL.md', 'scripts/main.py', 'package.json', 'requirements.txt'] as const).map(file => (
                    <button
                      key={file}
                      onClick={() => setActiveFileKey(file)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between font-mono text-xs transition cursor-pointer ${
                        activeFileKey === file
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <span className="truncate">{file}</span>
                      <ChevronRight className="w-3 h-3 text-slate-600" />
                    </button>
                  ))}
                </div>

                {/* Code Preview Box */}
                <div className="md:col-span-2 p-3 font-mono text-[11px] text-slate-300 max-h-64 overflow-y-auto bg-slate-900/90 leading-relaxed whitespace-pre-wrap selection:bg-indigo-500/30">
                  <div className="text-indigo-400/80 font-bold pb-2 mb-2 border-b border-slate-800 flex items-center justify-between">
                    <span>// File: {activeFileKey}</span>
                    <span className="text-[10px] text-slate-500 font-normal">Read-only code preview</span>
                  </div>
                  {getFileContent(activeFileKey, detailSkill)}
                </div>
              </div>
            </div>

            {/* Security Scan */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">三、自动安全与代码静态审查结果</h4>
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-emerald-300">代码静态审计通过</div>
                  <div className="text-emerald-400/80 leading-relaxed">
                    经由 SonarQube & Bandit 代码审核扫描引擎检测：Skill 文件包内未发现恶意反弹 Shell、无提权命令、无未授权外部黑名单 IP 链接及敏感凭据硬编码风险。
                  </div>
                </div>
              </div>
            </div>

            {/* Reject Reason Display */}
            {detailSkill.status === '已驳回' && detailSkill.auditReason && (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1 text-xs">
                <div className="font-bold text-rose-400">驳回原因</div>
                <p className="text-rose-200">{detailSkill.auditReason}</p>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setDetailSkill(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                关闭
              </button>
              {(detailSkill.status || '已上架') === '待审核' && (
                <>
                  <button
                    onClick={() => handleOpenRejectModal(detailSkill)}
                    className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-300 text-xs font-bold transition cursor-pointer"
                  >
                    驳回申请
                  </button>
                  <button
                    onClick={() => handleApprove(detailSkill)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
                  >
                    通过审核
                  </button>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Reject Dialog */}
      {rejectModalSkill && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">驳回 Skill 审核</h3>
              <button
                onClick={() => setRejectModalSkill(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              请填写驳回 Skill【{rejectModalSkill.name}】的具体原因：
            </p>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入明确的驳回原因，如：代码存在未知死循环、缺少必要的 SKILL.md 定义描述等..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition resize-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalSkill(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
              >
                确认驳回
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

